<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Midtrans\Config;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;

        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'payment_method' => ['required', 'in:CASH,QRIS'],
        ]);
        $order = Order::findOrFail($validated['order_id']);
        $existingPayment = Payment::where('order_id', $order->id)->latest()->first();
        if ($existingPayment) {
            if ($existingPayment->status === 'SUCCESS') {
                return response()->json([
                    'msg' => 'Pembayaran unttuk order ini sudah dibayarkan',
                    'data' => $existingPayment
                ], 409);
            }
            if ($existingPayment->status === 'PENDING') {
                return response()->json([
                    'msg' => 'Pembayaran untuk order ini masih pending',
                    'data' => $existingPayment
                ], 200);
            }
        }
        $amount = $order->total_amount; // ambil total dari database setelah order dibuat
        // if ($order->payment)
        if ($validated['payment_method'] === 'CASH') {
            if ($existingPayment && $existingPayment->status === 'FAILED') {
                $payment = $existingPayment;
                $payment->update([
                    'payment_method' => 'CASH',
                    'amount' => $amount,
                    'transaction_id' => null,
                    'qr_code' => null,
                    'paid_at' => null,
                    'status' => 'PENDING',
                ]);
            } else {
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => 'CASH',
                    'amount' => $amount,
                    'transaction_id' => null,
                    'status' => 'PENDING',
                ]);
            }
            return response()->json([
                'msg' => 'CASH berhasil dibuat',
                'data' => $payment
            ]);
        } elseif ($validated['payment_method'] === 'QRIS') {
            $response = Http::withBasicAuth(config('midtrans.server_key'), '')->post('https://api.sandbox.midtrans.com/v2/charge', [
                'payment_type' => 'qris',
                'transaction_details' => [
                    'order_id' => $order->order_number,
                    'gross_amount' => (int) $amount,
                ],
                'qris' => [
                    'acquirer' => 'gopay',
                ],
            ]);

            if ($response->failed()) {
                return response()->json([
                    'msg' => 'Gagal membuat pembayaran',
                    'error' => $response->json(),
                ], 400);
            }
            $midtrans = $response->json();
            $qrCode = collect($midtrans['actions'] ?? [])->firstWhere('name', 'generate-qr-code')['url'] ?? null;
            if ($existingPayment && $existingPayment->status === 'FAILED') {
                $payment = $existingPayment;
                $payment->update([
                    'payment_method' => 'QRIS',
                    'amount' => $amount,
                    'transaction_id' => $midtrans['transaction_id'] ?? null,
                    'qr_code' => $qrCode,
                    'status' => 'PENDING',
                    'paid_at' => null,
                ]);
            } else {
                $payment = Payment::create([
                    'order_id' => $order->id,
                    'payment_method' => 'QRIS',
                    'amount' => $amount,
                    'transaction_id' => $midtrans['transaction_id'] ?? null,
                    'qr_code' => $qrCode,
                    'status' => 'PENDING',
                ]);
            }

            return response()->json(
                [
                    'msg' => 'QRIS berhasil dibuat',
                    'data' => [
                        'payment' => $payment,
                        'qr_code' => $qrCode,
                    ],
                ],
                201
            );
        };
    }

    public function show(Payment $payment)
    {
        $payment->load('order');

        return response()->json([
            'msg' => 'Payment berhasil ditemukan',
            'data' => $payment,
        ]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:PENDING,SUCCESS,FAILED'],
        ]);
        $payment->update([
            'status' => $validated['status'],
            'paid_at' => $validated['status'] === 'SUCCESS' ? now() : null,
        ]);
        if ($validated['status'] === 'SUCCESS') {
            $payment->order->update([
                'status' => 'PROCESSING',
            ]);
        };

        return response()->json([
            'msg' => 'Status pembayaran berhasil di update',
            'data' => $payment->fresh()
        ]);
    }

    public function notification(Request $request)
    {
        $orderId = $request->order_id;
        $statusCode = $request->status_code;
        $grossAmount = $request->gross_amount;
        $signatureKey = $request->signature_key;

        //verofokasi signature key benar2 dari midtrans
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . config('midtrans.server_key'));
        if ($signatureKey !== $expectedSignature) {
            return response()->json([
                'msg' => 'Signature key tidak valid',
            ], 403);
        }

        // cari payment berdasarkan transaction_id
        $payment = Payment::where('transaction_id', $request->transaction_id)->first();
        if (!$payment) {
            return response()->json([
                'msg' => 'Pembayaran tidak ditemukan',
            ], 404);
        }
        if ($payment->order->order_number !== $orderId) {
            return response()->json([
                'msg' => 'Order ID tidak sesuai',
            ], 422);
        }
        if ((float) $payment->amount !== (float) $grossAmount) {
            return response()->json([
                'msg' => 'Jumlah pembayaran tidak sesuai',
            ], 422);
        }
        if ($payment->status === 'SUCCESS') {
            return response()->json([
                'msg' => 'Pembayaran sudah diproses',
            ], 200);
        }

        $transactionStatus = $request->transaction_status;
        if ($transactionStatus === 'settlement') {
            DB::transaction(function () use ($payment) {
                $payment->update([
                    'status' => 'SUCCESS',
                    'paid_at' => now(),
                ]);
                $payment->order->update([
                    'status' => 'PROCESSING',
                ]);
            });
        } elseif ($transactionStatus === 'cancel' || $transactionStatus === 'deny' || $transactionStatus === 'expire') {
            $payment->update([
                'status' => 'FAILED',
            ]);
        }

        return response()->json([
            'msg' => 'Notifikasi pembayaran berhasil diproses',
        ]);
    }

    public function confirmCashPayment($id)
    {
        $payment = Payment::findOrFail($id);
        if ($payment->payment_method !== 'CASH') {
            return response()->json([
                'msg' => 'Pembayaran ini bukan metode Cash',
            ], 422);
        }
        if ($payment->status === 'SUCCESS') {
            return response()->json([
                'msg' => 'Pembayaran ini sudah dikonfirmasi',
            ], 409);
        }
        if ($payment->status === 'FAILED') {
            return response()->json([
                'msg' => 'Pembayaran ini sudah gagal, tidak bisa dikonfirmasi',
            ], 422);
        }
        DB::transaction(function () use ($payment) {
            $payment->update([
                'status' => 'SUCCESS',
                'paid_at' => now(),
            ]);
            $payment->order->update([
                'status' => 'PROCESSING',
            ]);
        });

        return response()->json([
            'msg' => 'Pembayaran Cash berhasil dikonfirmasi',
            'data' => $payment->fresh()
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
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
        $amount = $order->total_amount; // ambil toal dari database setelah order dibuat
        // if ($order->payment)
        if ($validated['payment_method'] === 'CASH') {
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'CASH',
                'amount' => $amount,
                'transaction_id' => null,
                'status' => 'PENDING',
            ]);
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
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'QRIS',
                'amount' => $amount,
                'transaction_id' => $midtrans['transaction_id'] ?? null,
                'status' => 'PENDING',
            ]);

            return response()->json(
                [
                    'msg' => 'QRIS berhasil dibuat',
                    'data' => [
                        'payment' => $payment,
                        'qr_code' => collect($midtrans['actions'] ?? [])->firstWhere('name', 'generate-qr-code')['url'] ?? null
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
        // return response()->json([
        //     'debug' => [
        //         'payment_id' => $payment->id,
        //         'transaction_id' => $payment->transaction_id,
        //         'transaction_id_request' => $request->transaction_id,
        //         'transaction_status' => $request->transaction_status,
        //         'status_before' => $payment->status,
        //     ]
        // ]);

        $transactionStatus = $request->transaction_status;
        if ($transactionStatus === 'settlement') {
            $payment->update([
                'status' => 'SUCCESS',
                'paid_at' => now(),
            ]);
            $payment->order->update([
                'status' => 'PROCESSING',
            ]);
        }

        return response()->json([
            'msg' => 'Notifikasi pembayaran berhasil diproses',
        ]);
    }
}

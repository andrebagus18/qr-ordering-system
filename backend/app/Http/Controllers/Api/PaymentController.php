<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Midtrans\Config;
use Illuminate\Support\Facades\Log;

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
        $existingPayment = Payment::where('order_id', $order->id)->latest('id')->first();
        if ($existingPayment) {
            if ($existingPayment->status === 'SUCCESS') {
                return response()->json([
                    'msg' => 'Pembayaran unttuk order ini sudah dibayarkan',
                    'data' => $existingPayment
                ], 409);
            }
            if ($existingPayment->status === 'PENDING') {
                if ($existingPayment->payment_method === 'QRIS') {
                    if ($existingPayment->expires_at && now()->greaterThanOrEqualTo($existingPayment->expires_at)) {
                        $existingPayment->update([
                            'status' => 'FAILED',
                        ]);
                    } else {
                        return response()->json([
                            'msg' => 'QRIS masih berlaku',
                            'data' => [
                                'payment' => $existingPayment,
                                'qr_code' => $existingPayment->qr_code,
                            ]
                        ], 200);
                    }
                } else {
                    return response()->json([
                        'msg' => 'Pembayaran untuk order ini masih pending',
                        'data' => $existingPayment
                    ], 200);
                }
            }
        }
        $amount = $order->total_amount; // ambil total dari database setelah order dibuat
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
                'data' => $payment,
            ], 201);
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
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'QRIS',
                'amount' => $amount,
                'transaction_id' => $midtrans['transaction_id'] ?? null,
                'qr_code' => $qrCode,
                'status' => 'PENDING',
                'expires_at' => now()->addMinutes(10),
            ]);

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
                $payment = Payment::whereKey($payment->id)->lockForUpdate()->firstOrFail();
                $order = Order::whereKey($payment->order_id)->lockForUpdate()->firstOrFail();
                // jangan proses ulang pembayaran yang sudah sukses
                if ($payment->status === 'SUCCESS') {
                    return;
                }
                // jangan hidupkan lagi order yang sudah dibatalkan
                if ($order->status === 'CANCELLED') {
                    return;
                }
                $payment->update([
                    'status' => 'SUCCESS',
                    'paid_at' => now(),
                ]);
                $order->update([
                    'status' => 'PROCESSING',
                ]);
            });
        } elseif (in_array($transactionStatus, ['cancel', 'expire', 'deny'], true)) {
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

    public function getPaymentStatus($id)
    {
        $payment = Payment::findOrFail($id);
        return response()->json([
            'data' => [
                'id' => $payment->id,
                'status' => $payment->status,
                'paid_at' => $payment->paid_at,
            ],
        ]);
    }

    public function syncStatus($id)
    {
        $payment = Payment::with('order')->findOrFail($id);

        if (!$payment->transaction_id) {
            return response()->json([
                'msg' => 'Payment tidak memiliki transaksi Midtrans.',
            ], 422);
        }

        $response = Http::withBasicAuth(
            config('midtrans.server_key'),
            ''
        )->get(
            'https://api.sandbox.midtrans.com/v2/'
                . $payment->order->order_number
                . '/status'
        );

        if ($response->failed()) {
            return response()->json([
                'msg' => 'Gagal memeriksa status Midtrans.',
                'error' => $response->json(),
            ], 502);
        }

        $gatewayStatus = $response->json('transaction_status');

        if ($gatewayStatus === 'settlement') {
            $payment->update([
                'status' => 'SUCCESS',
                'paid_at' => now(),
            ]);

            $payment->order->update([
                'status' => 'PROCESSING',
            ]);
        } elseif (in_array($gatewayStatus, ['expire', 'cancel', 'deny'], true)) {
            $payment->update([
                'status' => 'FAILED',
            ]);
        }

        return response()->json([
            'msg' => 'Status pembayaran berhasil diperiksa.',
            'gateway_status' => $gatewayStatus,
            'payment_status' => $payment->fresh()->status,
        ]);
    }

    public function cancel(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
        ]);

        $order = Order::findOrFail($validated['order_id']);

        $payment = Payment::where('order_id', $order->id)
            ->where('payment_method', 'QRIS')
            ->latest()
            ->first();

        if (!$payment) {
            return response()->json([
                'msg' => 'Pembayaran QRIS tidak ditemukan.',
            ], 404);
        }

        if ($payment->status === 'SUCCESS') {
            return response()->json([
                'msg' => 'Pembayaran sudah berhasil.',
            ], 409);
        }

        if ($order->status === 'CANCELLED') {
            return response()->json([
                'msg' => 'Pesanan sudah dibatalkan.',
            ], 200);
        }

        if (!$payment->transaction_id) {
            return response()->json([
                'msg' => 'ID transaksi Midtrans tidak ditemukan.',
            ], 409);
        }

        $baseUrl = config('midtrans.is_production')
            ? 'https://api.midtrans.com'
            : 'https://api.sandbox.midtrans.com';

        $auth = Http::withBasicAuth(
            config('midtrans.server_key'),
            ''
        )->acceptJson();

        // Periksa status aktual di Midtrans terlebih dahulu.
        $statusResponse = $auth->get(
            "{$baseUrl}/v2/{$order->order_number}/status"
        );

        if ($statusResponse->failed()) {
            return response()->json([
                'msg' => 'Status pembayaran belum dapat diverifikasi.',
            ], 502);
        }

        $gatewayStatus = $statusResponse->json('transaction_status');

        if ($gatewayStatus === 'settlement') {
            return response()->json([
                'msg' => 'Pembayaran sudah berhasil. Pesanan tidak dibatalkan.',
            ], 409);
        }

        if (in_array($gatewayStatus, ['expire', 'cancel'], true)) {
            DB::transaction(function () use ($order, $payment) {
                $payment->update([
                    'status' => 'FAILED',
                ]);
                $order->update([
                    'status' => 'CANCELLED',
                ]);
            });
            return response()->json([
                'msg' => 'Pembayaran QRIS dan pesanan dibatalkan.',
                'gateway_status' => $gatewayStatus,
            ], 200);
        }

        if ($gatewayStatus !== 'pending') {
            return response()->json([
                'msg' => 'Transaksi tidak lagi berstatus pending.',
                'gateway_status' => $gatewayStatus,
            ], 409);
        }

        // Batalkan transaksi di Midtrans.
        $cancelResponse = $auth->post(
            "{$baseUrl}/v2/{$payment->transaction_id}/cancel"
        );
        Log::info('Midtrans cancel debug', [
            'transaction_id' => $payment->transaction_id,
            'http_status' => $cancelResponse->status(),
            'response' => $cancelResponse->body(),
        ]);
        // return response()->json([
        //     'http_status' => $cancelResponse->status(),
        //     'response' => $cancelResponse->json(),
        // ], 200);

        if (
            $cancelResponse->failed() ||
            $cancelResponse->json('transaction_status') !== 'cancel'
        ) {
            return response()->json([
                'msg' => 'Pembatalan di Midtrans belum berhasil dikonfirmasi.',
            ], 409);
        }

        DB::transaction(function () use ($order, $payment) {
            $lockedOrder = Order::whereKey($order->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedPayment = Payment::whereKey($payment->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Callback mungkin sudah memproses pembayaran.
            if (
                $lockedPayment->status === 'SUCCESS' ||
                $lockedOrder->status === 'PROCESSING'
            ) {
                return;
            }
            $lockedPayment->update([
                'status' => 'FAILED',
            ]);
            $lockedOrder->update([
                'status' => 'CANCELLED',
            ]);
        });

        return response()->json([
            'msg' => 'Pembayaran QRIS dan pesanan dibatalkan.',
        ]);
    }
}

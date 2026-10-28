<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Midtrans\Config;
use Illuminate\Support\Str;
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
            $midtransOrderId = $order->order_number . '-' . Str::uuid();
            $response = Http::withBasicAuth(config('midtrans.server_key'), '')->post('https://api.sandbox.midtrans.com/v2/charge', [
                'payment_type' => 'qris',
                'transaction_details' => [
                    'order_id' => $midtransOrderId,
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
                'midtrans_order_id' => $midtransOrderId,
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

        //verifikasi signature key benar2 dari midtrans
        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . config('midtrans.server_key'));
        if ($signatureKey !== $expectedSignature) {
            return response()->json([
                'msg' => 'Signature key tidak valid',
            ], 403);
        }

        // cari payment berdasarkan transaction_id
        $payment = Payment::where('midtrans_order_id', $orderId)->first();
        if (!$payment) {
            return response()->json([
                'msg' => 'Pembayaran tidak ditemukan',
            ], 404);
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
        if (in_array($transactionStatus, ['settlement', 'capture'], true)) {
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

        if ($payment->payment_method !== 'QRIS') {
            return response()->json([
                'msg' => 'Status sinkronisasi hanya tersedia untuk QRIS.',
            ], 422);
        }

        if (!$payment->midtrans_order_id) {
            return response()->json([
                'msg' => 'ID transaksi Midtrans tidak ditemukan.',
            ], 422);
        }

        $response = Http::withBasicAuth(
            config('midtrans.server_key'),
            ''
        )->get(
            'https://api.sandbox.midtrans.com/v2/'
                . $payment->midtrans_order_id
                . '/status'
        );

        if ($response->failed()) {
            return response()->json([
                'msg' => 'Gagal memeriksa status Midtrans.',
                'error' => $response->json(),
            ], 502);
        }

        $gatewayStatus = $response->json('transaction_status');

        if (in_array($gatewayStatus, ['settlement', 'capture'], true)) {
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
        } elseif ($gatewayStatus === 'pending') {
            $payment->update([
                'status' => 'PENDING',
            ]);
        }

        return response()->json([
            'msg' => 'Status pembayaran berhasil diperiksa.',
            'data' => [
                'payment' => $payment->fresh(),
                'gateway_status' => $gatewayStatus,
            ],
        ]);
    }

    public function cancel($id)
    {
        $payment = Payment::with('order')->findOrFail($id);
        if ($payment->status !== 'PENDING') {
            return response()->json([
                'msg' => 'Pembayaran tidak lagi berstatus pending.',
                'payment_status' => $payment->status,
            ], 409);
        }
        if (
            $payment->payment_method !== 'QRIS' ||
            !$payment->transaction_id || !$payment->midtrans_order_id
        ) {
            return response()->json([
                'msg' => 'Data transaksi QRIS tidak lengkap.',
            ], 422);
        }

        $midtransOrderId = $payment->midtrans_order_id;
        \Illuminate\Support\Facades\Log::info('Memulai pembatalan Midtrans', [
            'payment_id' => $payment->id,
            'midtrans_order_id' => $midtransOrderId,
            'saved_midtrans_order_id' => $payment->midtrans_order_id,
        ]);

        // Periksa status transaksi yang tepat di Midtrans.
        $response = Http::withBasicAuth(
            config('midtrans.server_key'),
            ''
        )->get(
            'https://api.sandbox.midtrans.com/v2/'
                . $midtransOrderId
                . '/status'
        );
        if ($response->failed()) {
            return response()->json([
                'msg' => 'Gagal memeriksa status transaksi Midtrans.',
                'gateway_response' => $response->json(),
            ], 502);
        }
        $gatewayStatus = $response->json('transaction_status');
        if (in_array($gatewayStatus, ['settlement', 'capture'], true)) {
            $payment->update([
                'status' => 'SUCCESS',
                'paid_at' => now(),
            ]);
            $payment->order->update([
                'status' => 'PROCESSING',
            ]);
            return response()->json([
                'msg' => 'Pembayaran sudah berhasil. Order tidak dapat diubah.',
            ], 409);
        }
        if (in_array($gatewayStatus, ['expire', 'cancel', 'deny'], true)) {
            $payment->update([
                'status' => 'FAILED',
            ]);
            return response()->json([
                'msg' => 'Pembayaran lama sudah tidak aktif.',
                'payment_status' => 'FAILED',
            ]);
        }
        if ($gatewayStatus !== 'pending') {
            return response()->json([
                'msg' => 'Status transaksi belum aman untuk pembatalan.',
                'gateway_status' => $gatewayStatus,
            ], 409);
        }

        // Minta Midtrans membatalkan transaksi.
        $cancelResponse = Http::withBasicAuth(
            config('midtrans.server_key'),
            ''
        )->post(
            'https://api.sandbox.midtrans.com/v2/'
                . $payment->transaction_id
                . '/cancel'
        );
        if ($cancelResponse->failed()) {
            \Illuminate\Support\Facades\Log::warning(
                'Midtrans cancel gagal',
                [
                    'payment_id' => $payment->id,
                    'transaction_id' => $payment->transaction_id,
                    'midtrans_order_id' => $payment->midtrans_order_id,
                    'http_status' => $cancelResponse->status(),
                    'response_body' => $cancelResponse->body(),
                ]
            );
            return response()->json([
                'msg' => 'Midtrans gagal membatalkan pembayaran. Order tidak diubah.',
                'retryable' => $cancelResponse->serverError(),
            ], $cancelResponse->serverError() ? 503 : 409);
        }
        \Illuminate\Support\Facades\Log::info('Respons pembatalan Midtrans', [
            'payment_id' => $payment->id,
            'http_status' => $cancelResponse->status(),
            'response' => $cancelResponse->json(),
        ]);

        // Periksa kembali status transaksi setelah pembatalan.
        $verifyResponse = Http::withBasicAuth(
            config('midtrans.server_key'),
            ''
        )->get(
            'https://api.sandbox.midtrans.com/v2/'
                . $midtransOrderId
                . '/status'
        );
        if ($verifyResponse->failed()) {
            return response()->json([
                'msg' => 'Pembatalan diminta, tetapi status akhirnya belum dapat diverifikasi.',
            ], 502);
        }
        $finalStatus = $verifyResponse->json('transaction_status');
        if (in_array($finalStatus, ['settlement', 'capture'], true)) {
            $payment->update([
                'status' => 'SUCCESS',
                'paid_at' => now(),
            ]);
            $payment->order->update([
                'status' => 'PROCESSING',
            ]);
            return response()->json([
                'msg' => 'Pembayaran ternyata berhasil. Order tidak dapat diubah.',
            ], 409);
        }
        if (!in_array($finalStatus, ['expire', 'cancel', 'deny'], true)) {
            return response()->json([
                'msg' => 'Pembayaran belum dipastikan berakhir. Order tidak diubah.',
                'gateway_status' => $finalStatus,
            ], 409);
        }
        $payment->update([
            'status' => 'FAILED',
        ]);
        return response()->json([
            'msg' => 'Pembayaran lama berhasil diakhiri.',
            'payment_status' => 'FAILED',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
            'payment_method' => ['required', 'in:CASH,QRIS'],
            'amount' => ['required', 'numeric', 'min:0'],
            'transaction_id' => ['nullable', 'string', 'unique:payments,transaction_id'],
        ]);

        $payment = Payment::create([
            'order_id' => $validated['order_id'],
            'payment_method' => $validated['payment_method'],
            'amount' => $validated['amount'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'status' => 'PENDING',
        ]);

        return response()->json(
            [
                'msg' => 'Payment berhasil dibuat',
                'data' => $payment,
            ],
            201
        );
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
}

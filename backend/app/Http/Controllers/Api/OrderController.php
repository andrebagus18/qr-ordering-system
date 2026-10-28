<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with([
            'table',
            'orderItems.product',
            'payments',
        ])->latest()->get();

        return response()->json([
            'data' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'table_id' => ['required', 'exists:tables,id'],
            'customer_name' => ['required', 'string', 'max:100'],
            'order_type' => ['required', 'in:DINE-IN,TAKE-AWAY'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $order = Order::create([
            'table_id' => $data['table_id'],
            'customer_name' => $data['customer_name'],
            'order_type' => $data['order_type'],
            'status' => 'PENDING_PAYMENT',
        ]);
        $total = 0;
        foreach ($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $subtotal = $product->price * $item['quantity'];
            $order->OrderItems()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
                'subtotal' => $subtotal,
            ]);
            $total += $subtotal;
        }
        $order->update([
            'order_number' => 'ORD' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
            'total_amount' => $total,
        ]);

        return response()->json([
            'msg' => 'Order berhasil dibuat',
            'data' => $order->load('OrderItems.product'),
        ], 201);
    }

    public function show(Order $order)
    {
        $order = Order::with([
            'table',
            'payments'
        ])->findOrFail($order->id);
        return response()->json([
            'data' => $order
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'table_id' => ['required', 'exists:tables,id'],
            'customer_name' => ['required', 'string', 'max:100'],
            'order_type' => ['required', 'in:DINE-IN,TAKE-AWAY'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);
        if ($order->status !== 'PENDING_PAYMENT') {
            return response()->json([
                'msg' => 'Order tidak dapat diubah'
            ], 409);
        }
        $hasSuccessPayment = $order->payments()->where('status', 'SUCCESS')->exists();
        if ($hasSuccessPayment) {
            return response()->json([
                'msg' => 'Order sudah dibayar dan tidak dapat diubah'
            ], 409);
        }
        $pendingPayment = $order->payments()
            ->where('status', 'PENDING')
            ->latest('id')
            ->first();

        if ($pendingPayment) {
            if (
                $pendingPayment->payment_method === 'QRIS' &&
                $pendingPayment->transaction_id
            ) {
                $response = Http::withBasicAuth(
                    config('midtrans.server_key'),
                    ''
                )->get(
                    'https://api.sandbox.midtrans.com/v2/'
                        . $order->order_number
                        . '/status'
                );

                if ($response->failed()) {
                    return response()->json([
                        'msg' => 'Gagal memeriksa status pembayaran Midtrans.',
                    ], 502);
                }

                $gatewayStatus = $response->json('transaction_status');
                if (in_array($gatewayStatus, ['settlement', 'capture'], true)) {
                    $pendingPayment->update([
                        'status' => 'SUCCESS',
                        'paid_at' => now(),
                    ]);
                    $order->update([
                        'status' => 'PROCESSING',
                    ]);
                    return response()->json([
                        'msg' => 'Pembayaran sudah berhasil. Order tidak dapat diubah.',
                        'gateway_status' => $gatewayStatus,
                    ], 409);
                }
                if (in_array($gatewayStatus, ['expire', 'cancel', 'deny'], true)) {
                    $pendingPayment->update([
                        'status' => 'FAILED',
                    ]);
                } else {
                    return response()->json([
                        'msg' => 'Pembayaran QRIS belum berakhir. Order belum dapat diubah.',
                        'gateway_status' => $gatewayStatus,
                    ], 409);
                }
            } else {
                return response()->json([
                    'msg' => 'Pembayaran masih pending dan belum dapat diubah.',
                ], 409);
            }
        }
        DB::transaction(function () use ($order, $data) {
            $order->update([
                'table_id' => $data['table_id'],
                'customer_name' => $data['customer_name'],
                'order_type' => $data['order_type']
            ]);
            $order->orderItems()->delete();
            $total = 0;
            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $product->price * $item['quantity'];
                $order->orderItems()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal
                ]);
                $total += $subtotal;
            }
            $order->update([
                'total_amount' => $total
            ]);
        });
        return response()->json([
            'msg' => 'Order berhasil diperbarui',
            'data' => $order->load('orderItems.product')
        ]);
    }
}

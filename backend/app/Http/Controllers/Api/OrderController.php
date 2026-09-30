<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with([
            'table',
            'orderItems.product',
            'payment',
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
            'payment'
        ])->findOrFail($order->id);
        return response()->json([
            'data' => $order
        ]);
    }
}

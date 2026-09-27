<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);
        $product = Product::findOrFail($data['product_id']);
        $subtotal = $product->price * $data['quantity'];

        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $data['product_id'],
            'quantity' => $data['quantity'],
            'price' => $product->price,
            'subtotal' => $subtotal,
        ]);
        $order->update([
            'total_amount' => $order->orderItems()->sum('subtotal'),
        ]);

        return response()->json([
            'msg' => 'Order item berhasil ditambahkan',
            'data' => $orderItem->load('product'),
            'total_amount' => $order->fresh()->total_amount,
        ], 201);
    }

    public function show(Order $order)
    {
        $order->load('orderItems');

        return response()->json([
            'msg' => 'Order berhasil ditemukan',
            'data' => $order,
        ]);
    }
}

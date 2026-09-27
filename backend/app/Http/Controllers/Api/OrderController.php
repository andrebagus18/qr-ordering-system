<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
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
            'total_amount' => ['required', 'numeric', 'min:0'],
        ]);

        $order = Order::create([
            'table_id' => $data['table_id'],
            'customer_name' => $data['customer_name'],
            'order_type' => $data['order_type'],
            'status' => 'PENDING_PAYMENT',
            'total_amount' => $data['total_amount'],
        ]);
        $order->update([
            'order_number' => 'ORD' . str_pad($order->id, 4, '0', STR_PAD_LEFT),
        ]);

        return response()->json([
            'msg' => 'Order berhasil dibuat',
            'data' => $order,
        ], 201);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:PENDING_PAYMENT,PROCESSING,COMPLETED,CANCELLED']
        ]);

        $order->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'msg' => 'Status order berhasil diubah',
            'data' => $order->fresh(),
        ]);
    }
}

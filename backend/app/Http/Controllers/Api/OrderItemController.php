<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;

class OrderItemController extends Controller
{
    public function show(Order $order)
    {
        $order = Order::with([
            'orderItems.product',
        ])->findOrFail($order->id);
        return response()->json([
            'data' => $order
        ]);
    }
}

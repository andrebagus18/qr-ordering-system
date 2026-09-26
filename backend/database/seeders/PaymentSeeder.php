<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $order1 = Order::where('order_number', 'ORD001')->first();
        $order2 = Order::where('order_number', 'ORD002')->first();
        $order3 = Order::where('order_number', 'ORD003')->first();

        Payment::create([
            'order_id' => $order1->id,
            'payment_method' => 'QRIS',
            'amount' => '40000',
            'status' => 'SUCCESS',
            'transaction_id' => 'TRX-001',
            'paid_at' => now()->subMinutes(20),
        ]);

        Payment::create([
            'order_id' => $order2->id,
            'payment_method' => 'QRIS',
            'amount' => '19000',
            'status' => 'SUCCESS',
            'transaction_id' => 'TRX-002',
            'paid_at' => now()->subMinutes(15),
        ]);

        Payment::create([
            'order_id' => $order3->id,
            'payment_method' => 'QRIS',
            'amount' => '54000',
            'status' => 'SUCCESS',
            'transaction_id' => 'TRX-003',
            'paid_at' => now()->subHour(),
        ]);
    }
}

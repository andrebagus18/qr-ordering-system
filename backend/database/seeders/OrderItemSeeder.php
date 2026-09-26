<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $order1 = Order::where('order_number', 'ORD001')->first();
        $order2 = Order::where('order_number', 'ORD002')->first();
        $order3 = Order::where('order_number', 'ORD003')->first();

        $nasiGoreng = Product::where('name', 'Nasi Goreng')->first();
        $mieGoreng = Product::where('name', 'Mie Goreng')->first();
        $ayamGeprek = Product::where('name', 'Ayam Geprek')->first();
        $esTeh = Product::where('name', 'Es Teh')->first();
        $esJeruk = Product::where('name', 'Es Jeruk')->first();

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $nasiGoreng->id,
            'quantity' => 2,
            'price' => $nasiGoreng->price,
            'subtotal' => $nasiGoreng->price * 2,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $esTeh->id,
            'quantity' => 2,
            'price' => $esTeh->price,
            'subtotal' => $esTeh->price * 2,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $mieGoreng->id,
            'quantity' => 1,
            'price' => $mieGoreng->price,
            'subtotal' => $mieGoreng->price * 1,
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => $esJeruk->id,
            'quantity' => 1,
            'price' => $esJeruk->price,
            'subtotal' => $esJeruk->price * 1,
        ]);

        OrderItem::create([
            'order_id' => $order3->id,
            'product_id' => $ayamGeprek->id,
            'quantity' => 3,
            'price' => $ayamGeprek->price,
            'subtotal' => $ayamGeprek->price * 3,
        ]);
    }
}

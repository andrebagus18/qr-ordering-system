<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Table;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tableA01 = Table::where('table_number', 'A01')->first();
        $tableA02 = Table::where('table_number', 'A02')->first();
        $tableA03 = Table::where('table_number', 'A03')->first();

        Order::create([
            'order_number' => 'ORD001',
            'table_id' => $tableA01->id,
            'customer_name' => 'John Doe',
            'order_type' => 'DINE-IN',
            'status' => 'PROCESSING',
            'total_amount' => 40000,
        ]);

        Order::create([
            'order_number' => 'ORD002',
            'table_id' => $tableA02->id,
            'customer_name' => 'Jane Smith',
            'order_type' => 'DINE-IN',
            'status' => 'PROCESSING',
            'total_amount' => 19000,
        ]);

        Order::create([
            'order_number' => 'ORD003',
            'table_id' => $tableA03->id,
            'customer_name' => 'Bob Johnson',
            'order_type' => 'DINE-IN',
            'status' => 'PROCESSING',
            'total_amount' => 54000,
        ]);
    }
}

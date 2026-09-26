<?php

namespace Database\Seeders;

use App\Models\Table;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Table::create([
            'table_number' => 'A01',
            'qr_code' => Str::random(32),
        ]);

        Table::create([
            'table_number' => 'A02',
            'qr_code' => Str::random(32),
        ]);

        Table::create([
            'table_number' => 'A03',
            'qr_code' => Str::random(32),
        ]);

        Table::create([
            'table_number' => 'A04',
            'qr_code' => Str::random(32),
        ]);

        Table::create([
            'table_number' => 'A05',
            'qr_code' => Str::random(32),
        ]);

        Table::create([
            'table_number' => 'A06',
            'qr_code' => Str::random(32),
        ]);
    }
}

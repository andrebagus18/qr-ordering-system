<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $makanan = Category::where('name', 'Makanan')->first();
        $minuman = Category::where('name', 'Minuman')->first();
        $snack = Category::where('name', 'Snack')->first();

        Product::create([
            'category_id' => $makanan->id,
            'name' => 'Nasi Goreng',
            'description' => 'Nasi goreng dengan bumbu spesial',
            'price' => 15000,
        ]);

        Product::create([
            'category_id' => $makanan->id,
            'name' => 'Mie Goreng',
            'description' => 'Mie goreng dengan bumbu spesial + telur',
            'price' => 12000,
        ]);

        Product::create([
            'category_id' => $makanan->id,
            'name' => 'Ayam Geprek',
            'description' => 'Ayam geprek dengan sambal dan nasi',
            'price' => 18000,
        ]);

        Product::create([
            'category_id' =>  $makanan->id,
            'name' => 'Ayam Bakar',
            'description' => 'Ayam bakar dengan bumbu spesial',
            'price' => 20000,
        ]);

        Product::create([
            'category_id' => $minuman->id,
            'name' => 'Es Teh',
            'description' => 'Es teh manis segar',
            'price' => 5000,
        ]);

        Product::create([
            'category_id' => $minuman->id,
            'name' => 'Es Jeruk',
            'description' => 'Es jeruk segar',
            'price' => 7000,
        ]);

        Product::create([
            'category_id' => $minuman->id,
            'name' => 'Kopi Hitam',
            'description' => 'Kopi hitam tanpa gula',
            'price' => 10000,
        ]);

        Product::create([
            'category_id' => $snack->id,
            'name' => 'Keripik Singkong',
            'description' => 'Keripik singkong renyah',
            'price' => 10000,
        ]);

        Product::create([
            'category_id' => $snack->id,
            'name' => 'Kacang Goreng',
            'description' => 'Kacang goreng gurih',
            'price' => 8000,
        ]);
    }
}

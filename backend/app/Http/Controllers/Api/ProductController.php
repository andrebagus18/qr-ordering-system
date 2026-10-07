<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Cloudinary;
use Cloudinary\Uploader;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->get();

        return response()->json([
            'msg' => "Product berhasil diambil",
            'data' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_available' => ['required', 'boolean'],
        ]);
        Cloudinary::config([
            'cloud_name' => config('services.cloudinary.cloud_name'),
            'api_key' => config('services.cloudinary.api_key'),
            'api_secret' => config('services.cloudinary.api_secret'),
            'secure' => true,
        ]);
        $result = Uploader::upload(
            $request->file('image')->getRealPath(),
            [
                'folder' => 'kopi-kita/products',
            ]
        );

        $product = Product::create([
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'image' => $result['secure_url'] ?? null,
            'price' => $data['price'],
            'is_available' => $data['is_available']
        ]);

        return response()->json([
            'msg' => 'Product berhasil dibuat',
            'data' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'max:2048'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_available' => ['required', 'boolean'],
        ]);
        if ($request->hasFile('image')) {
            Cloudinary::config([
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key' => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
                'secure' => true,
            ]);
            $result = Uploader::upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'kopi-kita/products',
                ]
            );
        }
        $product->update([
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'image' => $result['secure_url'] ?? $product->image,
            'price' => $data['price'],
            'is_available' => $data['is_available'],
        ]);

        return response()->json([
            'msg' => 'Product berhasil diubah',
            'data' => $product->fresh(),
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'msg' => 'Product berhasil dihapus',
        ]);
    }
}

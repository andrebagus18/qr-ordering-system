<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return response()->json([
            'msg' => 'Categories retrieved successfully',
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100']
        ]);
        $category = Category::create([
            'name' => $data['name']
        ]);

        return response()->json([
            'msg' => 'Kategory berhasil dibuat',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100']
        ]);
        $category->update([
            'name' => $validated['name']
        ]);

        return response()->json([
            'msg' => 'Kategory berhasil diperbarui',
            'data' => $category,
        ]);
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return response()->json([
                'msg' => 'Kategory tidak dapat dihapus karena masih memiliki produk terkait',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'msg' => 'Kategory berhasil dihapus',
        ]);
    }
}

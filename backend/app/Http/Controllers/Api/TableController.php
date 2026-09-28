<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::all();

        return response()->json([
            'msg' => 'Meja berhasil diambil',
            'data' => $tables
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'table_number' => ['required', 'string', 'max:20', 'unique:tables,table_number'],
        ]);

        $table = Table::create([
            'table_number' => $data['table_number'],
            'qr_code' => 'Table-' . $data['table_number'] . Str::uuid()
        ]);

        return response()->json([
            'msg' => 'Table berhasil dibuat',
            'data' => $table
        ]);
    }

    public function update(Request $request, Table $table)
    {
        $data = $request->validate([
            'table_number' => ['required', 'string', 'max:20', 'unique:tables,table_number'],
        ]);

        $table->update([
            'table_number' => $data['table_number'],
            'qr_code' => 'Table-' . $data['table_number'] . Str::uuid()
        ]);

        return response()->json([
            'msg' => 'Table berhasil diubah',
            'data' => $table->fresh()
        ]);
    }

    public function destroy(Table $table)
    {
        $table->delete();
        return response()->json([
            'msg' => 'Table berhasil dihapus'
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;


class TableController extends Controller
{
    public function index()
    {
        $tables = Table::withCount('orders')->latest()->get();
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
        $table = Table::create($data);

        return response()->json([
            'msg' => 'Table berhasil dibuat',
            'data' => $table
        ], 201);
    }

    public function update(Request $request, Table $table)
    {
        $data = $request->validate([
            'table_number' => ['required', 'string', 'max:20', 'unique:tables,table_number' . $table->id],
        ]);
        $table->update($data);
        return response()->json([
            'msg' => 'Table berhasil diubah',
            'data' => $table->fresh()
        ]);
    }

    // public function destroy(Table $table)
    // {
    //     $table->delete();
    //     return response()->json([
    //         'msg' => 'Table berhasil dihapus'
    //     ]);
    // }

    public function qrCode(Table $table)
    {
        $url = config('app.FRONTEND_URL') . '/menu?table=' . $table->qr_code;
        $qrCode = QrCode::format('svg')->size(300)->generate($url);
        return response($qrCode)->header('Content-Type', 'image/svg+xml');
    }

    public function findByQrCode($qrCode)
    {
        $table = Table::where('qr_code', $qrCode)->firstOrFail();
        return response()->json([
            'data' => [
                'id' => $table->id,
                'table_number' => $table->table_number,
                'qr_code' => $table->qr_code,
            ]
        ]);
    }
}

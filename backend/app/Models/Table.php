<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Table extends Model
{
    protected $fillable = [
        'table_number',
        'qr_code',
    ];

    protected static function booted(): void
    {
        static::creating(function (Table $table) {
            if (empty($table->qr_code)) {
                $table->qr_code = (string) Str::uuid();
            }
        });
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}

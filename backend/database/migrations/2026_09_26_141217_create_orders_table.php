<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('table_id')->nullable()->constrained('tables')->onDelete('set null');
            $table->string('customer_name');
            $table->enum('order_type', ['DINE-IN', 'TAKE-AWAY']);
            $table->enum('status', ['PENDING_PAYMENT', 'PROCESSING', 'COMPLETED', 'CANCELLED'])->default('PENDING_PAYMENT');
            $table->decimal('total_amount', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

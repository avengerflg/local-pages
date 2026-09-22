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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('service_requests')->restrictOnDelete();
            $table->foreignId('tradie_id')->constrained('tradie_profiles')->restrictOnDelete();
            $table->decimal('amount', 10, 2);
            $table->text('description');
            $table->date('valid_until')->nullable();
            $table->text('terms_notes')->nullable();
            $table->string('estimated_duration', 100)->nullable();
            $table->date('proposed_date')->nullable();
            $table->string('status', 30)->default('pending')->index();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();

            $table->index(['request_id', 'status']);
            $table->index(['tradie_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};

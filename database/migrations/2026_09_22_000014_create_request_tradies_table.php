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
        Schema::create('request_tradies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('service_requests')->cascadeOnDelete();
            $table->foreignId('tradie_id')->constrained('tradie_profiles')->restrictOnDelete();
            $table->timestamp('selected_at')->useCurrent();
            $table->string('status', 30)->default('selected')->index();
            $table->timestamps();

            $table->unique(['request_id', 'tradie_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_tradies');
    }
};

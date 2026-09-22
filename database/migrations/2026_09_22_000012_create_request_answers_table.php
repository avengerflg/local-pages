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
        Schema::create('request_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')->constrained('service_requests')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('service_questions')->restrictOnDelete();
            $table->text('answer_text')->nullable();
            $table->foreignId('selected_option_id')->nullable()->constrained('service_question_options')->nullOnDelete();
            $table->json('structured_value')->nullable();
            $table->timestamps();

            $table->index(['request_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_answers');
    }
};

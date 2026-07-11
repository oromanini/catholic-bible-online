<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_comment_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_comment_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('rating', ['up', 'down']);
            $table->timestamps();

            $table->unique(['ai_comment_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_comment_feedback');
    }
};

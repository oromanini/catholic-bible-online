<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('verses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            // Desnormalizado de propósito: evita JOINs no hot path de leitura/busca.
            $table->foreignId('version_id')->constrained()->cascadeOnDelete();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->smallInteger('number');
            $table->text('text');
            $table->text('text_plain');
            $table->timestamps();

            $table->unique(['chapter_id', 'number']);
            $table->index(['version_id', 'book_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verses');
    }
};

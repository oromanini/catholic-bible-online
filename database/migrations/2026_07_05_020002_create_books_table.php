<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->enum('testament', ['antigo', 'novo']);
            $table->enum('category', [
                'pentateuco',
                'historicos',
                'sapienciais',
                'profetas_maiores',
                'profetas_menores',
                'evangelhos',
                'atos',
                'cartas_paulinas',
                'cartas_catolicas',
                'apocalipse',
            ]);
            $table->smallInteger('canonical_order')->unique();
            $table->string('abbreviation', 10);
            $table->boolean('is_deuterocanonical')->default(false);
            $table->smallInteger('chapter_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};

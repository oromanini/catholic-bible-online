<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Só linhas VERIFICADAS entram aqui — o texto de quote_original é
     * sempre um trecho literal encontrado em source_url (checado como
     * substring antes de salvar). Se a busca não achar nada confiável,
     * nenhuma linha é criada para o livro.
     */
    public function up(): void
    {
        Schema::create('book_quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->string('author', 150);
            $table->string('work_title', 255)->nullable();
            $table->mediumText('quote_original');
            $table->mediumText('quote_translated')->nullable();
            $table->string('source_url', 500);
            $table->string('source_domain', 100);
            $table->string('language', 10)->default('en');
            $table->timestamps();

            $table->unique('book_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('book_quotes');
    }
};

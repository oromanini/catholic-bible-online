<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Um comentário por (capítulo, versão) — não por usuário/requisição.
     * A primeira pessoa que pedir dispara a chamada à IA; todas as
     * seguintes reaproveitam o mesmo registro, o que mantém o uso da
     * cota gratuita da API previsível independente do tráfego.
     */
    public function up(): void
    {
        Schema::create('ai_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained()->cascadeOnDelete();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('version_id')->constrained()->cascadeOnDelete();
            $table->mediumText('content');
            $table->string('provider', 30);
            $table->string('model', 60);
            $table->timestamps();

            $table->unique(['chapter_id', 'version_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_comments');
    }
};

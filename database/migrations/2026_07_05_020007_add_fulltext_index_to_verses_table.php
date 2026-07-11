<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * SQLite (usado nos testes Pest, in-memory) não suporta FULLTEXT — só
     * MySQL/MariaDB (produção/dev) ganham o índice real.
     */
    public function up(): void
    {
        if (! $this->supportsFullText()) {
            return;
        }

        Schema::table('verses', function (Blueprint $table) {
            $table->fullText('text_plain', 'verses_text_plain_fulltext');
        });
    }

    public function down(): void
    {
        if (! $this->supportsFullText()) {
            return;
        }

        Schema::table('verses', function (Blueprint $table) {
            $table->dropFullText('verses_text_plain_fulltext');
        });
    }

    private function supportsFullText(): bool
    {
        return in_array(Schema::getConnection()->getDriverName(), ['mysql', 'mariadb'], true);
    }
};

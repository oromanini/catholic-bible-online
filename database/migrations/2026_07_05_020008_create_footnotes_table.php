<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footnotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('verse_id')->constrained()->cascadeOnDelete();
            $table->string('marker', 10)->default('*');
            $table->unsignedTinyInteger('position')->nullable();
            $table->text('content');
            $table->timestamps();

            $table->index('verse_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('footnotes');
    }
};

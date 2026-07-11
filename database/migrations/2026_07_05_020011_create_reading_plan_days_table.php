<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reading_plan_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reading_plan_id')->constrained()->cascadeOnDelete();
            $table->smallInteger('day_number');
            $table->json('references_json');
            $table->timestamps();

            $table->unique(['reading_plan_id', 'day_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_plan_days');
    }
};

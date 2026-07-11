<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReadingPlanDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'reading_plan_id',
        'day_number',
        'references_json',
    ];

    protected function casts(): array
    {
        return [
            'references_json' => 'array',
        ];
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(ReadingPlan::class, 'reading_plan_id');
    }
}

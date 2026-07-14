<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property array<int, array{book: string, chapter_start: int, chapter_end: int}> $references_json
 */
class ReadingPlanDay extends Model
{
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

    /**
     * @return BelongsTo<ReadingPlan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(ReadingPlan::class, 'reading_plan_id');
    }
}

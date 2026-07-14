<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReadingPlanProgress extends Model
{
    protected $fillable = [
        'user_id',
        'reading_plan_id',
        'day_number',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<ReadingPlan, $this>
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(ReadingPlan::class, 'reading_plan_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReadingPlan extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'duration_days',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<ReadingPlanDay, $this>
     */
    public function days(): HasMany
    {
        return $this->hasMany(ReadingPlanDay::class);
    }

    /**
     * @return HasMany<ReadingPlanProgress, $this>
     */
    public function progress(): HasMany
    {
        return $this->hasMany(ReadingPlanProgress::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}

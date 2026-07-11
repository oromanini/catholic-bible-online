<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Version extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'language',
        'publisher',
        'license_status',
        'license_notes',
        'is_public',
        'is_default',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
            'is_default' => 'boolean',
        ];
    }

    public function bookTranslations(): HasMany
    {
        return $this->hasMany(BookTranslation::class);
    }

    public function bookIntroductions(): HasMany
    {
        return $this->hasMany(BookIntroduction::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }

    public function verses(): HasMany
    {
        return $this->hasMany(Verse::class);
    }

    public function getRouteKeyName(): string
    {
        return 'code';
    }
}

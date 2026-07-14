<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Version extends Model
{
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

    /**
     * @return HasMany<BookTranslation, $this>
     */
    public function bookTranslations(): HasMany
    {
        return $this->hasMany(BookTranslation::class);
    }

    /**
     * @return HasMany<BookIntroduction, $this>
     */
    public function bookIntroductions(): HasMany
    {
        return $this->hasMany(BookIntroduction::class);
    }

    /**
     * @return HasMany<Chapter, $this>
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(Chapter::class);
    }

    /**
     * @return HasMany<Verse, $this>
     */
    public function verses(): HasMany
    {
        return $this->hasMany(Verse::class);
    }

    public function getRouteKeyName(): string
    {
        return 'code';
    }
}

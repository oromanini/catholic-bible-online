<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'testament',
        'category',
        'canonical_order',
        'abbreviation',
        'is_deuterocanonical',
        'chapter_count',
    ];

    protected function casts(): array
    {
        return [
            'is_deuterocanonical' => 'boolean',
        ];
    }

    public function translations(): HasMany
    {
        return $this->hasMany(BookTranslation::class);
    }

    public function introductions(): HasMany
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

    public function nameForVersion(Version $version): ?string
    {
        return $this->translations()
            ->where('version_id', $version->id)
            ->value('name');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Árvore de navegação testamento -> categoria -> livros, com nomes
     * traduzidos para a versão informada.
     */
    public static function navigationTree(Version $version): Collection
    {
        return static::query()
            ->orderBy('canonical_order')
            ->with(['translations' => fn ($query) => $query->where('version_id', $version->id)])
            ->get()
            ->groupBy('testament')
            ->map(fn ($booksInTestament) => $booksInTestament
                ->groupBy('category')
                ->map(fn ($booksInCategory) => $booksInCategory->map(fn (self $book) => [
                    'slug' => $book->slug,
                    'name' => $book->translations->first()?->name ?? $book->slug,
                    'abbreviation' => $book->abbreviation,
                    'chapter_count' => $book->chapter_count,
                    'is_deuterocanonical' => $book->is_deuterocanonical,
                ])->values()));
    }
}

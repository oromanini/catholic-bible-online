<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class Book extends Model
{
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

    /**
     * @return HasMany<BookTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(BookTranslation::class);
    }

    /**
     * @return HasMany<BookIntroduction, $this>
     */
    public function introductions(): HasMany
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
     *
     * @return Collection<int|string, Collection<int|string, Collection<int, array{slug: string, name: string, abbreviation: string, chapter_count: int, is_deuterocanonical: bool}>>>
     */
    public static function navigationTree(Version $version): Collection
    {
        /** @var Collection<int, self> $books */
        $books = static::query()
            ->orderBy('canonical_order')
            ->with(['translations' => fn ($query) => $query->where('version_id', $version->id)])
            ->get();

        return $books
            ->groupBy('testament')
            ->map(fn (Collection $booksInTestament) => $booksInTestament
                ->groupBy('category')
                ->map(fn (Collection $booksInCategory) => $booksInCategory->map(fn (self $book) => [
                    'slug' => $book->slug,
                    'name' => $book->translations->first()->name ?? $book->slug,
                    'abbreviation' => $book->abbreviation,
                    'chapter_count' => $book->chapter_count,
                    'is_deuterocanonical' => $book->is_deuterocanonical,
                ])->values()));
    }
}

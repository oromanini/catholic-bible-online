<?php

namespace Tests\Unit\Bible;

use App\Services\BibleImport\CanonicalBookMap;
use PHPUnit\Framework\Attributes\Test;
use RuntimeException;
use Tests\TestCase;

class CanonicalBookMapTest extends TestCase
{
    #[Test]
    public function it_resolves_a_known_book_name(): void
    {
        $map = new CanonicalBookMap;

        $entry = $map->resolve('Gênesis');

        $this->assertSame('genesis', $entry['slug']);
        $this->assertSame('antigo', $entry['testament']);
        $this->assertSame('pentateuco', $entry['category']);
        $this->assertSame(1, $entry['order']);
        $this->assertFalse($entry['deutero']);
    }

    #[Test]
    public function it_flags_deuterocanonical_books_correctly(): void
    {
        $map = new CanonicalBookMap;

        $this->assertTrue($map->resolve('Tobias')['deutero']);
        $this->assertTrue($map->resolve('Sabedoria')['deutero']);
        $this->assertFalse($map->resolve('Salmos')['deutero']);
    }

    #[Test]
    public function it_throws_a_clear_exception_for_an_unmapped_book_name(): void
    {
        $map = new CanonicalBookMap;

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Livro Fantasma');

        $map->resolve('Livro Fantasma');
    }

    #[Test]
    public function the_underlying_map_covers_all_73_canonical_books_with_unique_keys(): void
    {
        $data = require database_path('data-sources/ave-maria/category-map.php');

        $this->assertCount(73, $data);
        $this->assertCount(73, array_unique(array_column($data, 'slug')));
        $this->assertCount(73, array_unique(array_column($data, 'order')));
        $this->assertSame(range(1, 73), collect($data)->pluck('order')->sort()->values()->all());
    }
}

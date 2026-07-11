<?php

namespace Tests\Feature\Bible;

use App\Models\Book;
use App\Models\BookTranslation;
use App\Models\Chapter;
use App\Models\Verse;
use App\Models\Version;
use Database\Seeders\BooksSeeder;
use Database\Seeders\VersionsSeeder;
use Generator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ImportBibleCommandTest extends TestCase
{
    use RefreshDatabase;

    private string $samplePath;

    private string $unmappedPath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->samplePath = base_path('tests/fixtures/bible/ave-maria-sample.json');
        $this->unmappedPath = base_path('tests/fixtures/bible/ave-maria-unmapped-book.json');
    }

    public function test_import_creates_expected_books_chapters_and_verses(): void
    {
        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);

        $exitCode = Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->samplePath,
        ]);

        $this->assertSame(0, $exitCode);

        // Fixture: Rute (2 capítulos, 3 versículos) + São Judas (1 capítulo, 2 versículos).
        $this->assertSame(2, BookTranslation::count());
        $this->assertSame(3, Chapter::count());
        $this->assertSame(5, Verse::count());

        $rute = Book::where('slug', 'rute')->firstOrFail();
        $this->assertSame(2, $rute->chapter_count);
    }

    public function test_import_strips_footnote_markers_from_stored_text(): void
    {
        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);

        Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->samplePath,
        ]);

        $verseWithMarker = Verse::where('text', 'like', '%Elimelec%')->firstOrFail();

        $this->assertStringNotContainsString('*', $verseWithMarker->text);
        $this->assertStringNotContainsString('*', $verseWithMarker->text_plain);
    }

    public function test_running_import_twice_does_not_duplicate_rows(): void
    {
        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);

        Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->samplePath,
        ]);
        Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->samplePath,
        ]);

        $this->assertSame(2, BookTranslation::count());
        $this->assertSame(3, Chapter::count());
        $this->assertSame(5, Verse::count());
    }

    public function test_import_fails_for_unmapped_book_name(): void
    {
        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);

        $exitCode = Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->unmappedPath,
        ]);

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('Livro Inexistente', Artisan::output());
    }

    #[DataProvider('missingPrerequisiteProvider')]
    public function test_import_fails_when_prerequisite_is_missing(callable $seedPrerequisite, string $expectedMessageFragment): void
    {
        $seedPrerequisite();

        $exitCode = Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->samplePath,
        ]);

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString($expectedMessageFragment, Artisan::output());
    }

    public static function missingPrerequisiteProvider(): Generator
    {
        yield 'sem versão cadastrada' => [
            fn () => (new BooksSeeder)->run(),
            'não encontrada',
        ];

        yield 'sem livros cadastrados' => [
            fn () => (new VersionsSeeder)->run(),
            'Nenhum livro cadastrado',
        ];
    }

    public function test_import_fails_for_unknown_source(): void
    {
        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);

        $exitCode = Artisan::call('bible:import', [
            'source' => 'traducao-fantasma',
        ]);

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('Fonte desconhecida', Artisan::output());
    }

    public function test_fresh_option_wipes_existing_version_data_before_reimporting(): void
    {
        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);

        Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->samplePath,
        ]);

        $version = Version::where('code', 'aa-pt-br')->firstOrFail();
        Verse::where('version_id', $version->id)->first()->update(['text' => 'texto alterado manualmente']);

        Artisan::call('bible:import', [
            'source' => 'ave-maria',
            '--path' => $this->samplePath,
            '--fresh' => true,
        ]);

        $this->assertSame(5, Verse::count());
        $this->assertDatabaseMissing('verses', ['text' => 'texto alterado manualmente']);
    }
}

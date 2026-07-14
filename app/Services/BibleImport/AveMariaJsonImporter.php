<?php

namespace App\Services\BibleImport;

use App\Models\Book;
use App\Models\BookTranslation;
use App\Models\Chapter;
use App\Models\Verse;
use App\Models\Version;
use Illuminate\Support\Facades\DB;
use JsonException;
use RuntimeException;

final class AveMariaJsonImporter implements BibleImporterInterface
{
    private const TESTAMENT_KEYS = ['antigoTestamento', 'novoTestamento'];

    public function __construct(
        private readonly CanonicalBookMap $bookMap = new CanonicalBookMap,
    ) {}

    public function import(Version $version, string $path, bool $fresh = false): ImportResult
    {
        if (! is_file($path)) {
            throw new RuntimeException("Arquivo fonte não encontrado: {$path}");
        }

        $contents = file_get_contents($path);

        if ($contents === false) {
            throw new RuntimeException("Não foi possível ler o arquivo: {$path}");
        }

        try {
            $data = json_decode($contents, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new RuntimeException("JSON inválido em {$path}: {$e->getMessage()}", previous: $e);
        }

        if ($fresh) {
            $this->wipeVersion($version);
        }

        $booksCount = 0;
        $chaptersCount = 0;
        $versesCount = 0;
        $markersDiscarded = 0;

        foreach (self::TESTAMENT_KEYS as $testamentKey) {
            foreach ($data[$testamentKey] ?? [] as $bookData) {
                $mapEntry = $this->bookMap->resolve($bookData['nome']);
                $book = Book::where('slug', $mapEntry['slug'])->first();

                if (! $book) {
                    throw new RuntimeException(
                        "Livro \"{$mapEntry['slug']}\" não encontrado em `books`. Rode `php artisan db:seed --class=BooksSeeder` antes de importar."
                    );
                }

                BookTranslation::updateOrCreate(
                    ['book_id' => $book->id, 'version_id' => $version->id],
                    ['name' => $bookData['nome']]
                );
                $booksCount++;

                foreach ($bookData['capitulos'] ?? [] as $chapterData) {
                    $chapter = Chapter::updateOrCreate(
                        [
                            'book_id' => $book->id,
                            'version_id' => $version->id,
                            'number' => $chapterData['capitulo'],
                        ],
                        ['verse_count' => count($chapterData['versiculos'] ?? [])]
                    );
                    $chaptersCount++;

                    $now = now();
                    $rows = [];

                    foreach ($chapterData['versiculos'] ?? [] as $verseData) {
                        $rawText = (string) $verseData['texto'];
                        $markersDiscarded += substr_count($rawText, '*');

                        // O marcador '*' referencia uma nota de rodapé cujo texto não existe
                        // nesta fonte (ver database/data-sources/ave-maria/README.md).
                        $cleanText = trim(str_replace('*', '', $rawText));

                        $rows[] = [
                            'chapter_id' => $chapter->id,
                            'version_id' => $version->id,
                            'book_id' => $book->id,
                            'number' => $verseData['versiculo'],
                            'text' => $cleanText,
                            'text_plain' => $cleanText,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }

                    foreach (array_chunk($rows, 500) as $chunk) {
                        Verse::upsert(
                            $chunk,
                            uniqueBy: ['chapter_id', 'number'],
                            update: ['text', 'text_plain', 'version_id', 'book_id', 'updated_at']
                        );
                    }

                    $versesCount += count($rows);
                }

                $book->update(['chapter_count' => count($bookData['capitulos'] ?? [])]);
            }
        }

        return new ImportResult($booksCount, $chaptersCount, $versesCount, $markersDiscarded);
    }

    private function wipeVersion(Version $version): void
    {
        DB::transaction(function () use ($version) {
            Verse::where('version_id', $version->id)->delete();
            Chapter::where('version_id', $version->id)->delete();
            BookTranslation::where('version_id', $version->id)->delete();
        });
    }
}

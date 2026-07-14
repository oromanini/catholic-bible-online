<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Chapter;
use App\Models\ReadingPlan;
use App\Models\ReadingPlanDay;
use App\Models\Version;
use Illuminate\Database\Seeder;

class ReadingPlansSeeder extends Seeder
{
    private const DURATION_DAYS = 365;

    /**
     * Gera o plano "Bíblia em 1 ano": leitura sequencial (ordem canônica)
     * de todos os capítulos, distribuídos o mais uniformemente possível
     * entre os 365 dias. Puramente estrutural — não depende do texto de
     * nenhuma versão específica, mas precisa que ALGUMA versão já tenha
     * sido importada (via `bible:import`) para saber quantos capítulos
     * cada livro tem. Não usa `books.chapter_count` diretamente porque
     * essa coluna só é populada pelo importer, criando uma dependência de
     * ordem frágil com o restante do DatabaseSeeder — lê de `chapters`
     * (fonte de verdade) em vez disso.
     */
    public function run(): void
    {
        $version = Version::where('is_default', true)->first() ?? Version::orderBy('sort_order')->first();

        if (! $version) {
            $this->command->warn('Nenhuma versão cadastrada — rode VersionsSeeder e `php artisan bible:import` antes de gerar planos de leitura.');

            return;
        }

        $chapterCounts = Chapter::where('version_id', $version->id)
            ->selectRaw('book_id, count(*) as total')
            ->groupBy('book_id')
            ->pluck('total', 'book_id');

        if ($chapterCounts->isEmpty()) {
            $this->command->warn('Nenhum capítulo importado ainda — rode `php artisan bible:import` antes de gerar planos de leitura.');

            return;
        }

        $books = Book::orderBy('canonical_order')->get(['id', 'slug']);
        $totalChapters = (int) $books->sum(fn (Book $book) => $chapterCounts[$book->id] ?? 0);

        $plan = ReadingPlan::updateOrCreate(
            ['slug' => 'biblia-em-1-ano'],
            [
                'name' => 'Bíblia em 1 ano',
                'description' => 'Leitura sequencial de toda a Bíblia (Antigo e Novo Testamento, incluindo os deuterocanônicos) distribuída em 365 dias.',
                'duration_days' => self::DURATION_DAYS,
                'is_active' => true,
            ]
        );

        $queue = [];
        foreach ($books as $book) {
            $chapterCount = (int) ($chapterCounts[$book->id] ?? 0);

            for ($number = 1; $number <= $chapterCount; $number++) {
                $queue[] = [$book->slug, $number];
            }
        }

        $cursor = 0;
        $queueCount = count($queue);

        for ($day = 1; $day <= self::DURATION_DAYS; $day++) {
            $target = (int) round($day * $totalChapters / self::DURATION_DAYS)
                - (int) round(($day - 1) * $totalChapters / self::DURATION_DAYS);

            $references = [];

            for ($i = 0; $i < $target && $cursor < $queueCount; $i++, $cursor++) {
                [$slug, $number] = $queue[$cursor];
                $lastIndex = count($references) - 1;

                if ($lastIndex >= 0
                    && $references[$lastIndex]['book'] === $slug
                    && $references[$lastIndex]['chapter_end'] === $number - 1) {
                    $references[$lastIndex]['chapter_end'] = $number;
                } else {
                    $references[] = ['book' => $slug, 'chapter_start' => $number, 'chapter_end' => $number];
                }
            }

            ReadingPlanDay::updateOrCreate(
                ['reading_plan_id' => $plan->id, 'day_number' => $day],
                ['references_json' => $references]
            );
        }
    }
}

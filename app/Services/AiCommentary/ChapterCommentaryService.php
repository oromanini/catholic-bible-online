<?php

namespace App\Services\AiCommentary;

use App\Models\AiComment;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\Verse;
use App\Models\Version;
use Illuminate\Database\QueryException;

final class ChapterCommentaryService
{
    public function __construct(
        private readonly AiCommentaryProviderInterface $provider,
    ) {}

    /**
     * Reaproveita o comentário já gerado para este capítulo+versão, se
     * existir. Só chama a IA na primeira vez que alguém pede um capítulo
     * — todos os pedidos seguintes (de qualquer usuário) leem do banco.
     */
    public function getOrGenerate(Book $book, Chapter $chapter, Version $version): AiComment
    {
        $existing = AiComment::where('chapter_id', $chapter->id)
            ->where('version_id', $version->id)
            ->first();

        if ($existing) {
            return $existing;
        }

        $verses = Verse::where('chapter_id', $chapter->id)
            ->orderBy('number')
            ->get(['number', 'text'])
            ->map(fn (Verse $verse) => ['number' => $verse->number, 'text' => $verse->text])
            ->all();

        $bookName = $book->nameForVersion($version) ?? $book->slug;
        $prompt = ChapterCommentaryPrompt::build($bookName, $chapter->number, $verses);
        $content = $this->provider->generate($prompt);

        try {
            return AiComment::create([
                'book_id' => $book->id,
                'chapter_id' => $chapter->id,
                'version_id' => $version->id,
                'content' => $content,
                'provider' => $this->provider->identifier(),
                'model' => $this->provider->model(),
            ]);
        } catch (QueryException) {
            // Condição de corrida: outro request já gerou e salvou nesse meio-tempo.
            return AiComment::where('chapter_id', $chapter->id)
                ->where('version_id', $version->id)
                ->firstOrFail();
        }
    }
}

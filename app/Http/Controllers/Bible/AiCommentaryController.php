<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\AiComment;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\Version;
use App\Services\AiCommentary\ChapterCommentaryService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class AiCommentaryController extends Controller
{
    public function show(Version $version, Book $book, int $chapterNumber): JsonResponse
    {
        $chapter = Chapter::where('book_id', $book->id)
            ->where('version_id', $version->id)
            ->where('number', $chapterNumber)
            ->firstOrFail();

        $comment = AiComment::where('chapter_id', $chapter->id)
            ->where('version_id', $version->id)
            ->first();

        return response()->json([
            'available' => (bool) $comment,
            'content' => $comment?->content,
            'commentId' => $comment?->id,
        ]);
    }

    public function store(Version $version, Book $book, int $chapterNumber, ChapterCommentaryService $service): JsonResponse
    {
        $chapter = Chapter::where('book_id', $book->id)
            ->where('version_id', $version->id)
            ->where('number', $chapterNumber)
            ->firstOrFail();

        try {
            $comment = $service->getOrGenerate($book, $chapter, $version);
        } catch (RuntimeException $e) {
            report($e);

            return response()->json([
                'message' => 'Não foi possível gerar o comentário agora. Tente novamente em instantes.',
            ], 502);
        }

        return response()->json([
            'available' => true,
            'content' => $comment->content,
            'commentId' => $comment->id,
        ]);
    }
}

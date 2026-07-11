<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\ReadingProgress;
use App\Models\Verse;
use App\Models\Version;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class ReaderController extends Controller
{
    public function show(Version $version, Book $book, ?int $chapter = null): Response
    {
        $chapterNumber = $chapter ?? 1;

        $chapterModel = Chapter::where('book_id', $book->id)
            ->where('version_id', $version->id)
            ->where('number', $chapterNumber)
            ->firstOrFail();

        $verses = Cache::remember(
            "verses:{$version->id}:{$chapterModel->id}",
            now()->addDay(),
            fn () => Verse::where('chapter_id', $chapterModel->id)
                ->orderBy('number')
                ->get(['number', 'text'])
                ->map(fn (Verse $verse) => [
                    'number' => $verse->number,
                    'text' => $verse->text,
                ])
                ->all()
        );

        if ($user = Auth::user()) {
            ReadingProgress::updateOrCreate(
                ['user_id' => $user->id, 'version_id' => $version->id],
                ['book_id' => $book->id, 'chapter_id' => $chapterModel->id, 'verse_number' => null, 'updated_at' => now()]
            );
        }

        return Inertia::render('bible/chapter-reader', [
            'version' => [
                'code' => $version->code,
                'name' => $version->name,
            ],
            'book' => [
                'slug' => $book->slug,
                'name' => $book->nameForVersion($version) ?? $book->slug,
                'chapter_count' => $book->chapter_count,
            ],
            'chapter' => [
                'number' => $chapterModel->number,
            ],
            'verses' => $verses,
            'navigation' => $this->chapterNavigation($book, $chapterNumber),
            'books' => Book::navigationTree($version),
        ]);
    }

    private function chapterNavigation(Book $book, int $chapterNumber): array
    {
        $prev = null;
        $next = null;

        if ($chapterNumber > 1) {
            $prev = ['book' => $book->slug, 'chapter' => $chapterNumber - 1];
        } elseif ($prevBook = Book::where('canonical_order', '<', $book->canonical_order)
            ->orderByDesc('canonical_order')
            ->first()) {
            $prev = ['book' => $prevBook->slug, 'chapter' => $prevBook->chapter_count];
        }

        if ($chapterNumber < $book->chapter_count) {
            $next = ['book' => $book->slug, 'chapter' => $chapterNumber + 1];
        } elseif ($nextBook = Book::where('canonical_order', '>', $book->canonical_order)
            ->orderBy('canonical_order')
            ->first()) {
            $next = ['book' => $nextBook->slug, 'chapter' => 1];
        }

        return ['prev' => $prev, 'next' => $next];
    }
}

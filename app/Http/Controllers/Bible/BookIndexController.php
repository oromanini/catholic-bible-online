<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\ReadingProgress;
use App\Models\Version;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BookIndexController extends Controller
{
    public function show(Version $version): Response
    {
        return Inertia::render('bible/book-index', [
            'version' => [
                'code' => $version->code,
                'name' => $version->name,
            ],
            'versions' => Version::orderBy('sort_order')->get(['code', 'name']),
            'books' => Book::navigationTree($version),
            'serverPosition' => $this->serverPosition($version),
        ]);
    }

    private function serverPosition(Version $version): ?array
    {
        $user = Auth::user();

        if (! $user) {
            return null;
        }

        $progress = ReadingProgress::with(['book', 'chapter'])
            ->where('user_id', $user->id)
            ->where('version_id', $version->id)
            ->first();

        if (! $progress) {
            return null;
        }

        return [
            'versionCode' => $version->code,
            'bookSlug' => $progress->book->slug,
            'bookName' => $progress->book->nameForVersion($version) ?? $progress->book->slug,
            'chapterNumber' => $progress->chapter->number,
            'updatedAt' => optional($progress->updated_at)->toIso8601String(),
        ];
    }
}

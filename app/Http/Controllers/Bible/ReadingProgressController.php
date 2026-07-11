<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\ReadingProgress;
use App\Models\Version;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReadingProgressController extends Controller
{
    /**
     * Sincroniza a posição de leitura salva no client (localStorage) para o
     * servidor, usada quando um usuário loga com uma posição local mais
     * recente do que a última registrada no servidor ("mais recente vence").
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'version' => ['required', 'string', 'exists:versions,code'],
            'book' => ['required', 'string', 'exists:books,slug'],
            'chapter' => ['required', 'integer', 'min:1'],
            'updated_at' => ['required', 'date'],
        ]);

        $version = Version::where('code', $data['version'])->firstOrFail();
        $book = Book::where('slug', $data['book'])->firstOrFail();
        $chapter = Chapter::where('book_id', $book->id)
            ->where('version_id', $version->id)
            ->where('number', $data['chapter'])
            ->firstOrFail();

        $clientUpdatedAt = Carbon::parse($data['updated_at']);

        $existing = ReadingProgress::where('user_id', $request->user()->id)
            ->where('version_id', $version->id)
            ->first();

        if (! $existing || $clientUpdatedAt->greaterThan($existing->updated_at)) {
            ReadingProgress::updateOrCreate(
                ['user_id' => $request->user()->id, 'version_id' => $version->id],
                ['book_id' => $book->id, 'chapter_id' => $chapter->id, 'verse_number' => null, 'updated_at' => $clientUpdatedAt]
            );
        }

        return back();
    }
}

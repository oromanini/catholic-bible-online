<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bible\SearchRequest;
use App\Models\Verse;
use App\Models\Version;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function show(SearchRequest $request): Response
    {
        $query = trim((string) $request->validated('q'));
        $version = Version::where('code', $request->validated('version'))->first()
            ?? Version::where('is_default', true)->first()
            ?? Version::orderBy('sort_order')->firstOrFail();

        $results = collect();

        if ($query !== '') {
            $results = Verse::query()
                ->where('version_id', $version->id)
                ->whereFullText('text_plain', $query)
                ->with(['book:id,slug', 'chapter:id,number'])
                ->limit(100)
                ->get()
                ->map(fn (Verse $verse) => [
                    'book_slug' => $verse->book->slug,
                    'book_name' => $verse->book->nameForVersion($version) ?? $verse->book->slug,
                    'chapter' => $verse->chapter->number,
                    'number' => $verse->number,
                    'text' => $verse->text,
                ]);
        }

        return Inertia::render('bible/search-results', [
            'version' => [
                'code' => $version->code,
                'name' => $version->name,
            ],
            'versions' => Version::orderBy('sort_order')->get(['code', 'name']),
            'query' => $query,
            'results' => $results,
        ]);
    }
}

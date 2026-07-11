<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookQuote;
use App\Services\QuoteSearch\ChurchFatherQuoteService;
use Illuminate\Http\JsonResponse;

class BookQuoteController extends Controller
{
    public function show(Book $book): JsonResponse
    {
        $quote = BookQuote::where('book_id', $book->id)->first();

        return response()->json($this->format($quote));
    }

    public function store(Book $book, ChurchFatherQuoteService $service): JsonResponse
    {
        $quote = $service->findOrSearch($book);

        return response()->json($this->format($quote));
    }

    private function format(?BookQuote $quote): array
    {
        if (! $quote) {
            return ['available' => false];
        }

        return [
            'available' => true,
            'author' => $quote->author,
            'workTitle' => $quote->work_title,
            'quoteOriginal' => $quote->quote_original,
            'quoteTranslated' => $quote->quote_translated,
            'sourceUrl' => $quote->source_url,
            'sourceDomain' => $quote->source_domain,
        ];
    }
}

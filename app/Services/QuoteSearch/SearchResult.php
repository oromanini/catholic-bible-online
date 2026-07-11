<?php

namespace App\Services\QuoteSearch;

final readonly class SearchResult
{
    public function __construct(
        public string $url,
        public string $domain,
        public string $title,
        public string $snippet,
    ) {}
}

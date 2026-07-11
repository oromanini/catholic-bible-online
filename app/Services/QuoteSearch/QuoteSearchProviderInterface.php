<?php

namespace App\Services\QuoteSearch;

interface QuoteSearchProviderInterface
{
    /**
     * @return array<int, SearchResult>
     *
     * @throws \RuntimeException se a busca falhar.
     */
    public function search(string $query): array;
}

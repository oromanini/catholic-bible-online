<?php

namespace App\Services\QuoteSearch;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * O "motor de busca em tempo real" em si não garante confiabilidade — quem
 * garante é o mecanismo de busca (cx) estar restrito, do lado do Google, a
 * um punhado de domínios confiáveis (newadvent.org, ccel.org, vatican.va,
 * documentacatholicaomnia.eu). Este provider só executa a busca; a
 * verificação de que o texto citado realmente existe na página fica em
 * ChurchFatherQuoteService.
 */
final class GoogleCustomSearchProvider implements QuoteSearchProviderInterface
{
    private const ENDPOINT = 'https://www.googleapis.com/customsearch/v1';

    public function __construct(
        private readonly string $apiKey,
        private readonly string $searchEngineId,
    ) {}

    public function search(string $query): array
    {
        $response = Http::get(self::ENDPOINT, [
            'key' => $this->apiKey,
            'cx' => $this->searchEngineId,
            'q' => $query,
            'num' => 5,
        ]);

        if ($response->failed()) {
            throw new RuntimeException("Falha na busca: HTTP {$response->status()} — {$response->body()}");
        }

        $items = $response->json('items', []);

        return collect($items)
            ->map(fn (array $item) => new SearchResult(
                url: $item['link'],
                domain: parse_url($item['link'], PHP_URL_HOST) ?: '',
                title: $item['title'] ?? '',
                snippet: $item['snippet'] ?? '',
            ))
            ->all();
    }
}

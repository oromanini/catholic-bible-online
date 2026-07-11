<?php

namespace App\Services\QuoteSearch;

use App\Models\Book;
use App\Models\BookQuote;
use App\Services\AiCommentary\AiCommentaryProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * O que garante confiabilidade aqui não é "buscar em tempo real" — é a
 * combinação de (1) o mecanismo de busca já vir restrito, do lado do
 * Google, a um punhado de domínios confiáveis, e (2) esta classe nunca
 * aceitar uma citação que não seja um trecho literal (substring, após
 * normalizar espaços/entidades HTML) da página de origem. Se nenhum
 * resultado passar na verificação, nada é salvo — sem citação inventada.
 */
final class ChurchFatherQuoteService
{
    private const TRUSTED_DOMAINS = [
        'newadvent.org',
        'ccel.org',
        'vatican.va',
        'documentacatholicaomnia.eu',
    ];

    public function __construct(
        private readonly QuoteSearchProviderInterface $searchProvider,
        private readonly AiCommentaryProviderInterface $aiProvider,
    ) {}

    public function findOrSearch(Book $book): ?BookQuote
    {
        $existing = BookQuote::where('book_id', $book->id)->first();
        if ($existing) {
            return $existing;
        }

        $englishName = BookEnglishNames::forSlug($book->slug);
        if (! $englishName) {
            return null;
        }

        try {
            $results = $this->searchProvider->search("\"{$englishName}\" commentary Church Fathers");
        } catch (Throwable $e) {
            Log::warning('book-quote: busca falhou', ['book' => $book->slug, 'error' => $e->getMessage()]);

            return null;
        }

        foreach ($results as $result) {
            if (! $this->isTrustedDomain($result->domain)) {
                continue;
            }

            $verified = $this->tryExtractVerifiedQuote($result, $englishName);

            if ($verified) {
                return BookQuote::create([
                    'book_id' => $book->id,
                    'author' => $verified['author'],
                    'work_title' => $verified['work'],
                    'quote_original' => $verified['quote'],
                    'quote_translated' => $this->translate($verified['quote']),
                    'source_url' => $result->url,
                    'source_domain' => $result->domain,
                    'language' => 'en',
                ]);
            }
        }

        return null;
    }

    private function isTrustedDomain(string $domain): bool
    {
        foreach (self::TRUSTED_DOMAINS as $trusted) {
            if ($domain === $trusted || str_ends_with($domain, ".{$trusted}")) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return array{quote: string, author: string, work: ?string}|null
     */
    private function tryExtractVerifiedQuote(SearchResult $result, string $bookName): ?array
    {
        try {
            $response = Http::withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; BibliaCatolicaBot/1.0)'])
                ->timeout(15)
                ->get($result->url);
        } catch (Throwable) {
            return null;
        }

        if ($response->failed()) {
            return null;
        }

        $pageText = $this->htmlToPlainText($response->body());
        if (trim($pageText) === '') {
            return null;
        }

        $prompt = <<<PROMPT
            A seguir está o texto de uma página sobre escritos dos Padres da Igreja.
            Encontre uma passagem curta (2 a 4 frases) escrita por um Padre da Igreja
            ou santo sobre o livro bíblico de {$bookName}, adequada como uma citação
            inspiracional. Responda APENAS com um JSON no formato
            {"quote": "...", "author": "...", "work": "..."} onde "quote" é copiado
            EXATAMENTE como aparece no texto abaixo (sem parafrasear, sem resumir,
            sem corrigir ortografia). Se não houver nenhuma passagem clara e citável
            sobre esse livro específico no texto, responda {"quote": null}.

            Texto da página:
            {$this->truncate($pageText, 12000)}
            PROMPT;

        try {
            $raw = $this->aiProvider->generate($prompt);
        } catch (Throwable) {
            return null;
        }

        $data = $this->parseJson($raw);
        if (! $data || empty($data['quote'])) {
            return null;
        }

        if (! $this->isVerbatimSubstring($data['quote'], $pageText)) {
            Log::info('book-quote: citação rejeitada — não encontrada literalmente na página', ['url' => $result->url]);

            return null;
        }

        return [
            'quote' => trim($data['quote']),
            'author' => trim($data['author'] ?? '') ?: 'Autor não identificado',
            'work' => ! empty($data['work']) ? trim($data['work']) : null,
        ];
    }

    private function translate(string $text): ?string
    {
        try {
            return $this->aiProvider->generate(
                "Traduza o texto a seguir para português do Brasil, de forma natural e fiel ao sentido original. Responda apenas com a tradução, sem comentários nem aspas.\n\n{$text}"
            );
        } catch (Throwable) {
            return null;
        }
    }

    private function htmlToPlainText(string $html): string
    {
        $withoutScripts = preg_replace('/<(script|style)\b[^>]*>.*?<\/\1>/is', ' ', $html) ?? $html;
        $text = html_entity_decode(strip_tags($withoutScripts), ENT_QUOTES | ENT_HTML5);

        return trim(preg_replace('/\s+/', ' ', $text) ?? '');
    }

    private function isVerbatimSubstring(string $needle, string $haystack): bool
    {
        $normalize = fn (string $text) => trim(preg_replace('/\s+/', ' ', html_entity_decode($text, ENT_QUOTES | ENT_HTML5)) ?? '');

        return str_contains($normalize($haystack), $normalize($needle));
    }

    private function truncate(string $text, int $limit): string
    {
        return mb_strlen($text) > $limit ? mb_substr($text, 0, $limit) : $text;
    }

    /**
     * @return array{quote: ?string, author?: string, work?: string}|null
     */
    private function parseJson(string $raw): ?array
    {
        $cleaned = trim(preg_replace('/^```(?:json)?|```$/m', '', trim($raw)) ?? $raw);
        $data = json_decode($cleaned, true);

        return is_array($data) ? $data : null;
    }
}

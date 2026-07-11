<?php

namespace App\Services\AiCommentary;

use Illuminate\Support\Facades\Http;
use RuntimeException;

final class GeminiCommentaryProvider implements AiCommentaryProviderInterface
{
    private const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent';

    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
    ) {}

    public function generate(string $prompt): string
    {
        $response = Http::withHeaders(['X-goog-api-key' => $this->apiKey])
            ->timeout(30)
            ->post(sprintf(self::ENDPOINT, $this->model), [
                'contents' => [['parts' => [['text' => $prompt]]]],
            ]);

        if ($response->failed()) {
            throw new RuntimeException("Falha ao gerar comentário via Gemini: HTTP {$response->status()} — {$response->body()}");
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! is_string($text) || trim($text) === '') {
            throw new RuntimeException('Resposta do Gemini não contém texto de comentário.');
        }

        return trim($text);
    }

    public function identifier(): string
    {
        return 'gemini';
    }

    public function model(): string
    {
        return $this->model;
    }
}

<?php

namespace App\Services\AiCommentary;

interface AiCommentaryProviderInterface
{
    /**
     * @throws \RuntimeException se o provedor não conseguir gerar uma resposta.
     */
    public function generate(string $prompt): string;

    public function identifier(): string;

    public function model(): string;
}

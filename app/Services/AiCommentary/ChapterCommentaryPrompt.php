<?php

namespace App\Services\AiCommentary;

final class ChapterCommentaryPrompt
{
    /**
     * @param  array<int, array{number: int, text: string}>  $verses
     */
    public static function build(string $bookName, int $chapterNumber, array $verses): string
    {
        $text = collect($verses)
            ->map(fn (array $verse) => "{$verse['number']}. {$verse['text']}")
            ->implode("\n");

        return <<<PROMPT
            Você é um assistente de estudo bíblico católico. Ofereça um breve comentário
            (no máximo 3 parágrafos curtos, em português) sobre o capítulo {$chapterNumber}
            do livro de {$bookName}, ancorado na tradição, no Catecismo da Igreja Católica
            e nos ensinamentos do Magistério — sem especular além do que a Igreja ensina,
            e deixando claro quando um ponto é interpretação e não doutrina definida.

            Texto do capítulo:
            {$text}

            Responda apenas com o comentário, sem saudações nem repetir o texto do capítulo.
            PROMPT;
    }
}

<?php

namespace App\Services\QuoteSearch;

/**
 * Nome em inglês de cada livro (por slug), usado só para montar a query de
 * busca — as fontes confiáveis (New Advent, CCEL etc.) são majoritariamente
 * em inglês/latim.
 */
final class BookEnglishNames
{
    private const MAP = [
        'genesis' => 'Genesis',
        'exodo' => 'Exodus',
        'levitico' => 'Leviticus',
        'numeros' => 'Numbers',
        'deuteronomio' => 'Deuteronomy',
        'josue' => 'Joshua',
        'juizes' => 'Judges',
        'rute' => 'Ruth',
        '1-samuel' => '1 Samuel',
        '2-samuel' => '2 Samuel',
        '1-reis' => '1 Kings',
        '2-reis' => '2 Kings',
        '1-cronicas' => '1 Chronicles',
        '2-cronicas' => '2 Chronicles',
        'esdras' => 'Ezra',
        'neemias' => 'Nehemiah',
        'tobias' => 'Tobit',
        'judite' => 'Judith',
        'ester' => 'Esther',
        'jo' => 'Job',
        'salmos' => 'Psalms',
        '1-macabeus' => '1 Maccabees',
        '2-macabeus' => '2 Maccabees',
        'proverbios' => 'Proverbs',
        'eclesiastes' => 'Ecclesiastes',
        'cantico-dos-canticos' => 'Song of Songs',
        'sabedoria' => 'Wisdom',
        'eclesiastico' => 'Sirach',
        'isaias' => 'Isaiah',
        'jeremias' => 'Jeremiah',
        'lamentacoes' => 'Lamentations',
        'baruc' => 'Baruch',
        'ezequiel' => 'Ezekiel',
        'daniel' => 'Daniel',
        'oseias' => 'Hosea',
        'joel' => 'Joel',
        'amos' => 'Amos',
        'abdias' => 'Obadiah',
        'jonas' => 'Jonah',
        'miqueias' => 'Micah',
        'naum' => 'Nahum',
        'habacuc' => 'Habakkuk',
        'sofonias' => 'Zephaniah',
        'ageu' => 'Haggai',
        'zacarias' => 'Zechariah',
        'malaquias' => 'Malachi',
        'mateus' => 'Matthew',
        'marcos' => 'Mark',
        'lucas' => 'Luke',
        'joao' => 'John',
        'atos-dos-apostolos' => 'Acts of the Apostles',
        'romanos' => 'Romans',
        '1-corintios' => '1 Corinthians',
        '2-corintios' => '2 Corinthians',
        'galatas' => 'Galatians',
        'efesios' => 'Ephesians',
        'filipenses' => 'Philippians',
        'colossenses' => 'Colossians',
        '1-tessalonicenses' => '1 Thessalonians',
        '2-tessalonicenses' => '2 Thessalonians',
        '1-timoteo' => '1 Timothy',
        '2-timoteo' => '2 Timothy',
        'tito' => 'Titus',
        'filemon' => 'Philemon',
        'hebreus' => 'Hebrews',
        'tiago' => 'James',
        '1-pedro' => '1 Peter',
        '2-pedro' => '2 Peter',
        '1-joao' => '1 John',
        '2-joao' => '2 John',
        '3-joao' => '3 John',
        'judas' => 'Jude',
        'apocalipse' => 'Revelation',
    ];

    public static function forSlug(string $slug): ?string
    {
        return self::MAP[$slug] ?? null;
    }
}

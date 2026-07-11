<?php

namespace App\Services\BibleImport;

final readonly class ImportResult
{
    public function __construct(
        public int $books,
        public int $chapters,
        public int $verses,
        public int $footnoteMarkersDiscarded,
    ) {}
}

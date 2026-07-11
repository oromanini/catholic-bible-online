<?php

namespace App\Services\BibleImport;

use RuntimeException;

final class CanonicalBookMap
{
    /** @var array<string, array{slug: string, testament: string, category: string, order: int, abbr: string, deutero: bool}> */
    private array $map;

    public function __construct(?string $path = null)
    {
        $path ??= database_path('data-sources/ave-maria/category-map.php');
        $this->map = require $path;
    }

    /**
     * @return array{slug: string, testament: string, category: string, order: int, abbr: string, deutero: bool}
     */
    public function resolve(string $jsonBookName): array
    {
        if (! isset($this->map[$jsonBookName])) {
            throw new RuntimeException(
                "Livro não mapeado no CanonicalBookMap: \"{$jsonBookName}\". Adicione uma entrada em database/data-sources/ave-maria/category-map.php."
            );
        }

        return $this->map[$jsonBookName];
    }
}

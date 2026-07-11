<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BooksSeeder extends Seeder
{
    /**
     * Popula os 73 livros do cânone católico e sua ordem canônica.
     * Dado estático do domínio, independente de qualquer tradução/versão.
     */
    public function run(): void
    {
        $map = require database_path('data-sources/ave-maria/category-map.php');

        foreach ($map as $entry) {
            Book::updateOrCreate(
                ['slug' => $entry['slug']],
                [
                    'testament' => $entry['testament'],
                    'category' => $entry['category'],
                    'canonical_order' => $entry['order'],
                    'abbreviation' => $entry['abbr'],
                    'is_deuterocanonical' => $entry['deutero'],
                ]
            );
        }
    }
}

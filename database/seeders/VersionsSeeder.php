<?php

namespace Database\Seeders;

use App\Models\Version;
use Illuminate\Database\Seeder;

class VersionsSeeder extends Seeder
{
    /**
     * Registro inicial da versão Ave Maria. Uso pessoal/privado por enquanto
     * (is_public=false) até a migração para uma tradução de domínio público
     * ou licenciada oficialmente.
     */
    public function run(): void
    {
        Version::updateOrCreate(
            ['code' => 'aa-pt-br'],
            [
                'name' => 'Bíblia Ave Maria',
                'language' => 'pt-BR',
                'publisher' => 'Editora Ave Maria',
                'license_status' => 'proprietary',
                'license_notes' => 'Uso pessoal apenas. Migrar para tradução de domínio público (ex.: Pereira de Figueiredo) ou licença oficial antes de tornar o app público/monetizado.',
                'is_public' => false,
                'is_default' => true,
                'sort_order' => 0,
            ]
        );
    }
}

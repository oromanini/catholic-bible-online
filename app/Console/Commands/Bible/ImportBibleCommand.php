<?php

namespace App\Console\Commands\Bible;

use App\Models\Book;
use App\Models\Version;
use App\Services\BibleImport\AveMariaJsonImporter;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use RuntimeException;

#[Signature(
    'bible:import
        {source=ave-maria : Identificador da fonte de dados suportada (ave-maria)}
        {--path= : Caminho customizado para o arquivo JSON fonte}
        {--version-code= : Código da versão a associar (default depende da fonte)}
        {--fresh : Apaga os dados existentes dessa versão antes de reimportar}'
)]
#[Description('Importa o texto bíblico de uma fonte de dados para o banco.')]
class ImportBibleCommand extends Command
{
    private const SOURCES = [
        'ave-maria' => [
            'importer' => AveMariaJsonImporter::class,
            'default_path' => 'data-sources/ave-maria/bibliaAveMaria.json',
            'default_version_code' => 'aa-pt-br',
        ],
    ];

    public function handle(): int
    {
        $source = $this->argument('source');

        if (! isset(self::SOURCES[$source])) {
            $this->error("Fonte desconhecida: \"{$source}\". Fontes suportadas: ".implode(', ', array_keys(self::SOURCES)));

            return self::FAILURE;
        }

        $sourceConfig = self::SOURCES[$source];
        $path = $this->option('path') ?: database_path($sourceConfig['default_path']);
        $versionCode = $this->option('version-code') ?: $sourceConfig['default_version_code'];

        $version = Version::where('code', $versionCode)->first();
        if (! $version) {
            $this->error("Versão \"{$versionCode}\" não encontrada. Rode `php artisan db:seed --class=VersionsSeeder` primeiro.");

            return self::FAILURE;
        }

        if (Book::count() === 0) {
            $this->error('Nenhum livro cadastrado. Rode `php artisan db:seed --class=BooksSeeder` primeiro.');

            return self::FAILURE;
        }

        $this->info("Importando \"{$source}\" para a versão [{$version->code}] a partir de {$path}...");

        $importer = $this->laravel->make($sourceConfig['importer']);

        try {
            $result = $importer->import($version, $path, fresh: (bool) $this->option('fresh'));
        } catch (RuntimeException $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        $this->info("Livros processados: {$result->books}");
        $this->info("Capítulos importados: {$result->chapters}");
        $this->info("Versículos importados: {$result->verses}");

        if ($result->footnoteMarkersDiscarded > 0) {
            $this->warn("{$result->footnoteMarkersDiscarded} marcadores de nota (*) foram removidos do texto — conteúdo das notas ainda não está disponível nesta fonte.");
        }

        return self::SUCCESS;
    }
}

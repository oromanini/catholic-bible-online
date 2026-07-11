<?php

namespace App\Services\BibleImport;

use App\Models\Version;

interface BibleImporterInterface
{
    public function import(Version $version, string $path, bool $fresh = false): ImportResult;
}

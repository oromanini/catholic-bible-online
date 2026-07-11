<?php

use Database\Seeders\VersionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('redirects home to the default bible version', function () {
    $this->seed(VersionsSeeder::class);

    $response = $this->get('/');

    $response->assertRedirect('/b/aa-pt-br');
});

<?php

require __DIR__.'/../vendor/autoload.php';

/**
 * Docker injeta as variáveis do .env como variáveis de ambiente reais do
 * processo (via env_file/environment no docker-compose.yml). Isso faz com
 * que $_SERVER já contenha os valores de produção/dev (ex.: DB_CONNECTION=
 * mysql) antes do PHPUnit processar phpunit.xml — e o override <env
 * force="true"/> do PHPUnit só atualiza $_ENV/putenv(), não $_SERVER, então
 * não é suficiente sozinho. Forçamos os três aqui para garantir testes
 * isolados (sqlite em memória) independente do ambiente onde rodam.
 */
$testingEnv = [
    'APP_ENV' => 'testing',
    'APP_MAINTENANCE_DRIVER' => 'file',
    'BCRYPT_ROUNDS' => '4',
    'BROADCAST_CONNECTION' => 'null',
    'CACHE_STORE' => 'array',
    'DB_CONNECTION' => 'sqlite',
    'DB_DATABASE' => ':memory:',
    'DB_URL' => '',
    'MAIL_MAILER' => 'array',
    'QUEUE_CONNECTION' => 'sync',
    'SESSION_DRIVER' => 'array',
    'PULSE_ENABLED' => 'false',
    'TELESCOPE_ENABLED' => 'false',
    'NIGHTWATCH_ENABLED' => 'false',
];

foreach ($testingEnv as $key => $value) {
    putenv("{$key}={$value}");
    $_ENV[$key] = $value;
    $_SERVER[$key] = $value;
}

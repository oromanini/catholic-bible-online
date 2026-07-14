#!/bin/bash
# A Vercel só builda o frontend (Node); ela não roda o backend Laravel
# (sem PHP-FPM/MySQL/Redis persistentes). O `vite build` ainda precisa
# de PHP disponível porque o plugin @laravel/vite-plugin-wayfinder roda
# `php artisan wayfinder:generate` para gerar `resources/js/routes` e
# `resources/js/actions` a partir das rotas reais do Laravel — por isso
# instalamos um PHP CLI mínimo aqui só para esse passo de build.
set -e

if ! command -v php >/dev/null 2>&1; then
    if command -v dnf >/dev/null 2>&1; then
        dnf install -y php-cli php-mbstring php-xml php-tokenizer
    elif command -v yum >/dev/null 2>&1; then
        yum install -y php-cli php-mbstring php-xml php-tokenizer
    elif command -v apt-get >/dev/null 2>&1; then
        apt-get update -y
        apt-get install -y php-cli php-mbstring php-xml
    else
        echo "Nenhum gerenciador de pacotes suportado (dnf/yum/apt-get) encontrado para instalar o PHP." >&2
        exit 1
    fi
fi

php -v

if ! command -v composer >/dev/null 2>&1; then
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer
    rm -f composer-setup.php
fi

[ -f .env ] || cp .env.example .env

composer install --no-interaction --prefer-dist --no-progress --no-dev

php artisan key:generate --no-interaction --force

npm install

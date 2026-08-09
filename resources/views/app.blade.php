<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Aplica tema de leitura e tipografia antes da primeira pintura,
             senão quem lê no escuro leva um flash branco a cada navegação. --}}
        <script>
            (function() {
                try {
                    const theme = localStorage.getItem('reading-theme');
                    const typeface = localStorage.getItem('typeface');

                    document.documentElement.setAttribute(
                        'data-reading-theme',
                        ['light', 'sepia', 'dark'].includes(theme) ? theme : 'light'
                    );
                    document.documentElement.setAttribute(
                        'data-typeface',
                        ['serif', 'sans'].includes(typeface) ? typeface : 'serif'
                    );
                } catch (e) {
                    document.documentElement.setAttribute('data-reading-theme', 'light');
                    document.documentElement.setAttribute('data-typeface', 'serif');
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            html[data-reading-theme='light'] { background-color: #f7f4ee; }
            html[data-reading-theme='sepia'] { background-color: #efe6d2; }
            html[data-reading-theme='dark'] { background-color: #0d0c0a; }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>

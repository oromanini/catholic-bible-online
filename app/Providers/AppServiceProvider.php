<?php

namespace App\Providers;

use App\Services\AiCommentary\AiCommentaryProviderInterface;
use App\Services\AiCommentary\GeminiCommentaryProvider;
use App\Services\QuoteSearch\GoogleCustomSearchProvider;
use App\Services\QuoteSearch\QuoteSearchProviderInterface;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AiCommentaryProviderInterface::class, fn () => new GeminiCommentaryProvider(
            apiKey: (string) config('services.gemini.key'),
            model: (string) config('services.gemini.model'),
        ));

        $this->app->bind(QuoteSearchProviderInterface::class, fn () => new GoogleCustomSearchProvider(
            apiKey: (string) config('services.google_custom_search.key'),
            searchEngineId: (string) config('services.google_custom_search.engine_id'),
        ));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}

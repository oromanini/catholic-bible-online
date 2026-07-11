<?php

use App\Http\Controllers\Bible\AiCommentaryController;
use App\Http\Controllers\Bible\AiCommentaryFeedbackController;
use App\Http\Controllers\Bible\BookIndexController;
use App\Http\Controllers\Bible\BookQuoteController;
use App\Http\Controllers\Bible\ReaderController;
use App\Http\Controllers\Bible\ReadingPlanController;
use App\Http\Controllers\Bible\ReadingPlanProgressController;
use App\Http\Controllers\Bible\ReadingProgressController;
use App\Http\Controllers\Bible\SearchController;
use App\Models\Version;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $version = Version::where('is_default', true)->first() ?? Version::orderBy('sort_order')->first();

    abort_unless($version, 404);

    return redirect()->route('bible.books', ['version' => $version->code]);
})->name('home');

Route::get('/busca', [SearchController::class, 'show'])->name('bible.search');
Route::get('/b/{version}', [BookIndexController::class, 'show'])->name('bible.books');
Route::get('/b/{version}/{book}/{chapter?}', [ReaderController::class, 'show'])
    ->where('chapter', '[0-9]+')
    ->name('bible.read');
Route::get('/planos-de-leitura', [ReadingPlanController::class, 'index'])->name('bible.plans.index');
Route::get('/planos-de-leitura/{plan}', [ReadingPlanController::class, 'show'])->name('bible.plans.show');
Route::get('/b/{version}/{book}/{chapterNumber}/comentario', [AiCommentaryController::class, 'show'])
    ->where('chapterNumber', '[0-9]+')
    ->name('bible.ai-commentary.show');
Route::get('/livros/{book}/citacao', [BookQuoteController::class, 'show'])->name('bible.quotes.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::post('/leitura/progresso', [ReadingProgressController::class, 'store'])->name('bible.progress.store');
    Route::post('/planos-de-leitura/{plan}/dias/{day}', [ReadingPlanProgressController::class, 'toggle'])
        ->where('day', '[0-9]+')
        ->name('bible.plans.progress.toggle');
    Route::post('/comentarios-ia/{comment}/feedback', [AiCommentaryFeedbackController::class, 'store'])
        ->name('bible.ai-commentary.feedback');
});

Route::middleware('throttle:10,1')->post('/b/{version}/{book}/{chapterNumber}/comentario', [AiCommentaryController::class, 'store'])
    ->where('chapterNumber', '[0-9]+')
    ->name('bible.ai-commentary.store');
Route::middleware('throttle:10,1')->post('/livros/{book}/citacao', [BookQuoteController::class, 'store'])->name('bible.quotes.store');

require __DIR__.'/settings.php';

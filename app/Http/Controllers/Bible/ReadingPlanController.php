<?php

namespace App\Http\Controllers\Bible;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\ReadingPlan;
use App\Models\ReadingPlanDay;
use App\Models\ReadingPlanProgress;
use App\Models\Version;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReadingPlanController extends Controller
{
    public function index(): Response
    {
        $plans = ReadingPlan::where('is_active', true)->orderBy('name')->get();

        $completedByPlan = [];
        if ($user = Auth::user()) {
            $completedByPlan = ReadingPlanProgress::where('user_id', $user->id)
                ->whereIn('reading_plan_id', $plans->pluck('id'))
                ->selectRaw('reading_plan_id, count(*) as completed')
                ->groupBy('reading_plan_id')
                ->pluck('completed', 'reading_plan_id');
        }

        return Inertia::render('bible/reading-plans/index', [
            'plans' => $plans->map(fn (ReadingPlan $plan) => [
                'slug' => $plan->slug,
                'name' => $plan->name,
                'description' => $plan->description,
                'durationDays' => $plan->duration_days,
                'completedDays' => (int) ($completedByPlan[$plan->id] ?? 0),
            ]),
        ]);
    }

    public function show(ReadingPlan $plan): Response
    {
        $version = Version::where('is_default', true)->first() ?? Version::orderBy('sort_order')->firstOrFail();

        $bookNames = Book::query()
            ->with(['translations' => fn ($query) => $query->where('version_id', $version->id)])
            ->get()
            ->keyBy('slug');

        $completedDays = [];
        if ($user = Auth::user()) {
            $completedDays = ReadingPlanProgress::where('user_id', $user->id)
                ->where('reading_plan_id', $plan->id)
                ->pluck('day_number')
                ->all();
        }

        $days = $plan->days()
            ->orderBy('day_number')
            ->get()
            ->map(fn (ReadingPlanDay $day) => [
                'dayNumber' => $day->day_number,
                'references' => collect($day->references_json)->map(fn (array $ref) => [
                    'bookSlug' => $ref['book'],
                    'bookName' => $bookNames[$ref['book']]->translations->first()->name ?? $ref['book'],
                    'chapterStart' => $ref['chapter_start'],
                    'chapterEnd' => $ref['chapter_end'],
                ]),
                'completed' => in_array($day->day_number, $completedDays, true),
            ]);

        return Inertia::render('bible/reading-plans/show', [
            'version' => [
                'code' => $version->code,
                'name' => $version->name,
            ],
            'plan' => [
                'slug' => $plan->slug,
                'name' => $plan->name,
                'description' => $plan->description,
                'durationDays' => $plan->duration_days,
            ],
            'days' => $days,
        ]);
    }
}

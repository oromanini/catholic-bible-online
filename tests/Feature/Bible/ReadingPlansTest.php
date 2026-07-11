<?php

namespace Tests\Feature\Bible;

use App\Models\ReadingPlan;
use App\Models\ReadingPlanProgress;
use App\Models\User;
use Database\Seeders\BooksSeeder;
use Database\Seeders\ReadingPlansSeeder;
use Database\Seeders\VersionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class ReadingPlansTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);
        Artisan::call('bible:import', ['source' => 'ave-maria']);
        $this->seed(ReadingPlansSeeder::class);
    }

    public function test_seeder_generates_365_days_covering_all_canonical_chapters(): void
    {
        $plan = ReadingPlan::where('slug', 'biblia-em-1-ano')->firstOrFail();

        $this->assertSame(365, $plan->duration_days);
        $this->assertSame(365, $plan->days()->count());

        $totalChapters = $plan->days->sum(
            fn ($day) => collect($day->references_json)->sum(fn (array $ref) => $ref['chapter_end'] - $ref['chapter_start'] + 1)
        );

        $this->assertSame(1334, $totalChapters);

        $lastDay = $plan->days()->where('day_number', 365)->firstOrFail();
        $lastReference = collect($lastDay->references_json)->last();
        $this->assertSame('apocalipse', $lastReference['book']);
        $this->assertSame(22, $lastReference['chapter_end']);
    }

    public function test_index_lists_active_plans(): void
    {
        $this->get('/planos-de-leitura')
            ->assertInertia(fn ($page) => $page
                ->component('bible/reading-plans/index')
                ->where('plans.0.slug', 'biblia-em-1-ano')
                ->where('plans.0.completedDays', 0)
            );
    }

    public function test_show_exposes_days_with_no_progress_for_guests(): void
    {
        $this->get('/planos-de-leitura/biblia-em-1-ano')
            ->assertInertia(fn ($page) => $page
                ->component('bible/reading-plans/show')
                ->where('days.0.dayNumber', 1)
                ->where('days.0.completed', false)
                ->where('days.0.references.0.bookSlug', 'genesis')
            );
    }

    public function test_authenticated_user_can_toggle_a_day_as_completed(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/planos-de-leitura/biblia-em-1-ano/dias/1')
            ->assertRedirect();

        $this->assertDatabaseHas('reading_plan_progress', [
            'user_id' => $user->id,
            'day_number' => 1,
        ]);

        // Chamar de novo desmarca (toggle).
        $this->actingAs($user)
            ->post('/planos-de-leitura/biblia-em-1-ano/dias/1')
            ->assertRedirect();

        $this->assertDatabaseMissing('reading_plan_progress', [
            'user_id' => $user->id,
            'day_number' => 1,
        ]);
    }

    public function test_toggle_requires_authentication(): void
    {
        $this->post('/planos-de-leitura/biblia-em-1-ano/dias/1')
            ->assertRedirect('/login');
    }

    public function test_toggle_rejects_out_of_range_day(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/planos-de-leitura/biblia-em-1-ano/dias/999')
            ->assertNotFound();
    }

    public function test_index_reflects_completed_days_count(): void
    {
        $user = User::factory()->create();
        $plan = ReadingPlan::where('slug', 'biblia-em-1-ano')->firstOrFail();

        ReadingPlanProgress::create([
            'user_id' => $user->id,
            'reading_plan_id' => $plan->id,
            'day_number' => 1,
            'completed_at' => now(),
        ]);
        ReadingPlanProgress::create([
            'user_id' => $user->id,
            'reading_plan_id' => $plan->id,
            'day_number' => 2,
            'completed_at' => now(),
        ]);

        $this->actingAs($user)
            ->get('/planos-de-leitura')
            ->assertInertia(fn ($page) => $page->where('plans.0.completedDays', 2));
    }
}

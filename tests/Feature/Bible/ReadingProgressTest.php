<?php

namespace Tests\Feature\Bible;

use App\Models\Book;
use App\Models\Chapter;
use App\Models\ReadingProgress;
use App\Models\User;
use App\Models\Verse;
use App\Models\Version;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReadingProgressTest extends TestCase
{
    use RefreshDatabase;

    private Version $version;

    private Book $genesis;

    private Chapter $genesisChapter1;

    private Chapter $genesisChapter2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->version = Version::create([
            'code' => 'aa-pt-br',
            'name' => 'Bíblia Ave Maria',
            'language' => 'pt-BR',
            'is_default' => true,
        ]);

        $this->genesis = Book::create([
            'slug' => 'genesis',
            'testament' => 'antigo',
            'category' => 'pentateuco',
            'canonical_order' => 1,
            'abbreviation' => 'Gn',
            'chapter_count' => 2,
        ]);

        $this->genesisChapter1 = Chapter::create([
            'book_id' => $this->genesis->id,
            'version_id' => $this->version->id,
            'number' => 1,
            'verse_count' => 1,
        ]);

        $this->genesisChapter2 = Chapter::create([
            'book_id' => $this->genesis->id,
            'version_id' => $this->version->id,
            'number' => 2,
            'verse_count' => 1,
        ]);

        foreach ([$this->genesisChapter1, $this->genesisChapter2] as $chapter) {
            Verse::create([
                'chapter_id' => $chapter->id,
                'version_id' => $this->version->id,
                'book_id' => $this->genesis->id,
                'number' => 1,
                'text' => 'No princípio...',
                'text_plain' => 'No princípio...',
            ]);
        }
    }

    public function test_visiting_a_chapter_while_authenticated_records_progress(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get("/b/{$this->version->code}/genesis/2")->assertOk();

        $this->assertDatabaseHas('reading_progress', [
            'user_id' => $user->id,
            'version_id' => $this->version->id,
            'chapter_id' => $this->genesisChapter2->id,
        ]);
    }

    public function test_visiting_multiple_chapters_updates_a_single_row_per_version(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get("/b/{$this->version->code}/genesis/1")->assertOk();
        $this->actingAs($user)->get("/b/{$this->version->code}/genesis/2")->assertOk();

        $this->assertSame(1, ReadingProgress::where('user_id', $user->id)->count());
        $this->assertSame(
            $this->genesisChapter2->id,
            ReadingProgress::where('user_id', $user->id)->first()->chapter_id
        );
    }

    public function test_guest_visiting_a_chapter_does_not_record_progress(): void
    {
        $this->get("/b/{$this->version->code}/genesis/1")->assertOk();

        $this->assertDatabaseCount('reading_progress', 0);
    }

    public function test_sync_endpoint_requires_authentication(): void
    {
        $this->post('/leitura/progresso', [
            'version' => $this->version->code,
            'book' => 'genesis',
            'chapter' => 1,
            'updated_at' => now()->toIso8601String(),
        ])->assertRedirect('/login');
    }

    public function test_sync_endpoint_overwrites_only_when_client_position_is_newer(): void
    {
        $user = User::factory()->create();

        ReadingProgress::create([
            'user_id' => $user->id,
            'version_id' => $this->version->id,
            'book_id' => $this->genesis->id,
            'chapter_id' => $this->genesisChapter2->id,
            'updated_at' => now(),
        ]);

        // Client envia uma posição mais antiga: não deve sobrescrever.
        $this->actingAs($user)->post('/leitura/progresso', [
            'version' => $this->version->code,
            'book' => 'genesis',
            'chapter' => 1,
            'updated_at' => now()->subDay()->toIso8601String(),
        ])->assertRedirect();

        $this->assertSame(
            $this->genesisChapter2->id,
            ReadingProgress::where('user_id', $user->id)->first()->chapter_id
        );

        // Client envia uma posição mais recente: deve sobrescrever.
        $this->actingAs($user)->post('/leitura/progresso', [
            'version' => $this->version->code,
            'book' => 'genesis',
            'chapter' => 1,
            'updated_at' => now()->addDay()->toIso8601String(),
        ])->assertRedirect();

        $this->assertSame(
            $this->genesisChapter1->id,
            ReadingProgress::where('user_id', $user->id)->first()->chapter_id
        );
    }

    public function test_book_index_exposes_server_position_when_present(): void
    {
        $user = User::factory()->create();

        ReadingProgress::create([
            'user_id' => $user->id,
            'version_id' => $this->version->id,
            'book_id' => $this->genesis->id,
            'chapter_id' => $this->genesisChapter2->id,
            'updated_at' => now(),
        ]);

        $this->actingAs($user)
            ->get("/b/{$this->version->code}")
            ->assertInertia(fn ($page) => $page
                ->where('serverPosition.bookSlug', 'genesis')
                ->where('serverPosition.chapterNumber', 2)
            );
    }

    public function test_book_index_exposes_null_server_position_for_guests(): void
    {
        $this->get("/b/{$this->version->code}")
            ->assertInertia(fn ($page) => $page->where('serverPosition', null));
    }
}

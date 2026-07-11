<?php

namespace Tests\Feature\Bible;

use App\Models\AiComment;
use App\Models\Book;
use App\Models\Chapter;
use App\Models\User;
use App\Models\Verse;
use App\Models\Version;
use App\Services\AiCommentary\AiCommentaryProviderInterface;
use Database\Seeders\BooksSeeder;
use Database\Seeders\VersionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

class AiCommentaryTest extends TestCase
{
    use RefreshDatabase;

    private Version $version;

    private Book $book;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(BooksSeeder::class);
        $this->seed(VersionsSeeder::class);

        $this->version = Version::firstOrFail();
        $this->book = Book::where('slug', 'genesis')->firstOrFail();

        $chapter = Chapter::create([
            'book_id' => $this->book->id,
            'version_id' => $this->version->id,
            'number' => 1,
            'verse_count' => 1,
        ]);

        Verse::create([
            'chapter_id' => $chapter->id,
            'version_id' => $this->version->id,
            'book_id' => $this->book->id,
            'number' => 1,
            'text' => 'No princípio Deus criou o céu e a terra.',
            'text_plain' => 'No princípio Deus criou o céu e a terra.',
        ]);
    }

    public function test_show_reports_unavailable_when_nothing_is_cached(): void
    {
        $this->getJson("/b/{$this->version->code}/genesis/1/comentario")
            ->assertOk()
            ->assertJson(['available' => false, 'content' => null]);
    }

    public function test_store_generates_and_caches_a_comment(): void
    {
        $this->app->instance(AiCommentaryProviderInterface::class, new FakeCommentaryProvider('Comentário de teste sobre Gênesis 1.'));

        $this->postJson("/b/{$this->version->code}/genesis/1/comentario")
            ->assertOk()
            ->assertJson(['available' => true, 'content' => 'Comentário de teste sobre Gênesis 1.']);

        $this->assertDatabaseHas('ai_comments', [
            'book_id' => $this->book->id,
            'content' => 'Comentário de teste sobre Gênesis 1.',
            'provider' => 'fake',
        ]);
    }

    public function test_store_reuses_cached_comment_without_calling_the_provider_twice(): void
    {
        $provider = new FakeCommentaryProvider('Comentário único.');
        $this->app->instance(AiCommentaryProviderInterface::class, $provider);

        $this->postJson("/b/{$this->version->code}/genesis/1/comentario")->assertOk();
        $this->postJson("/b/{$this->version->code}/genesis/1/comentario")->assertOk();

        $this->assertSame(1, $provider->calls);
        $this->assertSame(1, AiComment::count());
    }

    public function test_show_returns_cached_comment_without_generating(): void
    {
        $provider = new FakeCommentaryProvider('Não deveria ser chamado.');
        $this->app->instance(AiCommentaryProviderInterface::class, $provider);

        AiComment::create([
            'book_id' => $this->book->id,
            'chapter_id' => Chapter::firstOrFail()->id,
            'version_id' => $this->version->id,
            'content' => 'Já gerado antes.',
            'provider' => 'fake',
            'model' => 'fake-model',
        ]);

        $this->getJson("/b/{$this->version->code}/genesis/1/comentario")
            ->assertOk()
            ->assertJson(['available' => true, 'content' => 'Já gerado antes.']);

        $this->assertSame(0, $provider->calls);
    }

    public function test_store_returns_502_when_the_provider_fails(): void
    {
        $this->app->instance(AiCommentaryProviderInterface::class, new FailingCommentaryProvider);

        $this->postJson("/b/{$this->version->code}/genesis/1/comentario")
            ->assertStatus(502);

        $this->assertSame(0, AiComment::count());
    }

    public function test_feedback_requires_authentication(): void
    {
        $comment = $this->createComment();

        $this->postJson("/comentarios-ia/{$comment->id}/feedback", ['rating' => 'up'])
            ->assertUnauthorized();
    }

    public function test_authenticated_user_can_submit_and_change_feedback(): void
    {
        $comment = $this->createComment();
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson("/comentarios-ia/{$comment->id}/feedback", ['rating' => 'up'])
            ->assertOk();

        $this->assertDatabaseHas('ai_comment_feedback', [
            'ai_comment_id' => $comment->id,
            'user_id' => $user->id,
            'rating' => 'up',
        ]);

        $this->actingAs($user)
            ->postJson("/comentarios-ia/{$comment->id}/feedback", ['rating' => 'down'])
            ->assertOk();

        $this->assertSame(1, $comment->feedback()->count());
        $this->assertDatabaseHas('ai_comment_feedback', [
            'ai_comment_id' => $comment->id,
            'user_id' => $user->id,
            'rating' => 'down',
        ]);
    }

    private function createComment(): AiComment
    {
        return AiComment::create([
            'book_id' => $this->book->id,
            'chapter_id' => Chapter::firstOrFail()->id,
            'version_id' => $this->version->id,
            'content' => 'Comentário existente.',
            'provider' => 'fake',
            'model' => 'fake-model',
        ]);
    }
}

class FakeCommentaryProvider implements AiCommentaryProviderInterface
{
    public int $calls = 0;

    public function __construct(private readonly string $response) {}

    public function generate(string $prompt): string
    {
        $this->calls++;

        return $this->response;
    }

    public function identifier(): string
    {
        return 'fake';
    }

    public function model(): string
    {
        return 'fake-model';
    }
}

class FailingCommentaryProvider implements AiCommentaryProviderInterface
{
    public function generate(string $prompt): string
    {
        throw new RuntimeException('Falha simulada do provedor.');
    }

    public function identifier(): string
    {
        return 'fake';
    }

    public function model(): string
    {
        return 'fake-model';
    }
}

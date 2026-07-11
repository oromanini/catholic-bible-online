<?php

namespace Tests\Feature\Bible;

use App\Models\Book;
use App\Models\BookQuote;
use App\Services\AiCommentary\AiCommentaryProviderInterface;
use App\Services\QuoteSearch\QuoteSearchProviderInterface;
use App\Services\QuoteSearch\SearchResult;
use Database\Seeders\BooksSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BookQuoteTest extends TestCase
{
    use RefreshDatabase;

    private Book $book;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(BooksSeeder::class);
        $this->book = Book::where('slug', 'genesis')->firstOrFail();
    }

    public function test_show_reports_unavailable_when_nothing_is_cached(): void
    {
        $this->getJson('/livros/genesis/citacao')
            ->assertOk()
            ->assertJson(['available' => false]);
    }

    public function test_store_finds_verifies_and_caches_a_quote_from_a_trusted_domain(): void
    {
        Http::fake([
            '*newadvent.org/*' => Http::response(
                '<html><body><p>Some intro. Saint Augustine wrote: In the beginning God created heaven and earth, and this is a foundational truth. More text.</p></body></html>'
            ),
        ]);

        $this->app->instance(QuoteSearchProviderInterface::class, new FakeQuoteSearchProvider([
            new SearchResult(
                url: 'https://www.newadvent.org/fathers/example.htm',
                domain: 'www.newadvent.org',
                title: 'Example',
                snippet: 'snippet',
            ),
        ]));

        $this->app->instance(AiCommentaryProviderInterface::class, new FakeExtractionProvider(
            extractionJson: '{"quote":"In the beginning God created heaven and earth, and this is a foundational truth.","author":"Saint Augustine","work":"Example Work"}',
            translation: 'No princípio Deus criou o céu e a terra, e esta é uma verdade fundamental.',
        ));

        $this->postJson('/livros/genesis/citacao')
            ->assertOk()
            ->assertJson([
                'available' => true,
                'author' => 'Saint Augustine',
                'workTitle' => 'Example Work',
                'sourceDomain' => 'www.newadvent.org',
            ]);

        $this->assertDatabaseHas('book_quotes', [
            'book_id' => $this->book->id,
            'author' => 'Saint Augustine',
        ]);
    }

    public function test_results_from_untrusted_domains_are_ignored(): void
    {
        $this->app->instance(QuoteSearchProviderInterface::class, new FakeQuoteSearchProvider([
            new SearchResult(
                url: 'https://random-blog.example.com/post',
                domain: 'random-blog.example.com',
                title: 'Untrusted',
                snippet: 'snippet',
            ),
        ]));

        $this->app->instance(AiCommentaryProviderInterface::class, new FakeExtractionProvider(
            extractionJson: '{"quote":"Deveria ser ignorado","author":"Ninguém"}',
            translation: 'x',
        ));

        $this->postJson('/livros/genesis/citacao')
            ->assertOk()
            ->assertJson(['available' => false]);

        $this->assertSame(0, BookQuote::count());
    }

    public function test_quote_is_rejected_when_not_found_verbatim_on_the_page(): void
    {
        Http::fake([
            '*newadvent.org/*' => Http::response('<html><body><p>Texto totalmente diferente da citação sugerida.</p></body></html>'),
        ]);

        $this->app->instance(QuoteSearchProviderInterface::class, new FakeQuoteSearchProvider([
            new SearchResult(
                url: 'https://www.newadvent.org/fathers/example.htm',
                domain: 'www.newadvent.org',
                title: 'Example',
                snippet: 'snippet',
            ),
        ]));

        $this->app->instance(AiCommentaryProviderInterface::class, new FakeExtractionProvider(
            extractionJson: '{"quote":"Uma frase que não existe na página.","author":"Alguém"}',
            translation: 'x',
        ));

        $this->postJson('/livros/genesis/citacao')
            ->assertOk()
            ->assertJson(['available' => false]);

        $this->assertSame(0, BookQuote::count());
    }

    public function test_store_reuses_the_cached_quote_without_searching_again(): void
    {
        Http::fake([
            '*newadvent.org/*' => Http::response(
                '<html><body><p>Saint Augustine wrote: A verified excerpt about Genesis.</p></body></html>'
            ),
        ]);

        $searchProvider = new FakeQuoteSearchProvider([
            new SearchResult(
                url: 'https://www.newadvent.org/fathers/example.htm',
                domain: 'www.newadvent.org',
                title: 'Example',
                snippet: 'snippet',
            ),
        ]);
        $this->app->instance(QuoteSearchProviderInterface::class, $searchProvider);

        $this->app->instance(AiCommentaryProviderInterface::class, new FakeExtractionProvider(
            extractionJson: '{"quote":"A verified excerpt about Genesis.","author":"Saint Augustine"}',
            translation: 'Um trecho verificado sobre Gênesis.',
        ));

        $this->postJson('/livros/genesis/citacao')->assertOk();
        $this->postJson('/livros/genesis/citacao')->assertOk();

        $this->assertSame(1, $searchProvider->calls);
        $this->assertSame(1, BookQuote::count());
    }
}

class FakeQuoteSearchProvider implements QuoteSearchProviderInterface
{
    public int $calls = 0;

    /**
     * @param  array<int, SearchResult>  $results
     */
    public function __construct(private readonly array $results) {}

    public function search(string $query): array
    {
        $this->calls++;

        return $this->results;
    }
}

class FakeExtractionProvider implements AiCommentaryProviderInterface
{
    public function __construct(
        private readonly string $extractionJson,
        private readonly string $translation,
    ) {}

    public function generate(string $prompt): string
    {
        return str_contains($prompt, 'Traduza o texto') ? $this->translation : $this->extractionJson;
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

import { Head, Link } from '@inertiajs/react';
import SearchBar from '@/components/bible/search-bar';
import bible from '@/routes/bible';
import type { BibleSearchResult, BibleVersion } from '@/types/bible';

type Props = {
    version: BibleVersion;
    versions: BibleVersion[];
    query: string;
    results: BibleSearchResult[];
};

export default function SearchResults({ version, query, results }: Props) {
    return (
        <div className="max-w-3xl">
            <Head title={query ? `Busca: ${query}` : 'Buscar'} />

            <h1 className="mb-4 font-serif text-2xl">Buscar na Bíblia</h1>

            <SearchBar versionCode={version.code} initialQuery={query} />

            {query !== '' && (
                <p className="mt-4 text-sm text-reading-muted">
                    {results.length} resultado{results.length === 1 ? '' : 's'}{' '}
                    para &ldquo;{query}&rdquo;
                </p>
            )}

            <ul className="animate-fade-in mt-6 space-y-4">
                {results.map((result) => (
                    <li
                        key={`${result.book_slug}-${result.chapter}-${result.number}`}
                    >
                        <Link
                            href={bible.read({
                                version: version.code,
                                book: result.book_slug,
                                chapter: result.chapter,
                            })}
                            className="block rounded-lg border border-reading-muted/15 p-4 transition-all hover:border-reading-muted/40 hover:bg-reading-muted/5 active:scale-[0.99]"
                        >
                            <p className="mb-1 text-xs font-medium text-reading-muted">
                                {result.book_name} {result.chapter}:
                                {result.number}
                            </p>
                            <p className="font-serif text-reading-fg">
                                {result.text}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

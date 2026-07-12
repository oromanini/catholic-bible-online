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
        <div className="animate-fade-up mx-auto max-w-[800px]">
            <Head title={query ? `Busca: ${query}` : 'Buscar'} />

            <h1 className="mb-7 text-center font-display text-[38px] font-semibold text-text">
                Buscar na Escritura
            </h1>

            <SearchBar versionCode={version.code} initialQuery={query} />

            {query !== '' && (
                <p className="mt-4 text-sm text-text-muted">
                    {results.length} resultado{results.length === 1 ? '' : 's'}{' '}
                    para &ldquo;{query}&rdquo;
                </p>
            )}

            <ul className="mt-6 space-y-3.5">
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
                            className="block rounded-2xl border border-surface-border bg-surface p-5 transition-all hover:border-accent-gold active:scale-[0.99]"
                        >
                            <p className="mb-2 text-xs font-extrabold tracking-[0.05em] text-accent-gold-text uppercase">
                                {result.book_name} {result.chapter}:
                                {result.number}
                            </p>
                            <p className="font-serif text-base leading-[1.7] text-text">
                                {result.text}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

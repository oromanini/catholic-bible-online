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

            <h1 className="type-display mb-10 text-center text-[clamp(36px,5vw,52px)] text-text">
                Buscar na Escritura
            </h1>

            <SearchBar versionCode={version.code} initialQuery={query} />

            {query !== '' && (
                <p className="mt-5 text-[13px] text-text-faint">
                    {results.length} resultado{results.length === 1 ? '' : 's'}{' '}
                    para &ldquo;{query}&rdquo;
                </p>
            )}

            {/* Resultados como entradas de um índice: separados por filete,
                sem uma caixa em volta de cada um. */}
            <ul className="mt-4">
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
                            className="group block border-b border-rule py-6 transition-colors"
                        >
                            <p className="type-eyebrow mb-2.5 text-text-faint transition-colors group-hover:text-accent-gold-text">
                                {result.book_name} {result.chapter}:
                                {result.number}
                            </p>
                            <p className="max-w-[42em] font-serif text-[16.5px] leading-[1.75] text-text">
                                {result.text}
                            </p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

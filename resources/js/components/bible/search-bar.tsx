import { router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import bible from '@/routes/bible';

type Props = {
    versionCode: string;
    initialQuery?: string;
};

export default function SearchBar({ versionCode, initialQuery = '' }: Props) {
    const [query, setQuery] = useState(initialQuery);

    function handleSubmit(event: FormEvent) {
        event.preventDefault();
        router.get(
            bible.search().url,
            { q: query, version: versionCode },
            { preserveState: true },
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar palavra ou trecho..."
                className="w-full rounded-lg border border-reading-muted/20 bg-reading-bg px-3 py-2 text-sm text-reading-fg transition-colors placeholder:text-reading-muted focus:border-reading-muted/50 focus:outline-none"
            />
            <button
                type="submit"
                className="shrink-0 rounded-lg bg-reading-fg px-4 py-2 text-sm font-medium text-reading-bg transition-all active:scale-95"
            >
                Buscar
            </button>
        </form>
    );
}

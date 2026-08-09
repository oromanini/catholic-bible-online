import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
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
        /*
         * Antes: borda dourada de 1.5px com um halo de 6px em volta — muito
         * ruído para um campo de texto. Agora é um filete só, e o foco é
         * sinalizado escurecendo a borda.
         */
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-card border border-surface-border bg-surface-raised py-2 pr-2 pl-5 transition-colors focus-within:border-accent-gold"
        >
            <Search className="h-4 w-4 shrink-0 text-text-faint" aria-hidden />
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar palavra ou trecho…"
                className="w-full border-none bg-transparent text-[15.5px] text-text placeholder:text-text-faint focus:outline-none"
            />
            <button
                type="submit"
                className="btn btn-ink shrink-0 px-6 py-3 text-[13.5px]"
            >
                Buscar
            </button>
        </form>
    );
}

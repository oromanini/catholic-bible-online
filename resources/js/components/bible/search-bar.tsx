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
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 rounded-full border-[1.5px] border-accent-gold bg-surface py-2 pr-2 pl-[22px] shadow-[0_0_0_6px_var(--accent-gold-soft)]"
        >
            <span className="text-base text-accent-gold-text">⌕</span>
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar palavra ou trecho..."
                className="w-full border-none bg-transparent text-[15.5px] text-text placeholder:text-text-muted focus:outline-none"
            />
            <button
                type="submit"
                className="bg-gold-rose-gradient shrink-0 rounded-full px-[22px] py-3 text-[13.5px] font-extrabold text-white transition-transform [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] active:scale-95"
            >
                Buscar
            </button>
        </form>
    );
}

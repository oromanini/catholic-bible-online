import { Link } from '@inertiajs/react';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/bible/labels';
import bible from '@/routes/bible';
import type { BibleNavTree } from '@/types/bible';

type Props = {
    versionCode: string;
    books: BibleNavTree;
    testament: string;
};

export default function BookTreeNav({ versionCode, books, testament }: Props) {
    const categories = books[testament] ?? {};

    return (
        /*
         * Antes eram 30+ caixas idênticas com borda e sombra: sem hierarquia,
         * tudo gritando no mesmo volume. Aqui a estrutura vem de filetes e
         * ritmo — o índice de um livro bem impresso, não uma grade de cards.
         */
        <div className="space-y-14">
            {CATEGORY_ORDER.filter((category) => categories[category]).map(
                (category) => (
                    <section key={category}>
                        <div className="mb-1 flex items-center gap-4">
                            <h3 className="type-eyebrow shrink-0 text-text-faint">
                                {CATEGORY_LABELS[category]}
                            </h3>
                            <div className="h-px flex-1 bg-rule" />
                            <span className="tabular shrink-0 text-[11px] text-text-faint">
                                {categories[category].length}
                            </span>
                        </div>

                        <div className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
                            {categories[category].map((book) => (
                                <Link
                                    key={book.slug}
                                    href={bible.read({
                                        version: versionCode,
                                        book: book.slug,
                                    })}
                                    className="group relative flex items-baseline justify-between gap-4 border-b border-rule py-3.5 pr-1 pl-4 transition-colors duration-200"
                                >
                                    {/* Marca dourada que cresce no hover: um
                                        sinal discreto no lugar da borda inteira
                                        acendendo. */}
                                    <span
                                        aria-hidden
                                        className="absolute top-1/2 left-0 h-0 w-px -translate-y-1/2 bg-accent-gold transition-all duration-300 ease-out group-hover:h-[62%]"
                                    />
                                    <span className="font-display text-[19px] leading-tight font-medium tracking-[-0.01em] text-text transition-colors duration-200 group-hover:text-accent-gold-text">
                                        {book.name}
                                    </span>
                                    <span className="tabular shrink-0 text-[11.5px] text-text-faint transition-colors duration-200 group-hover:text-text-muted">
                                        {book.chapter_count}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                ),
            )}
        </div>
    );
}

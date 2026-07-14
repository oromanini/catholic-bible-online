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
        <div className="space-y-8">
            {CATEGORY_ORDER.filter((category) => categories[category]).map(
                (category) => (
                    <div key={category}>
                        <h3 className="mb-3.5 text-[12.5px] font-bold tracking-[0.08em] text-text-muted uppercase">
                            {CATEGORY_LABELS[category]}
                        </h3>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                            {categories[category].map((book) => (
                                <Link
                                    key={book.slug}
                                    href={bible.read({
                                        version: versionCode,
                                        book: book.slug,
                                    })}
                                    className="rounded-[14px] border border-surface-border bg-surface p-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-[10px] transition-all duration-250 ease-out hover:-translate-y-1 hover:border-accent-gold hover:shadow-[0_14px_28px_var(--accent-gold-soft)] active:scale-95"
                                >
                                    <div className="font-display text-lg font-semibold text-text">
                                        {book.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}

import { Link } from '@inertiajs/react';
import {
    CATEGORY_LABELS,
    CATEGORY_ORDER,
    TESTAMENT_LABELS,
    TESTAMENT_ORDER,
} from '@/lib/bible/labels';
import bible from '@/routes/bible';
import type { BibleNavTree } from '@/types/bible';

type Props = {
    versionCode: string;
    books: BibleNavTree;
};

export default function BookTreeNav({ versionCode, books }: Props) {
    return (
        <div className="space-y-10">
            {TESTAMENT_ORDER.filter((testament) => books[testament]).map(
                (testament) => (
                    <section key={testament}>
                        <h2 className="mb-4 text-lg font-medium">
                            {TESTAMENT_LABELS[testament]}
                        </h2>

                        <div className="space-y-6">
                            {CATEGORY_ORDER.filter(
                                (category) => books[testament][category],
                            ).map((category) => (
                                <div key={category}>
                                    <h3 className="mb-2 text-sm font-medium text-reading-muted">
                                        {CATEGORY_LABELS[category]}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                        {books[testament][category].map(
                                            (book) => (
                                                <Link
                                                    key={book.slug}
                                                    href={bible.read({
                                                        version: versionCode,
                                                        book: book.slug,
                                                    })}
                                                    className="rounded-lg border border-reading-muted/15 px-3 py-2 text-sm transition-all hover:border-reading-muted/40 hover:bg-reading-muted/5 active:scale-95"
                                                >
                                                    {book.name}
                                                </Link>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ),
            )}
        </div>
    );
}

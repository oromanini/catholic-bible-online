import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef } from 'react';
import BookTreeNav from '@/components/bible/book-tree-nav';
import { useReadingPosition } from '@/hooks/use-reading-position';
import type { ReadingPosition } from '@/hooks/use-reading-position';
import bible from '@/routes/bible';
import type { BibleNavTree, BibleVersion } from '@/types/bible';

type Props = {
    version: BibleVersion;
    versions: BibleVersion[];
    books: BibleNavTree;
    serverPosition: ReadingPosition | null;
};

export default function BookIndex({ version, books, serverPosition }: Props) {
    const localPosition = useReadingPosition();
    const { auth } = usePage().props;
    const synced = useRef(false);

    const position = useMemo(() => {
        if (localPosition && serverPosition) {
            return new Date(localPosition.updatedAt) >=
                new Date(serverPosition.updatedAt)
                ? localPosition
                : serverPosition;
        }

        return localPosition ?? serverPosition;
    }, [localPosition, serverPosition]);

    useEffect(() => {
        if (synced.current || !auth.user || !localPosition) {
            return;
        }

        const localIsNewer =
            !serverPosition ||
            new Date(localPosition.updatedAt) >
                new Date(serverPosition.updatedAt);

        if (localIsNewer && localPosition.versionCode === version.code) {
            synced.current = true;
            router.post(
                bible.progress.store().url,
                {
                    version: localPosition.versionCode,
                    book: localPosition.bookSlug,
                    chapter: localPosition.chapterNumber,
                    updated_at: localPosition.updatedAt,
                },
                { preserveScroll: true, preserveState: true },
            );
        }
    }, [auth.user, localPosition, serverPosition, version.code]);

    return (
        <>
            <Head title={version.name} />

            <div className="mb-8">
                <p className="text-sm text-reading-muted">{version.name}</p>
                <h1 className="mt-1 font-serif text-2xl">
                    Escolha um livro para ler
                </h1>

                {position && position.versionCode === version.code && (
                    <Link
                        href={bible.read({
                            version: position.versionCode,
                            book: position.bookSlug,
                            chapter: position.chapterNumber,
                        })}
                        className="mt-4 inline-flex items-center rounded-lg border border-reading-muted/25 px-4 py-2 text-sm font-medium hover:bg-reading-muted/5"
                    >
                        Continuar em {position.bookName}{' '}
                        {position.chapterNumber}
                    </Link>
                )}
            </div>

            <BookTreeNav versionCode={version.code} books={books} />
        </>
    );
}

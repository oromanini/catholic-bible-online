import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import BookTreeNav from '@/components/bible/book-tree-nav';
import { useReadingPosition } from '@/hooks/use-reading-position';
import type { ReadingPosition } from '@/hooks/use-reading-position';
import {
    CATEGORY_ORDER,
    TESTAMENT_LABELS,
    TESTAMENT_ORDER,
} from '@/lib/bible/labels';
import { cn } from '@/lib/utils';
import bible from '@/routes/bible';
import type { BibleNavTree, BibleVersion } from '@/types/bible';

type Props = {
    version: BibleVersion;
    versions: BibleVersion[];
    books: BibleNavTree;
    serverPosition: ReadingPosition | null;
};

function findChapterCount(books: BibleNavTree, bookSlug: string): number {
    for (const categories of Object.values(books)) {
        for (const list of Object.values(categories)) {
            const found = list.find((book) => book.slug === bookSlug);

            if (found) {
                return found.chapter_count;
            }
        }
    }

    return 1;
}

function findFirstBook(books: BibleNavTree): { slug: string } | null {
    for (const testament of TESTAMENT_ORDER) {
        const categories = books[testament];

        if (!categories) {
            continue;
        }

        for (const category of CATEGORY_ORDER) {
            const list = categories[category];

            if (list?.length) {
                return { slug: list[0].slug };
            }
        }
    }

    return null;
}

export default function BookIndex({ version, books, serverPosition }: Props) {
    const localPosition = useReadingPosition();
    const { auth } = usePage().props;
    const synced = useRef(false);
    const [testament, setTestament] = useState<string>(TESTAMENT_ORDER[0]);

    const position = useMemo(() => {
        if (localPosition && serverPosition) {
            return new Date(localPosition.updatedAt) >=
                new Date(serverPosition.updatedAt)
                ? localPosition
                : serverPosition;
        }

        return localPosition ?? serverPosition;
    }, [localPosition, serverPosition]);

    const activePosition =
        position && position.versionCode === version.code ? position : null;

    const progressPct = activePosition
        ? Math.round(
              (activePosition.chapterNumber /
                  findChapterCount(books, activePosition.bookSlug)) *
                  100,
          )
        : 0;

    const heroHref = activePosition
        ? bible.read({
              version: activePosition.versionCode,
              book: activePosition.bookSlug,
              chapter: activePosition.chapterNumber,
          })
        : (() => {
              const first = findFirstBook(books);

              return first
                  ? bible.read({ version: version.code, book: first.slug })
                  : bible.books(version.code);
          })();

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

            <div className="animate-fade-up mx-auto mb-16 max-w-[760px] text-center">
                {/* Etiqueta sem pílula preenchida: dois filetes e caixa alta
                    com tracking largo pesam muito menos na página. */}
                <div className="mb-8 flex items-center justify-center gap-3">
                    <span className="h-px w-8 bg-accent-gold/50" />
                    <span className="type-eyebrow text-accent-gold-text">
                        Palavra viva, todos os dias
                    </span>
                    <span className="h-px w-8 bg-accent-gold/50" />
                </div>

                <h1 className="type-display mb-7 text-[clamp(44px,7vw,80px)] text-text">
                    A Sagrada Escritura,
                    <br />
                    <em className="font-normal italic">iluminada para você.</em>
                </h1>

                <p className="mx-auto mb-10 max-w-[460px] text-[16px] leading-[1.7] text-text-muted">
                    Leia, medite e aprofunde-se na Bíblia Católica com uma
                    experiência serena, bonita e guiada por comentários.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                    <Link href={heroHref} className="btn btn-ink">
                        Continuar leitura
                    </Link>
                    <Link href={bible.plans.index()} className="btn btn-quiet">
                        Ver planos de leitura
                    </Link>
                </div>
            </div>

            {activePosition && (
                <div className="mb-16 flex flex-wrap items-center gap-6 border-y border-rule py-6">
                    {/* Anel de progresso fino em vez do disco cônico grosso. */}
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                        <svg
                            viewBox="0 0 36 36"
                            className="h-12 w-12 -rotate-90"
                        >
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="var(--rule)"
                                strokeWidth="1.5"
                            />
                            <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="var(--accent-gold)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeDasharray={`${(progressPct / 100) * 100.53} 100.53`}
                            />
                        </svg>
                        <span className="tabular absolute text-[10.5px] font-semibold text-text-muted">
                            {progressPct}%
                        </span>
                    </div>
                    <div className="min-w-[180px] flex-1">
                        <div className="type-eyebrow mb-1.5 text-text-faint">
                            Continuar em
                        </div>
                        <div className="font-display text-[24px] leading-none font-medium tracking-[-0.01em] text-text">
                            {activePosition.bookName}, capítulo{' '}
                            {activePosition.chapterNumber}
                        </div>
                    </div>
                    <Link
                        href={heroHref}
                        className="text-sm font-medium whitespace-nowrap text-accent-gold-text underline-offset-4 hover:underline"
                    >
                        Retomar →
                    </Link>
                </div>
            )}

            {/* Abas com filete embaixo, não pílulas preenchidas. */}
            <div className="mb-10 flex gap-8 border-b border-rule">
                {TESTAMENT_ORDER.filter((t) => books[t]).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTestament(t)}
                        aria-pressed={testament === t}
                        className={cn(
                            'relative -mb-px pb-3.5 text-[14.5px] font-medium transition-colors',
                            testament === t
                                ? 'text-text'
                                : 'text-text-muted hover:text-text',
                        )}
                    >
                        {TESTAMENT_LABELS[t]}
                        {testament === t && (
                            <span className="absolute bottom-0 left-0 h-px w-full bg-accent-gold" />
                        )}
                    </button>
                ))}
            </div>

            <BookTreeNav
                versionCode={version.code}
                books={books}
                testament={testament}
            />
        </>
    );
}

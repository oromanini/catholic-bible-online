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

            <div className="animate-fade-up mx-auto mb-14 max-w-[720px] text-center">
                <div className="mb-[22px] inline-flex items-center gap-2 rounded-full bg-accent-gold-soft px-4 py-1.5 text-[12.5px] font-bold tracking-[0.08em] text-accent-gold-text uppercase">
                    <span className="animate-pulse-soft">✦</span> Palavra viva,
                    todos os dias
                </div>

                <h1 className="mb-[18px] font-display text-[clamp(38px,6vw,68px)] leading-[1.05] font-semibold text-text">
                    A Sagrada Escritura,
                    <br />
                    iluminada para você.
                </h1>

                <p className="mx-auto mb-[30px] max-w-[520px] text-[16.5px] leading-[1.6] text-text-muted">
                    Leia, medite e aprofunde-se na Bíblia Católica com uma
                    experiência serena, bonita e guiada por comentários.
                </p>

                <div className="flex flex-wrap justify-center gap-3.5">
                    <Link
                        href={heroHref}
                        className="bg-gold-rose-gradient rounded-[14px] px-7 py-3.5 text-[15px] font-extrabold text-white shadow-[0_10px_30px_var(--accent-gold-soft)] transition-transform [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] hover:scale-[1.02]"
                    >
                        Continuar leitura →
                    </Link>
                    <Link
                        href={bible.plans.index()}
                        className="rounded-[14px] border border-surface-border bg-surface px-7 py-3.5 text-[15px] font-bold text-text backdrop-blur-[10px]"
                    >
                        Ver planos de leitura
                    </Link>
                </div>
            </div>

            {activePosition && (
                <div className="mb-14 flex flex-wrap items-center gap-[18px] rounded-[20px] border border-surface-border bg-surface p-[22px_26px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-[16px]">
                    <div
                        className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px]"
                        style={{
                            background: `conic-gradient(var(--accent-gold) ${progressPct}%, var(--surface-border) 0)`,
                        }}
                    >
                        <div className="bg-page-solid flex h-[42px] w-[42px] items-center justify-center rounded-[11px] font-display text-[13px] font-bold text-accent-gold-text">
                            {progressPct}%
                        </div>
                    </div>
                    <div className="min-w-[180px] flex-1">
                        <div className="mb-[3px] text-xs font-bold tracking-[0.06em] text-accent-gold-text uppercase">
                            Continuar em
                        </div>
                        <div className="font-display text-[22px] font-semibold text-text">
                            {activePosition.bookName}, capítulo{' '}
                            {activePosition.chapterNumber}
                        </div>
                    </div>
                    <Link
                        href={heroHref}
                        className="rounded-[11px] bg-accent-gold-soft px-5 py-[11px] text-[13.5px] font-bold whitespace-nowrap text-text"
                    >
                        Retomar
                    </Link>
                </div>
            )}

            <div className="mb-6 flex gap-2.5">
                {TESTAMENT_ORDER.filter((t) => books[t]).map((t) => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTestament(t)}
                        className={cn(
                            'rounded-xl px-5 py-2.5 text-sm font-extrabold transition-colors',
                            testament === t
                                ? 'bg-accent-gold-soft text-accent-gold-text'
                                : 'text-text-muted hover:text-text',
                        )}
                    >
                        {TESTAMENT_LABELS[t]}
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

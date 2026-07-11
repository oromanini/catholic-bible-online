import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import bible from '@/routes/bible';
import type { BibleChapterNavigation } from '@/types/bible';

type Props = {
    versionCode: string;
    bookSlug: string;
    chapterNumber: number;
    chapterCount: number;
    navigation: BibleChapterNavigation;
};

export default function ChapterNavigator({
    versionCode,
    bookSlug,
    chapterNumber,
    chapterCount,
    navigation,
}: Props) {
    const chapters = Array.from(
        { length: chapterCount },
        (_, index) => index + 1,
    );

    return (
        <div className="flex items-center justify-between gap-3">
            {navigation.prev ? (
                <Link
                    href={bible.read({
                        version: versionCode,
                        book: navigation.prev.book,
                        chapter: navigation.prev.chapter,
                    })}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-reading-muted transition-all hover:bg-reading-muted/10 hover:text-reading-fg active:scale-95"
                    aria-label="Capítulo anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Link>
            ) : (
                <span />
            )}

            <select
                aria-label="Ir para capítulo"
                value={chapterNumber}
                onChange={(event) =>
                    router.visit(
                        bible.read({
                            version: versionCode,
                            book: bookSlug,
                            chapter: Number(event.target.value),
                        }),
                    )
                }
                className="rounded-lg border border-reading-muted/20 bg-reading-bg px-2 py-1.5 text-sm text-reading-fg"
            >
                {chapters.map((number) => (
                    <option key={number} value={number}>
                        Capítulo {number}
                    </option>
                ))}
            </select>

            {navigation.next ? (
                <Link
                    href={bible.read({
                        version: versionCode,
                        book: navigation.next.book,
                        chapter: navigation.next.chapter,
                    })}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-reading-muted transition-all hover:bg-reading-muted/10 hover:text-reading-fg active:scale-95"
                    aria-label="Próximo capítulo"
                >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                </Link>
            ) : (
                <span />
            )}
        </div>
    );
}

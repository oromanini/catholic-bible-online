import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import bible from '@/routes/bible';

type Props = {
    versionCode: string;
    bookSlug: string;
    bookName: string;
    chapterCount: number;
    currentChapter: number;
};

export default function ChapterGrid({
    versionCode,
    bookSlug,
    bookName,
    chapterCount,
    currentChapter,
}: Props) {
    const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

    return (
        <details open className="rounded-lg border border-reading-muted/15 p-4">
            <summary className="cursor-pointer text-sm font-medium text-reading-muted marker:content-none">
                Capítulos — {bookName}
            </summary>
            <div className="mt-3 grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
                {chapters.map((number) => (
                    <Link
                        key={number}
                        href={bible.read({
                            version: versionCode,
                            book: bookSlug,
                            chapter: number,
                        })}
                        aria-current={
                            number === currentChapter ? 'page' : undefined
                        }
                        className={cn(
                            'flex h-9 items-center justify-center rounded-md text-sm transition-all active:scale-90',
                            number === currentChapter
                                ? 'bg-reading-fg font-medium text-reading-bg'
                                : 'text-reading-muted hover:bg-reading-muted/10 hover:text-reading-fg',
                        )}
                    >
                        {number}
                    </Link>
                ))}
            </div>
        </details>
    );
}

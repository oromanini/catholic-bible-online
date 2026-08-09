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
        <details open className="group">
            <summary className="type-eyebrow mb-4 flex cursor-pointer items-center gap-3 text-text-faint marker:content-none">
                <span className="shrink-0">Capítulos</span>
                <span className="h-px flex-1 bg-rule" />
            </summary>
            <p className="mb-4 font-display text-[17px] leading-tight font-medium text-text-muted">
                {bookName}
            </p>
            <div className="grid grid-cols-8 gap-1 sm:grid-cols-10 lg:grid-cols-5">
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
                            'tabular flex h-8 items-center justify-center rounded-tile text-[12.5px] transition-colors',
                            number === currentChapter
                                ? 'bg-accent-gold font-semibold text-[var(--accent-gold-ink)]'
                                : 'text-text-muted hover:bg-accent-gold-soft hover:text-accent-gold-text',
                        )}
                    >
                        {number}
                    </Link>
                ))}
            </div>
        </details>
    );
}

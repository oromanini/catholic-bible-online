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
        <details
            open
            className="rounded-[18px] border border-surface-border bg-surface p-5 backdrop-blur-[14px]"
        >
            <summary className="cursor-pointer text-xs font-extrabold tracking-[0.06em] text-text-muted uppercase marker:content-none">
                Capítulos — {bookName}
            </summary>
            <div className="mt-3.5 grid grid-cols-8 gap-[7px] sm:grid-cols-10 lg:grid-cols-5">
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
                            'flex h-[34px] items-center justify-center rounded-[9px] text-[13px] font-bold transition-all active:scale-90',
                            number === currentChapter
                                ? 'bg-accent-gold text-[#1a1230]'
                                : 'text-text-muted hover:bg-accent-gold-soft hover:text-text',
                        )}
                    >
                        {number}
                    </Link>
                ))}
            </div>
        </details>
    );
}

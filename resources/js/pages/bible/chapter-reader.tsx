import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AiCommentary from '@/components/bible/ai-commentary';
import BookQuote from '@/components/bible/book-quote';
import ChapterGrid from '@/components/bible/chapter-grid';
import ChapterNavigator from '@/components/bible/chapter-navigator';
import VerseList from '@/components/bible/verse-list';
import { saveReadingPosition } from '@/hooks/use-reading-position';
import bible from '@/routes/bible';
import type {
    BibleChapterNavigation,
    BibleNavTree,
    BibleVerse,
    BibleVersion,
} from '@/types/bible';

type Props = {
    version: BibleVersion;
    book: { slug: string; name: string; chapter_count: number };
    chapter: { number: number };
    verses: BibleVerse[];
    navigation: BibleChapterNavigation;
    books: BibleNavTree;
};

export default function ChapterReader({
    version,
    book,
    chapter,
    verses,
    navigation,
}: Props) {
    useEffect(() => {
        saveReadingPosition({
            versionCode: version.code,
            bookSlug: book.slug,
            bookName: book.name,
            chapterNumber: chapter.number,
        });
    }, [version.code, book.slug, book.name, chapter.number]);

    return (
        <>
            <Head title={`${book.name} ${chapter.number} — ${version.name}`} />

            <div className="lg:grid lg:grid-cols-[1fr_260px] lg:items-start lg:gap-10">
                <div className="max-w-3xl">
                    <Link
                        href={bible.books(version.code)}
                        className="mb-[22px] inline-block text-sm font-bold text-text-muted hover:text-text"
                    >
                        ← Livros
                    </Link>

                    <div className="bg-gold-rose-gradient mb-2 h-[3px] w-[46px] rounded-full" />
                    <h1 className="mb-7 font-display text-[40px] font-semibold text-text">
                        {book.name} {chapter.number}
                    </h1>

                    {chapter.number === 1 && <BookQuote bookSlug={book.slug} />}

                    <div className="mb-8">
                        <ChapterNavigator
                            versionCode={version.code}
                            bookSlug={book.slug}
                            chapterNumber={chapter.number}
                            chapterCount={book.chapter_count}
                            navigation={navigation}
                        />
                    </div>

                    <div className="rounded-[20px] bg-reading-bg p-9 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                        <VerseList verses={verses} />
                    </div>

                    <div className="mt-7">
                        <ChapterNavigator
                            versionCode={version.code}
                            bookSlug={book.slug}
                            chapterNumber={chapter.number}
                            chapterCount={book.chapter_count}
                            navigation={navigation}
                        />
                    </div>

                    <AiCommentary
                        versionCode={version.code}
                        bookSlug={book.slug}
                        chapterNumber={chapter.number}
                    />
                </div>

                <div className="mt-10 lg:sticky lg:top-20 lg:mt-0">
                    <ChapterGrid
                        versionCode={version.code}
                        bookSlug={book.slug}
                        bookName={book.name}
                        chapterCount={book.chapter_count}
                        currentChapter={chapter.number}
                    />
                </div>
            </div>
        </>
    );
}

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

            <div className="lg:grid lg:grid-cols-[1fr_220px] lg:items-start lg:gap-16">
                <div className="min-w-0">
                    <Link
                        href={bible.books(version.code)}
                        className="mb-10 inline-block text-[13px] font-medium text-text-muted transition-colors hover:text-text"
                    >
                        ← Livros
                    </Link>

                    <header className="mb-10">
                        <div className="type-eyebrow mb-3 text-text-faint">
                            {version.name}
                        </div>
                        <h1 className="type-display text-[clamp(38px,5vw,56px)] text-text">
                            {book.name}{' '}
                            <span className="tabular text-accent-gold-text">
                                {chapter.number}
                            </span>
                        </h1>
                    </header>

                    {chapter.number === 1 && <BookQuote bookSlug={book.slug} />}

                    <div className="mb-10">
                        <ChapterNavigator
                            versionCode={version.code}
                            bookSlug={book.slug}
                            chapterNumber={chapter.number}
                            chapterCount={book.chapter_count}
                            navigation={navigation}
                        />
                    </div>

                    {/* Superfície de leitura: borda de 1px e sombra rasa, para
                        sugerir uma folha pousada — não um card flutuando. */}
                    <div className="rounded-panel border border-rule bg-reading-bg px-6 py-10 shadow-soft sm:px-12 sm:py-14">
                        <VerseList verses={verses} />
                    </div>

                    <div className="mt-10">
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

                <div className="mt-14 lg:sticky lg:top-28 lg:mt-0">
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

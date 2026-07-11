export type BibleVersion = {
    code: string;
    name: string;
};

export type BibleNavBook = {
    slug: string;
    name: string;
    abbreviation: string;
    chapter_count: number;
    is_deuterocanonical: boolean;
};

export type BibleNavTree = Record<string, Record<string, BibleNavBook[]>>;

export type BibleVerse = {
    number: number;
    text: string;
};

export type BibleChapterNavigationTarget = {
    book: string;
    chapter: number;
};

export type BibleChapterNavigation = {
    prev: BibleChapterNavigationTarget | null;
    next: BibleChapterNavigationTarget | null;
};

export type BibleSearchResult = {
    book_slug: string;
    book_name: string;
    chapter: number;
    number: number;
    text: string;
};

export type ReadingPlanSummary = {
    slug: string;
    name: string;
    description: string | null;
    durationDays: number;
    completedDays: number;
};

export type ReadingPlanDayReference = {
    bookSlug: string;
    bookName: string;
    chapterStart: number;
    chapterEnd: number;
};

export type ReadingPlanDay = {
    dayNumber: number;
    references: ReadingPlanDayReference[];
    completed: boolean;
};

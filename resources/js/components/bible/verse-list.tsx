import type { BibleVerse } from '@/types/bible';

type Props = {
    verses: BibleVerse[];
};

export default function VerseList({ verses }: Props) {
    return (
        <div className="animate-fade-in font-serif text-lg leading-loose text-reading-fg">
            {verses.map((verse) => (
                <p key={verse.number} className="mb-4">
                    <sup className="mr-1 font-sans text-xs font-medium text-reading-muted select-none">
                        {verse.number}
                    </sup>
                    {verse.text}
                </p>
            ))}
        </div>
    );
}

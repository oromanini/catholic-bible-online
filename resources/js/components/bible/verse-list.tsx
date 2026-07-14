import type { BibleVerse } from '@/types/bible';

type Props = {
    verses: BibleVerse[];
};

export default function VerseList({ verses }: Props) {
    return (
        <div className="animate-fade-in font-serif text-[19px] leading-[1.9] text-reading-fg">
            {verses.map((verse) => (
                <p key={verse.number} className="mb-[18px]">
                    <sup className="mr-1.5 font-sans text-[11px] font-bold text-accent-gold-text select-none">
                        {verse.number}
                    </sup>
                    {verse.text}
                </p>
            ))}
        </div>
    );
}

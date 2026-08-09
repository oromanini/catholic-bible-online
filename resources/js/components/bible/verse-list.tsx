import type { BibleVerse } from '@/types/bible';

type Props = {
    verses: BibleVerse[];
};

export default function VerseList({ verses }: Props) {
    return (
        /*
         * Os números ficam pendurados numa calha à esquerda, como numa Bíblia
         * impressa, em vez de sobrescritos no meio da frase. A margem do texto
         * fica reta e a leitura não é interrompida a cada versículo.
         * `max-w-[38em]` mantém a medida em ~70 caracteres por linha.
         */
        <div className="animate-fade-in mx-auto max-w-[38em] pl-8 font-serif text-[19px] leading-[1.85] text-reading-fg">
            {verses.map((verse) => (
                <p key={verse.number} className="relative mb-[1.15em]">
                    <span className="tabular absolute -left-8 w-6 text-right text-[11px] leading-[2.9] font-semibold text-accent-gold-text/70 select-none">
                        {verse.number}
                    </span>
                    {verse.text}
                </p>
            ))}
        </div>
    );
}

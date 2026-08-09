import { Link, router } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import bible from '@/routes/bible';
import type { ReadingPlanDay } from '@/types/bible';

type Props = {
    planSlug: string;
    versionCode: string;
    day: ReadingPlanDay;
    canTrackProgress: boolean;
};

export default function ReadingPlanDayRow({
    planSlug,
    versionCode,
    day,
    canTrackProgress,
}: Props) {
    // Estado otimista: alterna na hora do clique e só é revertido se o
    // servidor responder com erro (onError abaixo). Não sincroniza com
    // `day.completed` via effect de propósito — este componente é a
    // única fonte de mutação para o seu próprio dia.
    const [completed, setCompleted] = useState(day.completed);
    const first = day.references[0];

    const label = day.references
        .map((ref) =>
            ref.chapterStart === ref.chapterEnd
                ? `${ref.bookName} ${ref.chapterStart}`
                : `${ref.bookName} ${ref.chapterStart}-${ref.chapterEnd}`,
        )
        .join(' · ');

    function toggle() {
        setCompleted((prev) => !prev);

        router.post(
            bible.plans.progress.toggle.url({
                plan: planSlug,
                day: day.dayNumber,
            }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => setCompleted((prev) => !prev),
            },
        );
    }

    return (
        /* Linhas separadas por filete, com o número do dia como numeral
           tabular à esquerda — uma agenda, não uma pilha de caixas. */
        <div className="flex items-center gap-4 border-b border-rule py-3.5">
            <span className="tabular w-7 shrink-0 text-[12px] text-text-faint">
                {String(day.dayNumber).padStart(2, '0')}
            </span>

            {canTrackProgress && (
                <button
                    type="button"
                    onClick={toggle}
                    aria-pressed={completed}
                    aria-label={
                        completed
                            ? `Marcar dia ${day.dayNumber} como pendente`
                            : `Marcar dia ${day.dayNumber} como concluído`
                    }
                    className={cn(
                        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors',
                        completed
                            ? 'border-accent-gold bg-accent-gold text-[var(--accent-gold-ink)]'
                            : 'border-surface-border text-transparent hover:border-accent-gold',
                    )}
                >
                    <Check
                        className={cn(
                            'h-2.5 w-2.5 transition-transform duration-150',
                            completed ? 'scale-100' : 'scale-0',
                        )}
                    />
                </button>
            )}

            {first && (
                <Link
                    href={bible.read({
                        version: versionCode,
                        book: first.bookSlug,
                        chapter: first.chapterStart,
                    })}
                    className={cn(
                        'text-[14.5px] transition-colors hover:text-accent-gold-text',
                        completed ? 'text-text-faint' : 'text-text',
                    )}
                >
                    {label}
                </Link>
            )}
        </div>
    );
}

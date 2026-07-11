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
        <div
            className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors',
                completed
                    ? 'border-reading-muted/10 bg-reading-muted/5'
                    : 'border-reading-muted/15',
            )}
        >
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
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all active:scale-90',
                        completed
                            ? 'border-reading-fg bg-reading-fg text-reading-bg'
                            : 'border-reading-muted/30 text-transparent',
                    )}
                >
                    <Check
                        className={cn(
                            'h-3.5 w-3.5 transition-transform duration-150',
                            completed ? 'scale-100' : 'scale-0',
                        )}
                    />
                </button>
            )}

            <div>
                <p className="text-xs text-reading-muted">
                    Dia {day.dayNumber}
                </p>
                {first && (
                    <Link
                        href={bible.read({
                            version: versionCode,
                            book: first.bookSlug,
                            chapter: first.chapterStart,
                        })}
                        className={cn(
                            'text-sm transition-colors hover:underline',
                            completed && 'text-reading-muted line-through',
                        )}
                    >
                        {label}
                    </Link>
                )}
            </div>
        </div>
    );
}

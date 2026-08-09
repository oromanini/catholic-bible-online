import { Head, usePage } from '@inertiajs/react';
import ReadingPlanDayRow from '@/components/bible/reading-plan-day-row';
import type { BibleVersion, ReadingPlanDay } from '@/types/bible';

type Props = {
    version: BibleVersion;
    plan: {
        slug: string;
        name: string;
        description: string | null;
        durationDays: number;
    };
    days: ReadingPlanDay[];
};

export default function ReadingPlanShow({ version, plan, days }: Props) {
    const { auth } = usePage().props;
    const completedCount = days.filter((day) => day.completed).length;

    return (
        <div className="animate-fade-up mx-auto max-w-[800px]">
            <Head title={plan.name} />

            <div className="mb-14 text-center">
                <p className="type-eyebrow text-text-faint">Plano de leitura</p>
                <h1 className="type-display mt-4 text-[clamp(36px,5vw,52px)] text-text">
                    {plan.name}
                </h1>
                {plan.description && (
                    <p className="mx-auto mt-4 max-w-[440px] text-[15px] leading-[1.7] text-text-muted">
                        {plan.description}
                    </p>
                )}

                {auth.user ? (
                    <p className="tabular mt-6 text-[13px] text-accent-gold-text">
                        {completedCount} de {plan.durationDays} dias concluídos
                    </p>
                ) : (
                    <p className="mt-6 text-[13px] text-text-faint">
                        Entre na sua conta para acompanhar seu progresso dia a
                        dia.
                    </p>
                )}
            </div>

            <div>
                {days.map((day) => (
                    <ReadingPlanDayRow
                        key={day.dayNumber}
                        planSlug={plan.slug}
                        versionCode={version.code}
                        day={day}
                        canTrackProgress={!!auth.user}
                    />
                ))}
            </div>
        </div>
    );
}

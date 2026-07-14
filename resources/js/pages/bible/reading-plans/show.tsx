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

            <div className="mb-8 text-center">
                <p className="text-sm text-text-muted">Plano de leitura</p>
                <h1 className="mt-1 font-display text-[38px] font-semibold text-text">
                    {plan.name}
                </h1>
                {plan.description && (
                    <p className="mt-2 text-sm text-text-muted">
                        {plan.description}
                    </p>
                )}

                {auth.user ? (
                    <p className="mt-4 text-sm font-bold text-accent-gold-text">
                        {completedCount} de {plan.durationDays} dias concluídos
                    </p>
                ) : (
                    <p className="mt-4 text-sm text-text-muted">
                        Entre na sua conta para acompanhar seu progresso dia a
                        dia.
                    </p>
                )}
            </div>

            <div className="space-y-2">
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

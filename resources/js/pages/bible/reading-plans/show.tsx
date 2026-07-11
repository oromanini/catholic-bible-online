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
        <>
            <Head title={plan.name} />

            <div className="mb-6">
                <p className="text-sm text-reading-muted">Plano de leitura</p>
                <h1 className="mt-1 font-serif text-2xl">{plan.name}</h1>
                {plan.description && (
                    <p className="mt-2 text-sm text-reading-muted">
                        {plan.description}
                    </p>
                )}

                {auth.user ? (
                    <p className="mt-4 text-sm">
                        {completedCount} de {plan.durationDays} dias concluídos
                    </p>
                ) : (
                    <p className="mt-4 text-sm text-reading-muted">
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
        </>
    );
}

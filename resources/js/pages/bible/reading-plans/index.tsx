import { Head, Link } from '@inertiajs/react';
import bible from '@/routes/bible';
import type { ReadingPlanSummary } from '@/types/bible';

type Props = {
    plans: ReadingPlanSummary[];
};

export default function ReadingPlansIndex({ plans }: Props) {
    return (
        <>
            <Head title="Planos de leitura" />

            <h1 className="mb-6 font-serif text-2xl">Planos de leitura</h1>

            <div className="space-y-3">
                {plans.map((plan) => (
                    <Link
                        key={plan.slug}
                        href={bible.plans.show(plan.slug)}
                        className="block rounded-lg border border-reading-muted/15 p-4 hover:border-reading-muted/40 hover:bg-reading-muted/5"
                    >
                        <p className="font-serif text-lg">{plan.name}</p>
                        {plan.description && (
                            <p className="mt-1 text-sm text-reading-muted">
                                {plan.description}
                            </p>
                        )}
                        <p className="mt-2 text-xs text-reading-muted">
                            {plan.completedDays} de {plan.durationDays} dias
                            concluídos
                        </p>
                    </Link>
                ))}

                {plans.length === 0 && (
                    <p className="text-sm text-reading-muted">
                        Nenhum plano de leitura disponível no momento.
                    </p>
                )}
            </div>
        </>
    );
}

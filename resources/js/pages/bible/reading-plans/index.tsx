import { Head, Link } from '@inertiajs/react';
import bible from '@/routes/bible';
import type { ReadingPlanSummary } from '@/types/bible';

type Props = {
    plans: ReadingPlanSummary[];
};

export default function ReadingPlansIndex({ plans }: Props) {
    return (
        <div className="animate-fade-up mx-auto max-w-[1000px]">
            <Head title="Planos de leitura" />

            <h1 className="type-display mb-4 text-center text-[clamp(36px,5vw,52px)] text-text">
                Planos de leitura
            </h1>
            <p className="mx-auto mb-16 max-w-[420px] text-center text-[15px] leading-[1.7] text-text-muted">
                Caminhos guiados para aprofundar sua fé, dia após dia.
            </p>

            <div className="grid gap-x-12 sm:grid-cols-2">
                {plans.map((plan) => {
                    const pct =
                        plan.durationDays > 0
                            ? Math.round(
                                  (plan.completedDays / plan.durationDays) *
                                      100,
                              )
                            : 0;

                    return (
                        <Link
                            key={plan.slug}
                            href={bible.plans.show(plan.slug)}
                            className="group border-b border-rule py-7 transition-colors"
                        >
                            <div className="mb-3 flex items-baseline justify-between gap-4">
                                <h2 className="font-display text-[24px] leading-tight font-medium tracking-[-0.01em] text-text transition-colors group-hover:text-accent-gold-text">
                                    {plan.name}
                                </h2>
                                <span className="tabular shrink-0 text-[11.5px] text-text-faint">
                                    {plan.durationDays} dias
                                </span>
                            </div>

                            {plan.description && (
                                <p className="mb-5 max-w-[38em] text-[14px] leading-[1.65] text-text-muted">
                                    {plan.description}
                                </p>
                            )}

                            {/* Barra de progresso de 2px: informa o mesmo que o
                                disco cônico anterior ocupando muito menos. */}
                            <div className="flex items-center gap-3">
                                <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-rule">
                                    <div
                                        className="h-full rounded-full bg-accent-gold transition-[width] duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="tabular w-9 shrink-0 text-right text-[11.5px] text-text-faint">
                                    {pct}%
                                </span>
                            </div>
                        </Link>
                    );
                })}

                {plans.length === 0 && (
                    <p className="text-sm text-text-muted">
                        Nenhum plano de leitura disponível no momento.
                    </p>
                )}
            </div>
        </div>
    );
}

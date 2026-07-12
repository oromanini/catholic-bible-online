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

            <h1 className="mb-2 text-center font-display text-[38px] font-semibold text-text">
                Planos de leitura
            </h1>
            <p className="mb-10 text-center text-[15px] text-text-muted">
                Caminhos guiados para aprofundar sua fé, dia após dia.
            </p>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
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
                            className="rounded-[20px] border border-surface-border bg-surface p-[26px] backdrop-blur-[14px] transition-all hover:border-accent-gold hover:shadow-[0_14px_28px_var(--accent-gold-soft)]"
                        >
                            <div className="mb-[18px] flex items-center gap-4">
                                <div
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background: `conic-gradient(var(--accent-gold) ${pct}%, var(--surface-border) 0)`,
                                    }}
                                >
                                    <div className="bg-page-solid flex h-11 w-11 items-center justify-center rounded-full text-[12.5px] font-extrabold text-accent-gold-text">
                                        {pct}%
                                    </div>
                                </div>
                                <div>
                                    <div className="font-display text-xl font-semibold text-text">
                                        {plan.name}
                                    </div>
                                    <div className="text-[12.5px] text-text-muted">
                                        {plan.durationDays} dias
                                    </div>
                                </div>
                            </div>
                            {plan.description && (
                                <p className="mb-4 text-sm text-text-muted">
                                    {plan.description}
                                </p>
                            )}
                            <span className="block w-full rounded-[11px] bg-accent-gold-soft py-[11px] text-center text-[13.5px] font-extrabold text-text">
                                Continuar plano
                            </span>
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

import { Link, usePage } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import bible from '@/routes/bible';

type Props = {
    versionCode?: string;
};

export type BibleNavItem = {
    label: string;
    href: ComponentProps<typeof Link>['href'];
    active: boolean;
};

export function useBibleNavItems(versionCode?: string): BibleNavItem[] {
    const { component } = usePage();
    const homeHref = versionCode ? bible.books(versionCode) : '/';

    return [
        {
            label: 'Início',
            href: homeHref,
            active: component === 'bible/book-index',
        },
        {
            label: 'Ler',
            href: homeHref,
            active: component === 'bible/chapter-reader',
        },
        {
            label: 'Buscar',
            href: bible.search(),
            active: component === 'bible/search-results',
        },
        {
            label: 'Planos',
            href: bible.plans.index(),
            active: component.startsWith('bible/reading-plans'),
        },
    ];
}

export default function BibleNav({ versionCode }: Props) {
    const items = useBibleNavItems(versionCode);

    return (
        <div className="flex items-center gap-7">
            {items.map(({ label, href, active }) => (
                <Link
                    key={label}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                        'relative py-1 text-[14px] font-medium whitespace-nowrap transition-colors',
                        active
                            ? 'text-text'
                            : 'text-text-muted hover:text-text',
                    )}
                >
                    {label}
                    {/* Um filete dourado marca a página atual melhor que uma
                        pílula com gradiente — não compete com o conteúdo. */}
                    {active && (
                        <span className="absolute -bottom-px left-0 h-px w-full bg-accent-gold" />
                    )}
                </Link>
            ))}
        </div>
    );
}

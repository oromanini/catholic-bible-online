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
        <div className="flex items-center gap-1">
            {items.map(({ label, href, active }) => (
                <Link
                    key={label}
                    href={href}
                    className={cn(
                        'rounded-full px-4 py-2 text-[13.5px] font-bold whitespace-nowrap transition-all',
                        active
                            ? 'bg-gold-rose-gradient text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]'
                            : 'text-text-muted hover:text-text',
                    )}
                >
                    {label}
                </Link>
            ))}
        </div>
    );
}

import { Coffee, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { ReadingTheme } from '@/hooks/use-reading-theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { cn } from '@/lib/utils';

const ORDER: ReadingTheme[] = ['light', 'sepia', 'dark'];

const ICONS: Record<ReadingTheme, LucideIcon> = {
    light: Sun,
    sepia: Coffee,
    dark: Moon,
};

const LABELS: Record<ReadingTheme, string> = {
    light: 'Claro',
    sepia: 'Sépia',
    dark: 'Escuro',
};

export default function ReadingThemeToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLButtonElement>) {
    const { theme, updateTheme } = useReadingTheme();
    const Icon = ICONS[theme];
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

    return (
        <button
            type="button"
            onClick={() => updateTheme(next)}
            aria-label={`Tema ${LABELS[theme]} — trocar para ${LABELS[next]}`}
            className={cn(
                'flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-accent-gold-soft text-accent-gold-text transition-transform active:scale-90',
                className,
            )}
            {...props}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}

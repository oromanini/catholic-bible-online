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
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-tile text-text-muted transition-colors hover:bg-accent-gold-soft hover:text-accent-gold-text',
                className,
            )}
            {...props}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}

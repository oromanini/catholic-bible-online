import { Coffee, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { ReadingTheme } from '@/hooks/use-reading-theme';
import { useReadingTheme } from '@/hooks/use-reading-theme';
import { cn } from '@/lib/utils';

export default function ReadingThemeToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { theme, updateTheme } = useReadingTheme();

    const options: { value: ReadingTheme; icon: LucideIcon; label: string }[] =
        [
            { value: 'light', icon: Sun, label: 'Claro' },
            { value: 'sepia', icon: Coffee, label: 'Sépia' },
            { value: 'dark', icon: Moon, label: 'Escuro' },
        ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            {...props}
        >
            {options.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    type="button"
                    aria-label={`Tema de leitura ${label}`}
                    aria-pressed={theme === value}
                    onClick={() => updateTheme(value)}
                    className={cn(
                        'flex items-center rounded-md px-2.5 py-1.5 transition-all active:scale-90',
                        theme === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <Icon className="h-4 w-4" />
                </button>
            ))}
        </div>
    );
}

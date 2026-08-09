import type { HTMLAttributes } from 'react';
import { useTypeface } from '@/hooks/use-typeface';
import { cn } from '@/lib/utils';

export default function TypefaceToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLButtonElement>) {
    const { typeface, toggleTypeface } = useTypeface();

    return (
        <button
            type="button"
            onClick={toggleTypeface}
            aria-label={
                typeface === 'serif'
                    ? 'Alternar para fonte sem serifa'
                    : 'Alternar para fonte serifada'
            }
            className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-tile font-serif text-[14px] font-medium text-text-muted transition-colors hover:bg-accent-gold-soft hover:text-accent-gold-text',
                className,
            )}
            {...props}
        >
            {/* "Aa" desenhado na própria fonte de leitura ativa: o botão
                mostra o estado sem precisar de rótulo. */}
            Aa
        </button>
    );
}

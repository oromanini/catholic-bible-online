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
                'flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-accent-gold-soft font-display text-[12px] font-extrabold text-accent-gold-text',
                className,
            )}
            {...props}
        >
            {typeface === 'serif' ? 'Aa' : 'Sans'}
        </button>
    );
}

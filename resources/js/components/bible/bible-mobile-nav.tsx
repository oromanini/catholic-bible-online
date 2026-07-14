import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useBibleNavItems } from '@/components/bible/bible-nav';
import BibleUserMenu from '@/components/bible/bible-user-menu';
import ReadingThemeToggle from '@/components/bible/reading-theme-toggle';
import TypefaceToggle from '@/components/bible/typeface-toggle';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type Props = {
    versionCode?: string;
};

export default function BibleMobileNav({ versionCode }: Props) {
    const [open, setOpen] = useState(false);
    const items = useBibleNavItems(versionCode);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    aria-label="Abrir menu"
                    className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-accent-gold-soft text-accent-gold-text sm:hidden"
                >
                    <Menu className="h-[18px] w-[18px]" />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="bg-page w-[280px] gap-0 border-surface-border p-0 text-text sm:hidden"
            >
                <SheetTitle className="sr-only">Menu</SheetTitle>

                <nav className="flex flex-col gap-1 p-5 pt-16">
                    {items.map(({ label, href, active }) => (
                        <SheetClose asChild key={label}>
                            <Link
                                href={href}
                                className={cn(
                                    'rounded-xl px-4 py-3 text-[15px] font-bold transition-colors',
                                    active
                                        ? 'bg-gold-rose-gradient text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]'
                                        : 'text-text hover:bg-surface',
                                )}
                            >
                                {label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>

                <div className="mt-auto flex items-center gap-2 border-t border-surface-border p-5">
                    <TypefaceToggle />
                    <ReadingThemeToggle />
                </div>

                <div className="border-t border-surface-border p-5">
                    <BibleUserMenu />
                </div>
            </SheetContent>
        </Sheet>
    );
}

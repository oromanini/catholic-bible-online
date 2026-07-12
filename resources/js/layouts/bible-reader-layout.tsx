import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import BibleMobileNav from '@/components/bible/bible-mobile-nav';
import BibleNav from '@/components/bible/bible-nav';
import BibleUserMenu from '@/components/bible/bible-user-menu';
import FloatingOrbs from '@/components/bible/floating-orbs';
import ReadingThemeToggle from '@/components/bible/reading-theme-toggle';
import TypefaceToggle from '@/components/bible/typeface-toggle';
import bible from '@/routes/bible';

type SharedBibleProps = {
    version?: { code: string; name: string };
};

export default function BibleReaderLayout({ children }: PropsWithChildren) {
    const { props, component } = usePage<SharedBibleProps>();
    const versionCode = props.version?.code;
    const isReader = component === 'bible/chapter-reader';

    return (
        <div className="bg-page relative min-h-screen w-full text-text">
            <FloatingOrbs intensity={isReader ? 'subtle' : 'vivid'} />

            <div className="sticky top-0 z-20 flex justify-center px-5 pt-[18px]">
                <div className="flex max-w-full items-center gap-1.5 rounded-full border border-surface-border bg-[var(--nav-bg)] py-2 pr-2.5 pl-4.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-[18px]">
                    <Link
                        href={versionCode ? bible.books(versionCode) : '/'}
                        className="mr-3.5 flex shrink-0 items-center gap-2 whitespace-nowrap"
                    >
                        <span className="font-display text-[19px] font-semibold text-accent-gold-text">
                            ✝
                        </span>
                        <span className="font-display text-[19px] font-semibold text-text">
                            Bíblia Católica
                        </span>
                    </Link>

                    <div className="hidden items-center gap-1.5 sm:flex">
                        <BibleNav versionCode={versionCode} />

                        <div className="ml-2 flex shrink-0 items-center gap-1">
                            <TypefaceToggle />
                            <ReadingThemeToggle />
                            <BibleUserMenu />
                        </div>
                    </div>

                    <BibleMobileNav versionCode={versionCode} />
                </div>
            </div>

            <main className="relative z-[5] mx-auto max-w-5xl px-4 py-6">
                {children}
            </main>
        </div>
    );
}

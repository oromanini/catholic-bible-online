import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import BibleMobileNav from '@/components/bible/bible-mobile-nav';
import BibleNav from '@/components/bible/bible-nav';
import BibleUserMenu from '@/components/bible/bible-user-menu';
import PageAtmosphere from '@/components/bible/page-atmosphere';
import ReadingThemeToggle from '@/components/bible/reading-theme-toggle';
import TypefaceToggle from '@/components/bible/typeface-toggle';
import bible from '@/routes/bible';

type SharedBibleProps = {
    version?: { code: string; name: string };
};

export default function BibleReaderLayout({ children }: PropsWithChildren) {
    const { props } = usePage<SharedBibleProps>();
    const versionCode = props.version?.code;

    return (
        <div className="relative min-h-screen w-full bg-page text-text">
            <PageAtmosphere />

            {/*
             * Antes: uma "pílula" flutuante com sombra pesada e tudo espremido.
             * Agora: uma barra de largura total assentada num filete de 1px —
             * mais silenciosa e devolve a atenção ao conteúdo.
             */}
            <header className="sticky top-0 z-20 border-b border-rule bg-[var(--nav-bg)] backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8">
                    <Link
                        href={versionCode ? bible.books(versionCode) : '/'}
                        className="flex shrink-0 items-center gap-2.5 whitespace-nowrap"
                    >
                        <svg
                            viewBox="0 0 16 20"
                            className="h-[18px] w-[14px] text-accent-gold"
                            fill="currentColor"
                            aria-hidden
                        >
                            <path d="M6.9 0h2.2v5.4H16v2.2H9.1V20H6.9V7.6H0V5.4h6.9V0Z" />
                        </svg>
                        <span className="font-display text-[21px] leading-none font-medium tracking-[-0.01em] text-text">
                            Bíblia Católica
                        </span>
                    </Link>

                    <div className="ml-auto hidden items-center gap-5 sm:flex">
                        <BibleNav versionCode={versionCode} />

                        <div className="flex shrink-0 items-center gap-1.5 border-l border-rule pl-5">
                            <TypefaceToggle />
                            <ReadingThemeToggle />
                            <BibleUserMenu />
                        </div>
                    </div>

                    <BibleMobileNav versionCode={versionCode} />
                </div>
            </header>

            <main className="relative z-[5] mx-auto max-w-6xl px-5 py-16 sm:px-8">
                {children}
            </main>
        </div>
    );
}

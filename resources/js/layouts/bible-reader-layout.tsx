import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ListChecks, Search } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import BibleUserMenu from '@/components/bible/bible-user-menu';
import ReadingThemeToggle from '@/components/bible/reading-theme-toggle';
import bible from '@/routes/bible';

type SharedBibleProps = {
    version?: { code: string; name: string };
};

export default function BibleReaderLayout({ children }: PropsWithChildren) {
    const { props } = usePage<SharedBibleProps>();
    const versionCode = props.version?.code;

    return (
        <div className="min-h-screen bg-reading-bg text-reading-fg">
            <header className="sticky top-0 z-10 border-b border-reading-muted/15 bg-reading-bg/95 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
                    <Link
                        href={versionCode ? bible.books(versionCode) : '/'}
                        className="flex items-center gap-2 text-sm font-medium"
                    >
                        <BookOpen className="h-4 w-4" aria-hidden />
                        <span>Bíblia Católica</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href={bible.plans.index()}
                            aria-label="Planos de leitura"
                            className="rounded-lg p-2 text-reading-muted transition-colors hover:bg-reading-muted/10 hover:text-reading-fg"
                        >
                            <ListChecks className="h-4 w-4" />
                        </Link>
                        <Link
                            href={bible.search()}
                            aria-label="Buscar na Bíblia"
                            className="rounded-lg p-2 text-reading-muted transition-colors hover:bg-reading-muted/10 hover:text-reading-fg"
                        >
                            <Search className="h-4 w-4" />
                        </Link>
                        <ReadingThemeToggle />
                        <BibleUserMenu />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        </div>
    );
}

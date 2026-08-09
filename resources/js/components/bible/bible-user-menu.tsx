import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { login, register } from '@/routes';

export default function BibleUserMenu() {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    if (!auth.user) {
        return (
            <div className="ml-1 flex items-center gap-4 text-[14px] whitespace-nowrap">
                <Link
                    href={login()}
                    className="font-medium text-text-muted transition-colors hover:text-text"
                >
                    Entrar
                </Link>
                <Link
                    href={register()}
                    className="rounded-tile border border-surface-border px-3.5 py-2 font-medium text-text transition-colors hover:border-accent-gold hover:text-accent-gold-text"
                >
                    Criar conta
                </Link>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Menu do usuário"
                    className="rounded-full"
                >
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        <AvatarImage
                            src={auth.user.avatar}
                            alt={auth.user.name}
                        />
                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

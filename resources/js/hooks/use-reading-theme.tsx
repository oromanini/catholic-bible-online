import { useSyncExternalStore } from 'react';

export type ReadingTheme = 'light' | 'dark' | 'sepia';

const STORAGE_KEY = 'reading-theme';
const DEFAULT_THEME: ReadingTheme = 'light';

const listeners = new Set<() => void>();
let currentTheme: ReadingTheme = DEFAULT_THEME;

const isReadingTheme = (value: string | null): value is ReadingTheme =>
    value === 'light' || value === 'dark' || value === 'sepia';

const getStoredTheme = (): ReadingTheme => {
    if (typeof window === 'undefined') {
        return DEFAULT_THEME;
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    return isReadingTheme(stored) ? stored : DEFAULT_THEME;
};

const applyTheme = (theme: ReadingTheme): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.setAttribute('data-reading-theme', theme);
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeReadingTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentTheme = getStoredTheme();
    applyTheme(currentTheme);
}

export function useReadingTheme() {
    const theme = useSyncExternalStore(
        subscribe,
        () => currentTheme,
        () => DEFAULT_THEME,
    );

    const updateTheme = (theme: ReadingTheme): void => {
        currentTheme = theme;
        localStorage.setItem(STORAGE_KEY, theme);
        applyTheme(theme);
        notify();
    };

    return { theme, updateTheme } as const;
}

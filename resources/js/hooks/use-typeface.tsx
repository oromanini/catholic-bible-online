import { useSyncExternalStore } from 'react';

export type Typeface = 'serif' | 'sans';

const STORAGE_KEY = 'typeface';
const DEFAULT_TYPEFACE: Typeface = 'serif';

const listeners = new Set<() => void>();
let currentTypeface: Typeface = DEFAULT_TYPEFACE;

const isTypeface = (value: string | null): value is Typeface =>
    value === 'serif' || value === 'sans';

const getStoredTypeface = (): Typeface => {
    if (typeof window === 'undefined') {
        return DEFAULT_TYPEFACE;
    }

    const stored = localStorage.getItem(STORAGE_KEY);

    return isTypeface(stored) ? stored : DEFAULT_TYPEFACE;
};

const applyTypeface = (typeface: Typeface): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.setAttribute('data-typeface', typeface);
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeTypeface(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentTypeface = getStoredTypeface();
    applyTypeface(currentTypeface);
}

export function useTypeface() {
    const typeface = useSyncExternalStore(
        subscribe,
        () => currentTypeface,
        () => DEFAULT_TYPEFACE,
    );

    const updateTypeface = (typeface: Typeface): void => {
        currentTypeface = typeface;
        localStorage.setItem(STORAGE_KEY, typeface);
        applyTypeface(typeface);
        notify();
    };

    const toggleTypeface = (): void => {
        updateTypeface(currentTypeface === 'serif' ? 'sans' : 'serif');
    };

    return { typeface, updateTypeface, toggleTypeface } as const;
}

import { useSyncExternalStore } from 'react';

export type ReadingPosition = {
    versionCode: string;
    bookSlug: string;
    bookName: string;
    chapterNumber: number;
    updatedAt: string;
};

const STORAGE_KEY = 'reading-position';

// useSyncExternalStore exige que getSnapshot retorne a MESMA referência
// enquanto os dados não mudarem — caso contrário React entra em loop
// infinito de re-render (visto como tela travada/preta). Por isso
// cacheamos o valor já parseado e só criamos um objeto novo quando o
// texto bruto do localStorage muda de fato.
let cachedRaw: string | null = null;
let cachedPosition: ReadingPosition | null = null;

function readFromStorage(): ReadingPosition | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === cachedRaw) {
        return cachedPosition;
    }

    cachedRaw = raw;

    if (!raw) {
        cachedPosition = null;

        return cachedPosition;
    }

    try {
        cachedPosition = JSON.parse(raw) as ReadingPosition;
    } catch {
        cachedPosition = null;
    }

    return cachedPosition;
}

export function getReadingPosition(): ReadingPosition | null {
    return readFromStorage();
}

export function saveReadingPosition(
    position: Omit<ReadingPosition, 'updatedAt'>,
): void {
    if (typeof window === 'undefined') {
        return;
    }

    const value: ReadingPosition = {
        ...position,
        updatedAt: new Date().toISOString(),
    };
    const raw = JSON.stringify(value);

    localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedPosition = value;
}

const noopSubscribe = () => () => {};

/**
 * Lê a posição salva de forma segura para SSR (getServerSnapshot retorna
 * null, já que localStorage não existe no servidor).
 */
export function useReadingPosition(): ReadingPosition | null {
    return useSyncExternalStore(noopSubscribe, readFromStorage, () => null);
}

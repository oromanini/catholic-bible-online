function readCsrfTokenFromCookie(): string | null {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);

    return match ? decodeURIComponent(match[1]) : null;
}

/**
 * fetch() com CSRF configurado para os endpoints JSON internos (fora do
 * roteamento de páginas do Inertia, ex: widgets que não devem disparar
 * uma navegação/troca de página inteira).
 */
export async function apiFetch<T>(
    url: string,
    options: RequestInit = {},
): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set('Accept', 'application/json');

    const method = (options.method ?? 'GET').toUpperCase();

    if (method !== 'GET') {
        headers.set('Content-Type', 'application/json');

        const token = readCsrfTokenFromCookie();

        if (token) {
            headers.set('X-XSRF-TOKEN', token);
        }
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error(`Requisição falhou: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

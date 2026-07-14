import { Loader2, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-fetch';
import bible from '@/routes/bible';

type Props = {
    bookSlug: string;
};

type QuoteResponse = {
    available: boolean;
    author?: string;
    workTitle?: string | null;
    quoteOriginal?: string;
    quoteTranslated?: string | null;
    sourceUrl?: string;
    sourceDomain?: string;
};

type Status = 'checking' | 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export default function BookQuote({ bookSlug }: Props) {
    const [status, setStatus] = useState<Status>('checking');
    const [quote, setQuote] = useState<QuoteResponse | null>(null);

    useEffect(() => {
        apiFetch<QuoteResponse>(bible.quotes.show.url(bookSlug))
            .then((data) => {
                if (data.available) {
                    setQuote(data);
                    setStatus('ready');
                } else {
                    setStatus('idle');
                }
            })
            .catch(() => setStatus('idle'));
    }, [bookSlug]);

    async function search() {
        setStatus('loading');

        try {
            const data = await apiFetch<QuoteResponse>(
                bible.quotes.store.url(bookSlug),
                { method: 'POST' },
            );

            if (data.available) {
                setQuote(data);
                setStatus('ready');
            } else {
                setStatus('empty');
            }
        } catch {
            setStatus('error');
        }
    }

    if (status === 'checking') {
        return null;
    }

    return (
        <div className="mb-8 rounded-[20px] border border-surface-border bg-surface p-6 backdrop-blur-[14px]">
            <div className="mb-3.5 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.05em] text-accent-gold-text uppercase">
                <Quote className="h-4 w-4" aria-hidden />
                Padres da Igreja
            </div>

            {status === 'idle' && (
                <button
                    type="button"
                    onClick={search}
                    className="rounded-xl border border-surface-border px-4 py-2 text-sm font-bold text-text transition-all hover:bg-accent-gold-soft active:scale-95"
                >
                    Buscar citação sobre este livro
                </button>
            )}

            {status === 'loading' && (
                <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Buscando em fontes confiáveis…
                </div>
            )}

            {status === 'empty' && (
                <p className="animate-fade-in text-sm text-text-muted">
                    Não encontramos uma citação confiável para este livro.
                </p>
            )}

            {status === 'error' && (
                <div className="animate-fade-in">
                    <p className="text-sm text-text-muted">
                        Não foi possível buscar agora.
                    </p>
                    <button
                        type="button"
                        onClick={search}
                        className="mt-2 text-sm text-text underline hover:no-underline"
                    >
                        Tentar de novo
                    </button>
                </div>
            )}

            {status === 'ready' && quote && (
                <div className="animate-fade-up">
                    <blockquote className="font-serif text-text italic">
                        “{quote.quoteTranslated ?? quote.quoteOriginal}”
                    </blockquote>
                    <p className="mt-2 text-sm text-text-muted">
                        — {quote.author}
                        {quote.workTitle ? `, ${quote.workTitle}` : ''}
                    </p>
                    {quote.sourceUrl && (
                        <p className="mt-3 text-xs text-text-muted">
                            {quote.quoteTranslated
                                ? 'Tradução livre do texto original. '
                                : ''}
                            <a
                                href={quote.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:no-underline"
                            >
                                Ver fonte ({quote.sourceDomain})
                            </a>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

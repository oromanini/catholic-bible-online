import { usePage } from '@inertiajs/react';
import { Loader2, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-fetch';
import { cn } from '@/lib/utils';
import bible from '@/routes/bible';

type Props = {
    versionCode: string;
    bookSlug: string;
    chapterNumber: number;
};

type CommentaryResponse = {
    available: boolean;
    content: string | null;
    commentId: number | null;
};

type Status = 'checking' | 'idle' | 'loading' | 'ready' | 'error';

export default function AiCommentary({
    versionCode,
    bookSlug,
    chapterNumber,
}: Props) {
    const { auth } = usePage().props;
    const [status, setStatus] = useState<Status>('checking');
    const [content, setContent] = useState<string | null>(null);
    const [commentId, setCommentId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        apiFetch<CommentaryResponse>(
            bible.aiCommentary.show.url({
                version: versionCode,
                book: bookSlug,
                chapterNumber,
            }),
        )
            .then((data) => {
                if (data.available) {
                    setContent(data.content);
                    setCommentId(data.commentId);
                    setStatus('ready');
                } else {
                    setStatus('idle');
                }
            })
            .catch(() => setStatus('idle'));
    }, [versionCode, bookSlug, chapterNumber]);

    async function generate() {
        setStatus('loading');

        try {
            const data = await apiFetch<CommentaryResponse>(
                bible.aiCommentary.store.url({
                    version: versionCode,
                    book: bookSlug,
                    chapterNumber,
                }),
                {
                    method: 'POST',
                },
            );
            setContent(data.content);
            setCommentId(data.commentId);
            setStatus('ready');
        } catch {
            setStatus('error');
        }
    }

    async function sendFeedback(rating: 'up' | 'down') {
        if (!commentId || !auth.user) {
            return;
        }

        setFeedback(rating);

        try {
            await apiFetch(
                bible.aiCommentary.feedback.url({ comment: commentId }),
                {
                    method: 'POST',
                    body: JSON.stringify({ rating }),
                },
            );
        } catch {
            // Feedback é um extra — falha aqui não deve atrapalhar a leitura.
        }
    }

    if (status === 'checking') {
        return null;
    }

    return (
        <div className="mt-10 rounded-lg border border-reading-muted/15 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-reading-muted">
                <Sparkles className="h-4 w-4" aria-hidden />
                Comentário com IA
            </div>

            {status === 'idle' && (
                <button
                    type="button"
                    onClick={generate}
                    className="rounded-lg border border-reading-muted/25 px-4 py-2 text-sm transition-all hover:bg-reading-muted/5 active:scale-95"
                >
                    Gerar comentário deste capítulo
                </button>
            )}

            {status === 'loading' && (
                <div className="flex items-center gap-2 text-sm text-reading-muted">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Gerando comentário…
                </div>
            )}

            {status === 'error' && (
                <div className="animate-fade-in">
                    <p className="text-sm text-reading-muted">
                        Não foi possível gerar o comentário agora.
                    </p>
                    <button
                        type="button"
                        onClick={generate}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Tentar de novo
                    </button>
                </div>
            )}

            {status === 'ready' && content && (
                <div className="animate-fade-in">
                    <p className="font-serif whitespace-pre-line text-reading-fg">
                        {content}
                    </p>
                    <p className="mt-3 text-xs text-reading-muted">
                        Sugestão gerada por IA — não substitui a orientação de
                        um sacerdote ou catequista.
                    </p>

                    {auth.user && (
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => sendFeedback('up')}
                                aria-pressed={feedback === 'up'}
                                aria-label="Comentário útil"
                                className={cn(
                                    'rounded-md p-1.5 transition-all active:scale-90',
                                    feedback === 'up'
                                        ? 'bg-reading-fg text-reading-bg'
                                        : 'text-reading-muted hover:bg-reading-muted/10',
                                )}
                            >
                                <ThumbsUp className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => sendFeedback('down')}
                                aria-pressed={feedback === 'down'}
                                aria-label="Comentário não útil"
                                className={cn(
                                    'rounded-md p-1.5 transition-all active:scale-90',
                                    feedback === 'down'
                                        ? 'bg-reading-fg text-reading-bg'
                                        : 'text-reading-muted hover:bg-reading-muted/10',
                                )}
                            >
                                <ThumbsDown className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

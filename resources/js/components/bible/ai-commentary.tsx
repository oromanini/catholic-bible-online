import { usePage } from '@inertiajs/react';
import { Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
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
        <div className="mt-9 rounded-[20px] border border-surface-border bg-surface p-7 backdrop-blur-[14px]">
            <div className="mb-4 flex items-center gap-2 text-[13px] font-extrabold tracking-[0.05em] text-accent-gold-text uppercase">
                <Sparkles className="h-4 w-4" aria-hidden />
                Comentário com IA
            </div>

            {status === 'idle' && (
                <button
                    type="button"
                    onClick={generate}
                    className="bg-gold-rose-gradient rounded-xl px-[22px] py-3 text-[13.5px] font-extrabold text-white transition-transform [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] active:scale-95"
                >
                    Gerar comentário deste capítulo
                </button>
            )}

            {status === 'loading' && (
                <div>
                    <div className="mb-3.5 flex items-center gap-3.5">
                        <div
                            className="animate-spin-glow h-[26px] w-[26px] rounded-full"
                            style={{
                                background:
                                    'conic-gradient(var(--accent-gold), transparent 65%)',
                            }}
                        />
                        <span className="text-sm text-text-muted">
                            Iluminando o texto…
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[100, 92, 75].map((width, index) => (
                            <div
                                key={width}
                                className="animate-shimmer h-3 rounded-md"
                                style={{
                                    width: `${width}%`,
                                    backgroundImage:
                                        'linear-gradient(90deg, var(--surface-border) 25%, var(--accent-gold-soft) 50%, var(--surface-border) 75%)',
                                    animationDelay: `${index * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {status === 'error' && (
                <div className="animate-fade-in">
                    <p className="text-sm text-text-muted">
                        Não foi possível gerar o comentário agora.
                    </p>
                    <button
                        type="button"
                        onClick={generate}
                        className="mt-2 text-sm text-text underline hover:no-underline"
                    >
                        Tentar de novo
                    </button>
                </div>
            )}

            {status === 'ready' && content && (
                <div className="animate-fade-up">
                    <p className="font-serif text-[15.5px] leading-[1.75] whitespace-pre-line text-text">
                        {content}
                    </p>
                    <p className="mt-3.5 text-[11.5px] text-text-muted">
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
                                        ? 'bg-accent-gold text-[#1a1230]'
                                        : 'text-text-muted hover:bg-accent-gold-soft',
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
                                        ? 'bg-accent-gold text-[#1a1230]'
                                        : 'text-text-muted hover:bg-accent-gold-soft',
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

type Props = {
    intensity?: 'vivid' | 'subtle';
};

export default function FloatingOrbs({ intensity = 'vivid' }: Props) {
    const opacity = intensity === 'vivid' ? 0.34 : 0.08;

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
            <div
                className="animate-float-a absolute -top-[10%] -left-[5%] h-[520px] w-[520px] rounded-full blur-[10px]"
                style={{
                    background:
                        'radial-gradient(circle at 30% 30%, var(--accent-gold), transparent 70%)',
                    opacity,
                }}
            />
            <div
                className="animate-float-b absolute top-[20%] -right-[8%] h-[460px] w-[460px] rounded-full blur-[8px]"
                style={{
                    background:
                        'radial-gradient(circle at 60% 40%, var(--accent-rose), transparent 70%)',
                    opacity,
                }}
            />
            <div
                className="animate-float-c absolute -bottom-[15%] left-[20%] h-[600px] w-[600px] rounded-full blur-[12px]"
                style={{
                    background:
                        'radial-gradient(circle at 50% 50%, var(--orb-violet), transparent 70%)',
                    opacity,
                }}
            />
        </div>
    );
}

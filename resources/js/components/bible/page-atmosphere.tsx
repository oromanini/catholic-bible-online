/*
 * Substitui os antigos "orbs" flutuantes. Aqueles borrões animados eram o
 * traço mais datado da interface (e custavam composição a cada frame).
 * Aqui o fundo é estático: uma única fonte de luz difusa no topo e um grão
 * de papel muito discreto — a textura de uma página impressa, não de um
 * hero de landing page.
 */

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function PageAtmosphere() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
            {/* Luz alta e central, como a de uma janela sobre a mesa. */}
            <div
                className="absolute inset-x-0 top-0 h-[70vh]"
                style={{
                    background:
                        'radial-gradient(72% 100% at 50% -10%, var(--page-glow), transparent 70%)',
                }}
            />
            {/* Vinheta inferior: assenta o conteúdo em vez de deixá-lo boiando. */}
            <div
                className="absolute inset-x-0 bottom-0 h-[45vh]"
                style={{
                    background:
                        'linear-gradient(to top, var(--shadow-near), transparent)',
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: GRAIN,
                    opacity: 'var(--grain-opacity)',
                }}
            />
        </div>
    );
}

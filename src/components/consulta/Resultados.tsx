import { useState } from 'react';
import { Subtitulo } from 'react-ecosistema-unp/ui';
import type { RiskResponse } from '../../types/risk';

type NormalizedSentence = { text: string; score: number };
type Props = { data: RiskResponse | null };


function ScoreCard({ label, value }: { label: string; value: number | undefined }) {
    const v = Number(value ?? 0);
    return (
        <div className="col-12 col-md-4 mb-3">
            <div className="border rounded-3 p-3 h-100 bg-white">
                <div className="text-muted small">{label}</div>
                <div className="fs-4 fw-semibold">{v.toFixed(2)}</div>
            </div>
        </div>
    );
}

function normalizeOraciones(raw: unknown): NormalizedSentence[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((item): NormalizedSentence => {
        if (Array.isArray(item)) {
            const texto = typeof item[0] === 'string' ? item[0] : String(item[0] ?? '');
            const score = Number(item[1] ?? 0);
            return { text: texto, score };
        }
        if (item && typeof item === 'object') {
            const anyItem = item as { text?: unknown; score?: unknown };
            const texto = typeof anyItem.text === 'string' ? anyItem.text : String(anyItem.text ?? '');
            const score = Number(anyItem.score ?? 0);
            return { text: texto, score };
        }
        return { text: String(item ?? ''), score: 0 };
    });
}

/** Tarjeta amplia para una categoría de enlaces */
function LinkCard({ kind, title, icon, items }: { kind: 'web' | 'social' | 'gov' | 'media'; title: string; icon: string; items: string[] }) {
    const [open, setOpen] = useState<boolean>(false);
    const [showAll, setShowAll] = useState<boolean>(false);

    const visible = showAll ? items : items.slice(0, 8);

    return (
        <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
                    <div className="d-flex align-items-center gap-2">
                        <span className="fs-4">{icon}</span>
                        <div>
                            <div className="fw-semibold">{title}</div>
                            <div className="small text-muted text-uppercase">{kind}</div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge text-bg-secondary">{items.length}</span>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            aria-expanded={open ? 'true' : 'false'}
                            aria-controls={`links-${kind}`}
                            onClick={() => setOpen(v => !v)}
                        >
                            {open ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                </div>

                {open && (
                    <div id={`links-${kind}`} className="card-body pt-0">
                        <ul className="list-group list-group-flush">
                            {visible.map((u, idx) => (
                                <li className="list-group-item bg-white d-flex justify-content-between align-items-start" key={idx}>
                                    <a className="link-underline-opacity-0 link-secondary text-break" href={u} target="_blank" rel="noreferrer">
                                        {u}
                                    </a>
                                    <span className="ms-2 small text-muted">↗</span>
                                </li>
                            ))}
                        </ul>

                        {items.length > 8 && (
                            <div className="d-flex justify-content-end mt-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => setShowAll(v => !v)}
                                >
                                    {showAll ? 'Ver menos' : `Ver todo (${items.length})`}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


export default function Resultados({ data }: Props) {
    if (!data) return null;

    const [showInforme, setShowInforme] = useState(false);
    const [topN, setTopN] = useState<number>(3);

    const scores = data.nivel_riesgo?.score_acumulado;
    const todas = normalizeOraciones(data.nivel_riesgo?.oraciones_riesgo);
    const oraciones = todas.slice(0, topN);
    const enlaces = (data as any).enlaces;

    // Informe siempre en castellano: cortar cualquier bloque previo y dejar desde "# Informe Detallado"
    const rawInforme = (data as any).informe_publico ?? (data as any).informe;
    let informeES = '';
    if (typeof rawInforme === 'string') {
        const idx = rawInforme.indexOf('# Informe Detallado');
        informeES = idx >= 0 ? rawInforme.slice(idx).trim() : rawInforme.trim();
    }



    return (
        <section className="mt-4">
            <header className="mb-3">
                <Subtitulo subtitle="Resultados del análisis" />
            </header>

            {scores && (
                <div className="row g-3">
                    <ScoreCard label="Riesgo" value={scores.Riesgo as number} />
                    <ScoreCard label="Neutral" value={scores.Neutral as number} />
                    <ScoreCard label="Irrelevante" value={scores.Irrelevante as number} />
                </div>
            )}

            {oraciones.length > 0 && (
                <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fw-semibold mb-0">Antecedentes de riesgo</h6>
                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="topN" className="small text-muted">Mostrar</label>
                            <select
                                id="topN"
                                className="form-select form-select-sm"
                                style={{ width: 100 }}
                                value={topN}
                                onChange={(e) => setTopN(Number(e.target.value))}
                            >
                                <option value={3}>3</option>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                            </select>
                        </div>

                    </div>

                    <div className="table-responsive">
                        <table className="table table-sm table-striped table-hover align-middle mb-0">
                            <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
                                <tr>
                                    <th className="text-center" style={{ width: '3.5rem' }}>#</th>
                                    <th style={{ width: '75%' }}>Antecedentes</th>
                                    <th className="text-end" style={{ width: '21%' }}>Puntaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {oraciones.map((o, i) => {
                                    const pct = Math.max(0, Math.min(100, Number(o.score ?? 0) * 100));
                                    return (
                                        <tr key={i}>
                                            <td className="text-center text-muted">{i + 1}</td>
                                            <td style={{ textAlign: 'justify' }}>
                                                <div className="text-wrap lh-base">{o.text}</div>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex flex-column align-items-center">
                                                    <span className="fw-semibold mb-1">
                                                        {pct.toFixed(1)}%
                                                    </span>
                                                    <div className="progress w-100" style={{ height: 6 }}>
                                                        <div
                                                            className="progress-bar"
                                                            role="progressbar"
                                                            style={{ width: `${pct}%` }}
                                                            aria-valuenow={pct}
                                                            aria-valuemin={0}
                                                            aria-valuemax={100}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {informeES && (
                <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="fw-semibold mb-0">Informe</h6>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setShowInforme(v => !v)}
                            aria-expanded={showInforme ? 'true' : 'false'}
                            aria-controls="informe-detallado"
                        >
                            {showInforme ? 'Ocultar' : 'Mostrar'} informe
                        </button>
                    </div>
                    {showInforme && (
                        <div id="informe-detallado" className="border rounded-3 p-3 bg-white">
                            <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{informeES}</pre>
                        </div>
                    )}
                </div>
            )}

            {enlaces && (
                <div className="mt-4">
                    <h6 className="fw-semibold mb-3">Enlaces</h6>
                    <div className="row g-3">
                        {enlaces.web?.length ? (
                            <LinkCard kind="web" title="Fuentes Web" icon="🌐" items={enlaces.web} />
                        ) : null}
                        {enlaces.social?.length ? (
                            <LinkCard kind="social" title="Redes Sociales" icon="💬" items={enlaces.social} />
                        ) : null}
                        {enlaces.gov?.length ? (
                            <LinkCard kind="gov" title="Gobierno" icon="🏛️" items={enlaces.gov} />
                        ) : null}
                        {enlaces.media?.length ? (
                            <LinkCard kind="media" title="Medios" icon="📰" items={enlaces.media} />
                        ) : null}
                    </div>
                </div>
            )}
        </section>
    );
}

import { useEffect, useState } from 'react';
import ScoreProgress from './ScoreProgress';

export type OracionItem = { text: string; score: number };

type Props = {
  items: OracionItem[];
  primaryColor?: string;
  onDone?: () => void;
  /** ms entre filas */
  step?: number;
};

export default function OracionesReveal({
  items,
  primaryColor = '#7bd5fe',
  onDone,
  step = 160,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (!items.length) {
      onDone?.();
      return;
    }
    const timers: number[] = [];
    items.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setVisibleCount((v) => Math.min(items.length, v + 1));
        if (i === items.length - 1) {
          const end = window.setTimeout(() => onDone?.(), step + 180);
          timers.push(end);
        }
      }, i * step);
      timers.push(t);
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [items, step, onDone]);

  return (
    <div className="table-responsive">
      <table className="table table-sm table-striped table-hover align-middle mb-0">
        <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
          <tr>
            <th className="text-center" style={{ width: '3.5rem' }}>#</th>
            <th style={{ width: '70%' }}>Antecedentes</th>
            <th className="text-end" style={{ width: '25%' }}>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {items.slice(0, visibleCount).map((o, i) => {
            const pct = Math.max(0, Math.min(100, Number(o.score ?? 0) * 100));
            return (
              <tr key={`${i}-${pct}`} className="stagger-item">
                <td className="text-center text-muted">{i + 1}</td>
                <td style={{ textAlign: 'justify' }}>
                  <div className="text-wrap lh-base">{o.text}</div>
                </td>
                <td className="text-end">
                  <div className="d-flex flex-column align-items-center">
                    <ScoreProgress
                      pct={pct}
                      label="Puntaje"
                      fillRemainder
                      primaryColor={primaryColor}
                      remainderColor="#e0e0e0"
                      height={8}
                      width="200px"
                      maxWidth="90%"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

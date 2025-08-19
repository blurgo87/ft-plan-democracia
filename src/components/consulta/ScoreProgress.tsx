import React from 'react';

export type ScoreProgressProps = {
  /** 0..100 ya calculado (si lo tienes en 0..1 conviértelo antes) */
  pct: number;
  /** Modo de color: 'continuous' = gradiente HSL, 'discrete' = clases Bootstrap
   *  Se ignora cuando fillRemainder=true (modo 2 tramos).
   */
  colorMode?: 'continuous' | 'discrete';
  /** Alto en px (default 8) */
  height?: number;
  /** Mostrar el % encima de la barra (default true) */
  showLabel?: boolean;
  /** Texto accesible opcional */
  label?: string;

  /** Activa el modo de 2 segmentos: porcentaje (primary) + resto (gris) */
  fillRemainder?: boolean;
  /** Color del segmento de porcentaje (default #7bd5fe) */
  primaryColor?: string;
  /** Color del segmento restante (default #e0e0e0) */
  remainderColor?: string;

  /** Ancho del track de la barra (acepta 'px' o '%'). Default '100%' */
  width?: number | string;
  /** Máximo ancho del track. Default '100%' */
  maxWidth?: number | string;
};

function pctToHsl(pct: number): string {
  const clamped = Math.max(0, Math.min(100, pct));
  const hue = (clamped / 100) * 120;
  return `hsl(${hue} 70% 45%)`;
}

function getDiscreteClass(pct: number): string {
  const p = Math.max(0, Math.min(100, pct));
  if (p < 33) return 'bg-danger';
  if (p < 66) return 'bg-warning';
  return 'bg-success';
}

export default function ScoreProgress({
  pct,
  colorMode = 'continuous',
  height = 8,
  showLabel = true,
  label,
  fillRemainder = false,
  primaryColor = '#7bd5fe',
  remainderColor = '#e0e0e0',
  width = '800%',
  maxWidth = '80%',
}: ScoreProgressProps) {
  const clamped = Math.max(0, Math.min(100, pct));

  const trackBase: React.CSSProperties = {
    height,
    backgroundColor: 'rgba(0,0,0,.08)',
    borderRadius: height / 2,
    width: typeof width === 'number' ? `${width}px` : width,
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
  };

  // --- Modo 2 segmentos (porcentaje + resto) ---
  if (fillRemainder) {
    return (
      <div className="d-flex flex-column align-items-center">
        {showLabel && (
          <span className="fw-semibold mb-1" aria-hidden="true">
            {clamped.toFixed(1)}%
          </span>
        )}
        <div className="progress" style={trackBase} aria-hidden={false}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${clamped}%`,
              backgroundColor: primaryColor,
              minWidth: clamped > 0 ? '4px' : undefined,
              transition: 'width .35s ease',
              height,
              borderRadius: height / 2,
            }}
            aria-valuenow={Number(clamped.toFixed(1))}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${clamped.toFixed(1)}%${label ? ` - ${label}` : ''}`}
            title={`${clamped.toFixed(1)}%${label ? ` • ${label}` : ''}`}
          />
          <div
            className="progress-bar"
            aria-hidden="true"
            style={{
              width: `${100 - clamped}%`,
              backgroundColor: remainderColor,
              transition: 'width .35s ease',
              height,
              borderRadius: height / 2,
            }}
            title="Resto"
          />
        </div>
      </div>
    );
  }

  // --- Modo 1 segmento ---
  const barStyle: React.CSSProperties =
    colorMode === 'continuous'
      ? {
          width: `${clamped}%`,
          backgroundColor: pctToHsl(clamped),
          minWidth: clamped > 0 ? '4px' : undefined,
          transition: 'width .35s ease',
          height,
          borderRadius: height / 2,
        }
      : {
          width: `${clamped}%`,
          minWidth: clamped > 0 ? '4px' : undefined,
          transition: 'width .35s ease',
          height,
          borderRadius: height / 2,
        };

  const discreteClass = colorMode === 'discrete' ? getDiscreteClass(clamped) : '';

  return (
    <div className="d-flex flex-column align-items-center">
      {showLabel && (
        <span className="fw-semibold mb-1" aria-hidden="true">
          {clamped.toFixed(1)}%
        </span>
      )}
      <div className="progress" style={trackBase} aria-hidden={false}>
        <div
          className={`progress-bar ${discreteClass}`}
          role="progressbar"
          style={barStyle}
          aria-valuenow={Number(clamped.toFixed(1))}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${clamped.toFixed(1)}%${label ? ` - ${label}` : ''}`}
          title={`${clamped.toFixed(1)}%${label ? ` • ${label}` : ''}`}
        />
      </div>
    </div>
  );
}


export type IconCandidatoColombiaProps = {
    size?: number;                   // px
    stroke?: string;                 // contorno opcional (torso/cabeza)
    strokeWidth?: number;            // grosor del trazo (px)
    className?: string;
    decorative?: boolean;            // true => aria-hidden
    title?: string;
    /** 'background' = bandera al fondo (franjas planas), 'mast' = asta a la derecha */
    flagVariant?: 'background' | 'mast';
    flagScale?: number;              // para 'mast'
    backgroundFlagOpacity?: number;  // 0..1
    monochromeFlag?: boolean;        // bandera en un solo color (stroke)
    silhouetteFill?: string;         // color de la silueta (usuario)
    rimLight?: string;               // mantenido por compatibilidad (no usado)
    /** Radio de las esquinas de la bandera en variante background */
    borderRadius?: number;
    /** Anillo (halo) alrededor de cabeza/torso para legibilidad sobre azul/rojo */
    halo?: boolean;
    haloColor?: string;
    haloWidth?: number;              // px
    /** Sombra suave opcional (filtro) */
    shadow?: boolean;
    /** Para accesibilidad cuando decorative=false (lo autogenero si falta) */
    titleId?: string;
};

export default function IconCandidatoColombia({
    size = 128,
    stroke = 'transparent',
    strokeWidth = 2,
    className,
    decorative = true,
    title = 'Candidato sobre bandera de Colombia',
    flagVariant = 'background',
    flagScale = 1.8,
    backgroundFlagOpacity = 1,
    monochromeFlag = false,
    silhouetteFill = '#0A0A0A',
    borderRadius = 10,
    halo = true,
    haloColor = 'rgba(255,255,255,0.85)',
    haloWidth = 3,
    shadow = false,
    titleId,
}: IconCandidatoColombiaProps) {
    const ariaHidden = decorative ? true : undefined;
    const _titleId = !decorative ? (titleId ?? `icon-candidato-co-${Math.random().toString(36).slice(2)}`) : undefined;

    // Colores bandera
    const colY = monochromeFlag ? '#AAAAAA' : '#FCD116';
    const colB = monochromeFlag ? '#888888' : '#0038A8';
    const colR = monochromeFlag ? '#666666' : '#CE1126';

    // Dimensiones
    const VB = 128; // viewBox base
    const headCx = 64;
    const headCy = 46;    // ligeramente más alto para sensación de balance
    const headR = 26;    // proporción refinada (antes 28)
    const torsoTop = 78;  // arranque del torso
    const torsoWidth = 88; // ancho virtual del óvalo del torso
    const torsoHeight = 48;

    // Filtros/SVG defs
    const filterId = `ds-${Math.random().toString(36).slice(2)}`;
    const clipId = `flag-clip-${Math.random().toString(36).slice(2)}`;

    // Halo interno: lo dibujamos como trazos alrededor de la cabeza y el torso
    const effectiveHalo = halo && haloWidth > 0 && haloColor !== 'transparent';

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${VB} ${VB}`}
            role="img"
            aria-hidden={ariaHidden}
            aria-labelledby={_titleId}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
        >
            {!decorative && <title id={_titleId}>{title}</title>}
            {!decorative && (
                <desc>
                    Bandera de Colombia y silueta centrada de un candidato (cabeza circular y torso estilizado).
                </desc>
            )}

            <defs>
                {/* Sombra muy suave para separar elementos cuando se use */}
                {shadow && (
                    <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity="0.25" />
                    </filter>
                )}

                {/* Clip de bandera con esquinas redondeadas */}
                <clipPath id={clipId}>
                    <rect x="0" y="0" width={VB} height={VB} rx={borderRadius} ry={borderRadius} />
                </clipPath>
            </defs>

            {/* ====== Bandera ====== */}
            {flagVariant === 'background' && (
                <g opacity={backgroundFlagOpacity} clipPath={`url(#${clipId})`} filter={shadow ? `url(#${filterId})` : undefined}>
                    {/* Amarillo: 1/2 superior */}
                    <rect x="0" y="0" width={VB} height={VB / 2} fill={colY} />
                    {/* Azul: 1/4 */}
                    <rect x="0" y={VB / 2} width={VB} height={VB / 4} fill={colB} />
                    {/* Rojo: 1/4 inferior */}
                    <rect x="0" y={(VB * 3) / 4} width={VB} height={VB / 4} fill={colR} />
                </g>
            )}

            {/* ====== Bandera en asta (si se requiere) ====== */}
            {flagVariant === 'mast' && (
                <g transform={`translate(92,18) scale(${flagScale})`} filter={shadow ? `url(#${filterId})` : undefined}>
                    <line
                        x1="0" y1="0" x2="0" y2="44"
                        stroke={stroke === 'transparent' ? '#4A646C' : stroke}
                        strokeWidth={Math.max(1.5, strokeWidth)}
                        strokeLinecap="round"
                    />
                    <rect x="0.5" y="0.5" width="28" height="18" fill={colY} />
                    <rect x="0.5" y="9.5" width="28" height="4.5" fill={colB} />
                    <rect x="0.5" y="14" width="28" height="4.5" fill={colR} />
                </g>
            )}

            {/* ====== Silueta ====== */}
            {/* Halo primero para que quede “debajo” del relleno */}
            {effectiveHalo && (
                <>
                    {/* Cabeza (halo) */}
                    <circle
                        cx={headCx}
                        cy={headCy}
                        r={headR + haloWidth / 2}
                        fill="none"
                        stroke={haloColor}
                        strokeWidth={haloWidth}
                    />
                    {/* Torso (halo): trazo del contorno del torso */}
                    <path
                        d={`
              M ${headCx - torsoWidth / 2}, ${torsoTop + torsoHeight / 2}
              a ${torsoWidth / 2},${torsoHeight / 2} 0 0 1 ${torsoWidth},0
              v 18
              a 12,12 0 0 1 -12,12
              h ${- (torsoWidth - 24)}
              a 12,12 0 0 1 -12,-12
              Z
            `}
                        fill="none"
                        stroke={haloColor}
                        strokeWidth={haloWidth}
                        strokeLinejoin="round"
                    />
                </>
            )}

            {/* Cabeza */}
            <circle
                cx={headCx}
                cy={headCy}
                r={headR}
                fill={silhouetteFill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />

            {/* Torso (óvalo con base) */}
            <path
                d={`
          M ${headCx - torsoWidth / 2}, ${torsoTop + torsoHeight / 2}
          a ${torsoWidth / 2},${torsoHeight / 2} 0 0 1 ${torsoWidth},0
          v 18
          a 12,12 0 0 1 -12,12
          h ${- (torsoWidth - 24)}
          a 12,12 0 0 1 -12,-12
          Z
        `}
                fill={silhouetteFill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

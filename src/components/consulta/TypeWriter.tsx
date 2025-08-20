import { useEffect, useMemo, useRef, useState } from 'react';

type TypeWriterProps = {
  phrases: string[];
  speed?: number;   // ms por carácter
  hold?: number;    // ms de pausa al terminar una frase
  className?: string;
  caretColor?: string;
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** Si es false, escribe solo la primera frase y luego llama onDone */
  loop?: boolean;
  /** Callback cuando termina (solo aplica con loop=false) */
  onDone?: () => void;
};

export default function TypeWriter({
  phrases,
  speed = 25,
  hold = 900,
  className,
  caretColor = '#7bd5fe',
  ariaLive = 'polite',
  loop = true,
  onDone,
}: TypeWriterProps) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const mounted = useRef(true);

  const current = phrases[idx % phrases.length];
  const letters = useMemo(() => current.split(''), [current]);

  useEffect(() => {
    mounted.current = true;
    let i = 0;
    setText('');
    let timeout = 0 as unknown as number;

    const tick = () => {
      if (!mounted.current) return;
      if (i < letters.length) {
        setText((prev) => prev + letters[i]);
        i += 1;
        timeout = window.setTimeout(tick, speed);
      } else {
        // Fin de frase
        if (!loop) {
          timeout = window.setTimeout(() => {
            if (mounted.current) onDone?.();
          }, hold);
          return;
        }
        // Ciclar a la siguiente
        timeout = window.setTimeout(() => {
          if (mounted.current) setIdx((n) => (n + 1) % phrases.length);
        }, hold);
      }
    };

    timeout = window.setTimeout(tick, speed);
    return () => {
      mounted.current = false;
      window.clearTimeout(timeout);
    };
  }, [idx, letters, phrases, speed, hold, loop, onDone]);

  return (
    <span
      className={className}
      aria-live={ariaLive}
      style={{ position: 'relative', paddingRight: '0.4rem' }}
    >
      {text}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          width: '0.3rem',
          height: '1.2em',
          backgroundColor: caretColor,
          display: 'inline-block',
          animation: 'blinkTW 1s steps(1) infinite',
          borderRadius: 2,
          transform: 'translateY(2px)',
        }}
      />
    </span>
  );
}

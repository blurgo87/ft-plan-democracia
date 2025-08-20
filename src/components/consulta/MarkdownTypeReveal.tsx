import { useEffect, useRef, useState } from 'react';
import MarkdownViewer from './utils/MarkdownViewer';

type MarkdownTypeRevealProps = {
  content: string;
  start?: boolean;
  speedChar?: number;
  pauseNewline?: number;
  pauseSentenceEnd?: number;
  onDone?: () => void;
  forceDone?: boolean;

  // Auto-scroll (global window si no se especifica otro contenedor)
  autoScroll?: boolean;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  scrollMarginBottom?: number;
  smoothScroll?: boolean;
  hideHeadingsOnDone?: boolean; 

};

export default function MarkdownTypeReveal({
  content,
  start = true,
  speedChar = 16,
  pauseNewline = 260,
  pauseSentenceEnd = 140,
  onDone,
  forceDone = false,
  autoScroll = true,
  scrollContainerRef,
  scrollMarginBottom = 32,
  smoothScroll = true,
    hideHeadingsOnDone = false,  

}: MarkdownTypeRevealProps) {
  const [shown, setShown] = useState<string>('');
  const iRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const runningRef = useRef<boolean>(false);
  const endRef = useRef<HTMLSpanElement | null>(null);

// dentro de useEffect(...) en MarkdownTypeReveal.tsx
useEffect(() => {
  stopTimer();

  if (forceDone) {
    setShown(content);
    onDone?.();
    return;
  }

  // si no debe empezar, no borres lo ya escrito
  if (!start) return;

  // iniciar escritura
  iRef.current = 0;
  setShown('');
  runningRef.current = true;

  const isSentenceEnd = (ch: string) => /[.!?…。]/.test(ch);
  const step = () => {
    if (!runningRef.current) return;

    const i = iRef.current!;
    if (i >= content.length) {
      runningRef.current = false;
      onDone?.();
      return;
    }

    const next = content.slice(0, i + 1);
    setShown(next);
    iRef.current = i + 1;

    const ch = content[i];
    let delay = speedChar;
    if (ch === '\n') delay = pauseNewline ?? speedChar;
    else if (isSentenceEnd(ch)) delay = pauseSentenceEnd ?? speedChar;

    timerRef.current = window.setTimeout(step, delay);
  };

  timerRef.current = window.setTimeout(step, speedChar);
  return () => stopTimer();
}, [content, start, forceDone, speedChar, pauseNewline, pauseSentenceEnd, onDone]);


  function stopTimer() {
    runningRef.current = false;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  // Auto-scroll al final usando un ancla invisible
  useEffect(() => {
    if (!autoScroll || forceDone) return;
    const anchor = endRef.current;
    if (!anchor) return;

    const doScroll = () => {
      anchor.style.display = 'block';
      anchor.style.height = `${scrollMarginBottom}px`;

      const container = scrollContainerRef?.current ?? null;
      if (container) {
        const rectA = anchor.getBoundingClientRect();
        const rectC = container.getBoundingClientRect();
        const overflow = rectA.bottom > rectC.bottom - 4;
        if (overflow) {
          container.scrollTo({
            top: container.scrollTop + (rectA.bottom - rectC.bottom) + scrollMarginBottom,
            behavior: smoothScroll ? 'smooth' : 'auto',
          });
        }
      } else {
        const rect = anchor.getBoundingClientRect();
        const bottom = window.innerHeight - scrollMarginBottom;
        const overflow = rect.bottom > bottom;
        if (overflow) {
          const delta = rect.bottom - bottom;
          window.scrollBy({ top: delta, left: 0, behavior: smoothScroll ? 'smooth' : 'auto' });
        }
      }
    };

    const raf = requestAnimationFrame(doScroll);
    return () => cancelAnimationFrame(raf);
  }, [shown, autoScroll, forceDone, scrollContainerRef, scrollMarginBottom, smoothScroll]);

  const finalText = forceDone ? content : shown;

  return (
    <div aria-live="polite">
            <MarkdownViewer
        content={finalText}
        hideHeadings={forceDone && hideHeadingsOnDone}  // NUEVO
      />
      <span ref={endRef} aria-hidden="true" />

    </div>
  );
}

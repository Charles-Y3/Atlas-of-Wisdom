import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from '../i18n/useT';

/** Horizontal chip row with a one-time “swipe for more” affordance. */
export default function ScrollHintRow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { t } = useT();
  const rowRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const check = () => {
      setOverflow(el.scrollWidth > el.clientWidth + 8);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const showHint = overflow && !dismissed;

  return (
    <div className={`scroll-hint-wrap ${showHint ? 'has-hint' : ''}`}>
      <div
        ref={rowRef}
        className={`chip-row ${className}`}
        onScroll={() => {
          if (!dismissed) setDismissed(true);
        }}
      >
        {children}
      </div>
      {showHint && (
        <div className="scroll-hint" aria-hidden>
          <span className="scroll-hint-label">{t('scrollMoreHint')}</span>
          <span className="scroll-hint-chevron">›</span>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from '../i18n/useT';

/** Horizontal chip row with a one-time “swipe / drag for more” affordance. */
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

  // Mouse / pen drag-to-scroll (touch keeps native overflow scrolling).
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      el.scrollLeft = startScroll - dx;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-dragging');
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth + 8) return;
      // Trackpads / mouse wheels: map vertical intent to horizontal scroll.
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endDrag);
      el.removeEventListener('pointercancel', endDrag);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  const showHint = overflow && !dismissed;

  return (
    <div className={`scroll-hint-wrap ${showHint ? 'has-hint' : ''}`}>
      <div
        ref={rowRef}
        className={`chip-row ${overflow ? 'chip-row-scrollable' : ''} ${className}`}
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

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from '../i18n/useT';

const DRAG_THRESHOLD = 10;

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

  // Mouse / pen drag-to-scroll — only after a clear drag, so chip clicks still fire.
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    let tracking = false;
    let dragging = false;
    let suppressClick = false;
    let startX = 0;
    let startScroll = 0;
    let activePointer: number | null = null;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (e.button !== 0) return;
      tracking = true;
      dragging = false;
      suppressClick = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      activePointer = e.pointerId;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!tracking || e.pointerId !== activePointer) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        suppressClick = true;
        el.classList.add('is-dragging');
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      el.scrollLeft = startScroll - dx;
    };

    const endTrack = (e: PointerEvent) => {
      if (!tracking || e.pointerId !== activePointer) return;
      tracking = false;
      activePointer = null;
      if (dragging) {
        dragging = false;
        el.classList.remove('is-dragging');
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
      }
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth + 8) return;
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endTrack);
    el.addEventListener('pointercancel', endTrack);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endTrack);
      el.removeEventListener('pointercancel', endTrack);
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

import { clsx } from 'clsx';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import styles from './grid-table.module.css';

/** Полный текст при наведении, только если строка обрезана (ellipsis). */
export function CellOverflowTooltip({ children }: { children: ReactNode }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [tip, setTip] = useState<string | undefined>();

  const measure = useCallback(() => {
    const el = spanRef.current;
    if (!el) {
      setTip(undefined);
      return;
    }
    const raw = el.textContent ?? '';
    const normalized = raw.replace(/\s+/g, ' ').trim();
    if (!normalized) {
      setTip(undefined);
      return;
    }
    const overflow = el.scrollWidth > el.clientWidth + 1;
    setTip(overflow ? normalized : undefined);
  }, []);

  useEffect(() => {
    measure();
    const el = spanRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, children]);

  return (
    <span
      ref={spanRef}
      title={tip}
      className={clsx(styles.cellInner, tip ? styles.cellInnerOverflow : undefined)}
    >
      {children}
    </span>
  );
}

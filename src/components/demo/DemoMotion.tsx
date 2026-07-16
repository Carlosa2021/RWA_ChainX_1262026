'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoMotion — Sprint 11.2 Enterprise Polish
//
// Zero-dependency motion primitives for the isolated demo. Pure React + rAF, no
// animation libraries. Every helper honours `prefers-reduced-motion` and never
// touches production code, data or any write path.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';

// ─── Reduced-motion awareness ────────────────────────────────────────────────

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// ─── First-paint flag (drives enter transitions) ─────────────────────────────

export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}

// ─── Short "enterprise boot" delay (skeleton window) ─────────────────────────

export function useBootDelay(ms = 220): boolean {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms, reduced]);
  return ready;
}

// ─── Count-up number ─────────────────────────────────────────────────────────

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(target: number, duration = 1100): number {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(target * easeOutCubic(progress));
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration, reduced]);

  return value;
}

/**
 * Animates the numeric core of a formatted string (e.g. "€35.84M", "580",
 * "8.4%") from 0 to its final value while preserving prefix, suffix, decimal
 * count and thousands separators. Screen readers only ever announce the final
 * value — intermediate frames are aria-hidden.
 */
export function AnimatedNumber({
  value,
  duration = 1100,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = value.match(/^(\D*?)([\d.,]+)(\D*)$/);
  const numeric = match ? parseFloat(match[2].replace(/,/g, '')) : NaN;
  const animated = useCountUp(Number.isFinite(numeric) ? numeric : 0, duration);

  if (!match || !Number.isFinite(numeric)) {
    return <span className={className}>{value}</span>;
  }

  const [, prefix, core, suffix] = match;
  const dotIndex = core.indexOf('.');
  const decimals = dotIndex === -1 ? 0 : core.length - dotIndex - 1;
  const hasThousands = core.includes(',');
  const formatted = hasThousands
    ? animated.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : animated.toFixed(decimals);

  return (
    <span className={className}>
      <span aria-hidden="true">
        {prefix}
        {formatted}
        {suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

// ─── Reveal (fade + slide on enter) ──────────────────────────────────────────

export function Reveal({
  children,
  delay = 0,
  y = 8,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section';
}) {
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();
  const show = reduced || mounted;

  const style: CSSProperties = reduced
    ? {}
    : {
        opacity: show ? 1 : 0,
        transform: show ? 'none' : `translateY(${y}px)`,
        transition: `opacity 480ms ease ${delay}ms, transform 520ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      };

  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
}

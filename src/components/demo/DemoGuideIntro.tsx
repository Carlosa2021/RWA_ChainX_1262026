'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoGuideIntro — Sprint 12.1 Guided Demo Mode
//
// Compact start-confirmation dialog. Presentation begins only after explicit
// confirmation. On Starter, offers to open the Business guided demo (never a
// silent plan switch). Pure UI — no network, no storage.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Presentation,
  ArrowRight,
  X,
  Clock,
  ListChecks,
  StickyNote,
  ShieldCheck,
} from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import { useDemoGuide } from '@/contexts/DemoGuideContext';
import { useMounted, usePrefersReducedMotion } from '@/components/demo/DemoMotion';
import { DEMO_GUIDE_TOTAL_STEPS, DEMO_GUIDE_TOTAL_MINUTES } from '@/lib/demo/demoGuide';

export function DemoGuideIntro() {
  const { session } = useDemo();
  const { isIntroOpen, closeIntro, startGuide } = useDemoGuide();
  const isStarter = session.plan === 'starter';

  const dialogRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const shown = reduced || mounted;

  useEffect(() => {
    if (!isIntroOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => primaryRef.current?.focus(), 40);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeIntro();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [isIntroOpen, closeIntro]);

  if (!isIntroOpen) return null;

  return (
    <div
      className="fixed inset-0 z-110 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm"
      style={{ opacity: shown ? 1 : 0, transition: reduced ? undefined : 'opacity 200ms ease' }}
      onClick={closeIntro}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-intro-title"
        aria-describedby="guide-intro-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.97)',
          transition: reduced
            ? undefined
            : 'opacity 220ms ease, transform 260ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
              <Presentation className="h-5 w-5" aria-hidden="true" />
            </span>
            <button
              onClick={closeIntro}
              aria-label="Close guided demo introduction"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <h3
            id="guide-intro-title"
            className="mt-4 text-lg font-semibold text-gray-900 dark:text-white"
          >
            Guided Demo
          </h3>

          {isStarter ? (
            <>
              <p
                id="guide-intro-desc"
                className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400"
              >
                The executive guided presentation is designed around the Business platform.
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={closeIntro}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Stay on Starter
                </button>
                <Link
                  ref={primaryRef as React.Ref<HTMLAnchorElement>}
                  href="/demo/business"
                  onClick={closeIntro}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-offset-gray-900"
                >
                  Open Business Guided Demo
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <p
                id="guide-intro-desc"
                className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400"
              >
                Follow an executive {DEMO_GUIDE_TOTAL_MINUTES}-minute presentation through the
                Business platform.
              </p>

              <ul className="mt-5 space-y-2.5">
                {[
                  { icon: ListChecks, text: `${DEMO_GUIDE_TOTAL_STEPS} steps` },
                  { icon: Clock, text: `Approximately ${DEMO_GUIDE_TOTAL_MINUTES} minutes` },
                  { icon: StickyNote, text: 'Presenter notes included' },
                  { icon: ShieldCheck, text: 'No transactions or real actions' },
                ].map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={closeIntro}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  ref={primaryRef as React.Ref<HTMLButtonElement>}
                  onClick={startGuide}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-offset-gray-900"
                >
                  Start Presentation
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

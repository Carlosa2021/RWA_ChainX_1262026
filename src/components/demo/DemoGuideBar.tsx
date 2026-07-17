'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoGuideBar — Sprint 12.1 Guided Demo Mode
//
// Sticky presenter control bar rendered below the demo banner while the guided
// presentation is active. Desktop: full controls + progress. Mobile: compact
// row expandable to a bottom sheet. Also owns the exit-confirmation dialog.
// Pure UI — no network, no storage.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  StickyNote,
  LogOut,
  Crosshair,
  X,
  MoreHorizontal,
} from 'lucide-react';
import { DemoView } from '@/lib/demo/navigation';
import { useDemoGuide } from '@/contexts/DemoGuideContext';
import { usePrefersReducedMotion } from '@/components/demo/DemoMotion';

function ExitConfirm() {
  const { isExitPromptOpen, cancelExit, exitGuide } = useDemoGuide();
  const reduced = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isExitPromptOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => confirmRef.current?.focus(), 40);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelExit();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
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
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [isExitPromptOpen, cancelExit]);

  if (!isExitPromptOpen) return null;

  return (
    <div
      className="fixed inset-0 z-115 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm"
      onClick={cancelExit}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-exit-title"
        aria-describedby="guide-exit-desc"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
        style={{ animation: reduced ? undefined : 'none' }}
      >
        <h3 id="guide-exit-title" className="text-base font-semibold text-gray-900 dark:text-white">
          Exit guided demo?
        </h3>
        <p id="guide-exit-desc" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You will return to the standard demo. The platform and its data remain unchanged.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={cancelExit}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Continue presentation
          </button>
          <button
            ref={confirmRef}
            onClick={exitGuide}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-offset-gray-900"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoGuideBar({
  activeView,
  onGoToRecommendedView,
}: {
  activeView: DemoView;
  onGoToRecommendedView: () => void;
}) {
  const {
    isGuideActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    toggleNotes,
    isNotesOpen,
    requestExit,
  } = useDemoGuide();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!isGuideActive || !currentStep) return null;

  const progress = ((currentStepIndex + 1) / totalSteps) * 100;
  const offView = activeView !== currentStep.view;

  return (
    <>
      <div className="sticky top-0 z-90 border-b border-gray-200 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/75 dark:border-gray-800 dark:bg-gray-900/90 dark:supports-backdrop-filter:bg-gray-900/75">
        {/* Progress line */}
        <div className="h-0.5 w-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
          <div
            className="h-full bg-gray-900 transition-[width] duration-500 ease-out dark:bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* aria-live announces step changes to assistive tech */}
        <p aria-live="polite" className="sr-only">
          Step {currentStep.id} of {totalSteps}: {currentStep.title}
        </p>

        {/* Desktop */}
        <div className="hidden items-center gap-4 px-4 py-2.5 sm:flex lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              Step {currentStep.id} / {totalSteps}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {currentStep.title}
              </p>
            </div>
            <span className="shrink-0 text-xs text-gray-400">
              ~{currentStep.durationMinutes} min
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {offView && (
              <button
                onClick={onGoToRecommendedView}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
                Go to recommended view
              </button>
            )}
            <button
              onClick={toggleNotes}
              aria-pressed={isNotesOpen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              Presenter notes
            </button>
            <button
              onClick={previousStep}
              disabled={isFirstStep}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={isLastStep}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              onClick={requestExit}
              aria-label="Exit guided demo"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Exit
            </button>
          </div>
        </div>

        {/* Mobile compact row */}
        <div className="flex items-center gap-2 px-4 py-2 sm:hidden">
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {currentStep.id}/{totalSteps}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-white">
            {currentStep.shortTitle}
          </p>
          <button
            onClick={toggleNotes}
            aria-label="Presenter notes"
            aria-pressed={isNotesOpen}
            className="shrink-0 rounded-lg border border-gray-200 p-1.5 text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            <StickyNote className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={previousStep}
            disabled={isFirstStep}
            aria-label="Previous step"
            className="shrink-0 rounded-lg border border-gray-200 p-1.5 text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={nextStep}
            disabled={isLastStep}
            aria-label="Next step"
            className="shrink-0 rounded-lg bg-gray-900 p-1.5 text-white disabled:opacity-40 dark:bg-white dark:text-gray-900"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => setSheetOpen(true)}
            aria-label="More guided demo options"
            className="shrink-0 rounded-lg border border-gray-200 p-1.5 text-gray-600 dark:border-gray-700 dark:text-gray-300"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-95 flex items-end bg-gray-950/50 sm:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            role="dialog"
            aria-label="Guided demo options"
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-2xl border-t border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Step {currentStep.id} · {currentStep.title}
              </p>
              <button
                onClick={() => setSheetOpen(false)}
                aria-label="Close options"
                className="rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-2">
              {offView && (
                <button
                  onClick={() => {
                    onGoToRecommendedView();
                    setSheetOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
                >
                  <Crosshair className="h-4 w-4" aria-hidden="true" />
                  Go to recommended view
                </button>
              )}
              <button
                onClick={() => {
                  toggleNotes();
                  setSheetOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200"
              >
                <StickyNote className="h-4 w-4" aria-hidden="true" />
                Presenter notes
              </button>
              <button
                onClick={() => {
                  requestExit();
                  setSheetOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Exit guided demo
              </button>
            </div>
          </div>
        </div>
      )}

      <ExitConfirm />
    </>
  );
}

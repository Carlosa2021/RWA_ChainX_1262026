'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoGuideNotes — Sprint 12.1 Guided Demo Mode
//
// Right-side presenter drawer. Complementary (non-blocking) panel so the demo
// stays interactive while notes are visible — intended for the presenter's own
// screen. Hidden by default; opened intentionally. Pure UI.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import { X, Target, MessageSquare, MousePointerClick, Ban, Sparkles, Quote } from 'lucide-react';
import { useDemoGuide } from '@/contexts/DemoGuideContext';
import { usePrefersReducedMotion } from '@/components/demo/DemoMotion';

function NoteSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0 dark:border-gray-800">
      <h4 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </h4>
      <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {children}
      </div>
    </section>
  );
}

export function DemoGuideNotes() {
  const { isGuideActive, isNotesOpen, closeNotes, currentStep } = useDemoGuide();
  const reduced = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isNotesOpen) {
      const t = window.setTimeout(() => headingRef.current?.focus(), 40);
      return () => window.clearTimeout(t);
    }
  }, [isNotesOpen]);

  if (!isGuideActive || !currentStep) return null;

  const open = isNotesOpen;

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label="Presenter notes"
      aria-hidden={!open}
      className="fixed inset-y-0 right-0 z-95 flex w-full max-w-sm flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      style={{
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: reduced ? undefined : 'transform 280ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden',
      }}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Step {currentStep.id} · Presenter notes
          </p>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="truncate text-base font-semibold text-gray-900 outline-none dark:text-white"
          >
            {currentStep.title}
          </h3>
        </div>
        <button
          onClick={closeNotes}
          aria-label="Close presenter notes"
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <NoteSection icon={Target} title="Objective">
          <p>{currentStep.objective}</p>
          <p className="mt-1.5 text-xs italic text-gray-400">{currentStep.presenterPrompt}</p>
        </NoteSection>

        <NoteSection icon={MessageSquare} title="What to say">
          <ul className="space-y-1.5">
            {currentStep.talkingPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          {currentStep.keyLine && (
            <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
              <Quote className="mb-1 mr-1 inline h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
              {currentStep.keyLine}
            </p>
          )}
        </NoteSection>

        {currentStep.recommendedActions.length > 0 && (
          <NoteSection icon={MousePointerClick} title="What to show">
            <ul className="space-y-1.5">
              {currentStep.recommendedActions.map((action) => (
                <li key={action} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400"
                  />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </NoteSection>
        )}

        {currentStep.avoidTopics.length > 0 && (
          <NoteSection icon={Ban} title="Avoid">
            <ul className="space-y-1.5">
              {currentStep.avoidTopics.map((topic) => (
                <li key={topic} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600"
                  />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </NoteSection>
        )}

        <NoteSection icon={Sparkles} title="Client takeaway">
          <p>{currentStep.clientTakeaway}</p>
          <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-100">
            {currentStep.closingLine}
          </p>
        </NoteSection>
      </div>
    </div>
  );
}

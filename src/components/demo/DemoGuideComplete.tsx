'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoGuideComplete — Sprint 12.1 Guided Demo Mode
//
// Commercial closing panel shown as the main content on the final guided step.
// Presents deployment paths and presenter closing questions and routes to a
// private consultation. Uses only the existing safe sales mail link. Pure UI.
// ─────────────────────────────────────────────────────────────────────────────

import { CheckCircle2, LayoutDashboard, LogOut, Mail, HelpCircle } from 'lucide-react';
import { useDemoGuide } from '@/contexts/DemoGuideContext';
import { Reveal } from '@/components/demo/DemoMotion';
import { DEMO_DEPLOYMENT_PATHS, DEMO_CLOSING_QUESTIONS } from '@/lib/demo/demoGuide';

export function DemoGuideComplete({ onReturnToDashboard }: { onReturnToDashboard: () => void }) {
  const { exitGuide } = useDemoGuide();

  return (
    <Reveal className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          Presentation Complete
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          ChainX Business Platform · Executive Walkthrough
        </p>
      </header>

      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Deployment paths
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {DEMO_DEPLOYMENT_PATHS.map((path) => (
            <div
              key={path.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{path.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {path.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900/50">
        <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Questions to ask before you close
        </h2>
        <ul className="mt-3 space-y-2">
          {DEMO_CLOSING_QUESTIONS.map((q) => (
            <li
              key={q}
              className="flex gap-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"
              />
              {q}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
        <a
          href="mailto:sales@chainx.ch?subject=Private%20ChainX%20consultation%20request"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-offset-gray-950"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Request Private Consultation
        </a>
        <button
          onClick={onReturnToDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
          Return to Dashboard
        </button>
        <button
          onClick={exitGuide}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Exit Guided Demo
        </button>
      </div>
    </Reveal>
  );
}

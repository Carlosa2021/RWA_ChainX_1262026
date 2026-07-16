'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoPlanCard — Sprint 11.0 Multi-Plan Demo Gateway
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { DemoPlanConfig } from '@/lib/demo/plans';

export function DemoPlanCard({ plan }: { plan: DemoPlanConfig }) {
  const popular = Boolean(plan.popular);
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-shadow hover:shadow-lg ${
        popular
          ? 'border-gray-900 bg-white shadow-md dark:border-white dark:bg-gray-900'
          : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-gray-900">
          Most Popular
        </span>
      )}

      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.label}</h3>
        <span className="text-xs font-medium text-gray-400">{plan.priceHint}</span>
      </div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{plan.tagline}</p>

      <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {plan.description}
      </p>

      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{h}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/demo/${plan.id}`}
        className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 ${
          popular
            ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
            : 'border border-gray-200 text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:text-white dark:hover:bg-gray-800'
        }`}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

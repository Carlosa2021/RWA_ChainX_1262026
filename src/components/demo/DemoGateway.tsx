'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoGateway — Sprint 11.0 Multi-Plan Demo Gateway
//
// Premium public entry point. No wallet, no login. A prospect understands the
// three plans and enters the relevant demo in seconds.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { Eye, ShieldCheck, Table2, Sparkles, KeyRound } from 'lucide-react';
import { DemoPlanCard } from '@/components/demo/DemoPlanCard';
import { getAllDemoPlans } from '@/lib/demo/plans';

export function DemoGateway() {
  const plans = getAllDemoPlans();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <Eye className="h-3.5 w-3.5" />
            Safe view-only preview · No wallet required
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            ChainX
          </h1>
          <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-200">
            Enterprise Digital Securities Infrastructure
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            Explore the platform without a wallet. Choose a plan below to enter a live, view-only
            demo of the complete tokenization experience.
          </p>
        </div>

        {/* Plan cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <DemoPlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Secondary CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo/business"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <Table2 className="h-4 w-4" />
            Compare Plans
          </Link>
          <a
            href="mailto:sales@chainx.ch?subject=Private%20ChainX%20demo%20request"
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <Sparkles className="h-4 w-4" />
            Request Private Demo
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <KeyRound className="h-4 w-4" />
            Access Licensed Platform
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            ERC-3643 · MiCA-ready
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            No account · No transactions
          </span>
          <span>White-label ready</span>
        </div>
      </div>
    </div>
  );
}

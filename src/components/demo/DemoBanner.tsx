'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoBanner — Sprint 11.0 Multi-Plan Demo Gateway
//
// Persistent, unmissable banner that reminds the visitor: which plan, that it is
// view-only, that no wallet is required, and how to switch plan / exit / request
// a private demo.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { Eye, ArrowLeftRight, LogOut, Sparkles } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';

export function DemoBanner() {
  const { config } = useDemo();

  return (
    <div className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 text-white">
      <div className="flex flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium">
            <Eye className="w-3.5 h-3.5" />
            {config.label} Demo
          </span>
          <span className="text-gray-300">
            View-only · No wallet required · Actions are simulated
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            Switch Plan
          </Link>
          <a
            href="mailto:sales@chainx.ch?subject=Private%20ChainX%20demo%20request"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            Request Private Demo
          </a>
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
}

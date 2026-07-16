'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoShell — Sprint 11.0 Multi-Plan Demo Gateway
//
// Self-contained demo application shell. It deliberately does NOT use the
// production Sidebar/Header, never reads isOwner, never shows Platform Owner
// controls (Tenants, global Domains, Billing, tenant provisioning), and never
// renders a wallet connect button. Navigation switches an internal view state
// (no real sub-routes) so the demo stays inside /demo/**.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import Link from 'next/link';
import { Building2, Lock, Eye } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import { DemoActionGuardProvider } from '@/components/demo/DemoActionGuard';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { DemoViewRenderer } from '@/components/demo/DemoViews';
import {
  getDemoNavigation,
  isViewUnlocked,
  unlockPlanLabel,
  DemoView,
} from '@/lib/demo/navigation';
import { MERIDIAN } from '@/lib/demo/data';

export function DemoShell() {
  const { config, session } = useDemo();
  const [activeView, setActiveView] = useState<DemoView>('dashboard');
  const sections = getDemoNavigation(session.plan);

  return (
    <DemoActionGuardProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex min-h-screen">
          {/* Demo sidebar (isolated — no owner controls) */}
          <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:flex">
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
                  style={{ backgroundColor: MERIDIAN.primaryColor }}
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                    {MERIDIAN.legalName}
                  </p>
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                    <Eye className="h-3 w-3" />
                    {config.label} Demo
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
              {sections.map((section) => (
                <div key={section.label}>
                  <p className="px-2 pb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const unlocked = isViewUnlocked(session.plan, item);
                      const active = unlocked && activeView === item.view;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.view}
                          onClick={() => setActiveView(item.view)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 ${
                            active
                              ? 'bg-gray-900 font-medium text-white dark:bg-white dark:text-gray-900'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {!unlocked && item.feature && (
                            <span
                              title={`Unlocks on ${unlockPlanLabel(item.feature)}`}
                              className="flex items-center gap-1 text-xs text-gray-400"
                            >
                              <Lock className="h-3 w-3" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-gray-200 px-3 py-3 dark:border-gray-800">
              <Link
                href="/demo"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-950"
              >
                Exit demo
              </Link>
            </div>
          </aside>

          {/* Main area */}
          <div className="flex min-w-0 flex-1 flex-col">
            <DemoBanner />

            {/* Mobile view selector */}
            <div className="border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-900 md:hidden">
              <select
                value={activeView}
                onChange={(e) => setActiveView(e.target.value as DemoView)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
              >
                {sections.flatMap((s) =>
                  s.items.map((item) => (
                    <option key={item.view} value={item.view}>
                      {s.label} · {item.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <DemoViewRenderer view={activeView} />
            </main>
          </div>
        </div>
      </div>
    </DemoActionGuardProvider>
  );
}

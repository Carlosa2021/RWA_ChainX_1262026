'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoActionGuard — Sprint 11.0 Multi-Plan Demo Gateway
//
// Provides useDemoAction().simulate(actionId) to every demo view. The handler
// itself NEVER reaches a real write path: it only resolves a static message and
// shows a premium modal. There is no API call, no wallet prompt, no network.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowRight, X, Sparkles } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import { DemoActionId, DemoGuardMessage, resolveGuardMessage } from '@/lib/demo/guards';
import { useMounted, usePrefersReducedMotion } from '@/components/demo/DemoMotion';

interface DemoActionContextType {
  simulate: (action: DemoActionId) => void;
}

const DemoActionContext = createContext<DemoActionContextType | undefined>(undefined);

export function DemoActionGuardProvider({ children }: { children: ReactNode }) {
  const { session } = useDemo();
  const [message, setMessage] = useState<DemoGuardMessage | null>(null);

  const simulate = useCallback(
    (action: DemoActionId) => {
      // No write path is ever invoked — we only compute a static message.
      setMessage(resolveGuardMessage(action, session.plan));
    },
    [session.plan]
  );

  const value = useMemo(() => ({ simulate }), [simulate]);

  return (
    <DemoActionContext.Provider value={value}>
      {children}
      {message && <DemoActionModal message={message} onClose={() => setMessage(null)} />}
    </DemoActionContext.Provider>
  );
}

export function useDemoAction(): DemoActionContextType {
  const ctx = useContext(DemoActionContext);
  if (!ctx) {
    throw new Error('useDemoAction must be used within a DemoActionGuardProvider');
  }
  return ctx;
}

function DemoActionModal({ message, onClose }: { message: DemoGuardMessage; onClose: () => void }) {
  const isUpgrade = message.variant === 'upgrade';
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  const shown = reduced || mounted;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{
        opacity: shown ? 1 : 0,
        transition: reduced ? undefined : 'opacity 200ms ease',
      }}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
          transition: reduced
            ? undefined
            : 'opacity 220ms ease, transform 260ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isUpgrade
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isUpgrade ? <Lock className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {message.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {message.body}
          </p>

          {isUpgrade && message.requiredPlanLabel && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 px-3 py-2.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Unlocks on the {message.requiredPlanLabel} plan
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Continue exploring
            </button>
            <Link
              href="/demo/request"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-xl transition-colors"
            >
              Request Private Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

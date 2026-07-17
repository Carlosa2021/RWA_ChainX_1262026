'use client';

// ─────────────────────────────────────────────────────────────────────────────
// LicensedPlatformNotice — Sprint 12.3 Commercial Navigation Polish
//
// A small, elegant, dismissible informational notice shown on the licensed
// production shell (/). It clarifies that a fresh deployment intentionally
// starts empty. It is NOT a modal and does NOT block interaction.
//
// Visibility is remembered for the current tab session only (sessionStorage) —
// the single permitted use of web storage in this sprint. No network, no data.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';

const STORAGE_KEY = 'chainx.licensedNotice.dismissed';

export function LicensedPlatformNotice() {
  // Start hidden to avoid any hydration mismatch; reveal after mount if the
  // notice has not already been dismissed in this session.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) !== '1') {
        setVisible(true);
      }
    } catch {
      // If sessionStorage is unavailable, show the notice for this render only.
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Non-fatal: notice simply reappears next mount if storage is blocked.
    }
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-8 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3.5 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70"
    >
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
        <Info className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Licensed Platform</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          This is a clean production deployment. Each customer receives a dedicated, private
          environment. Projects, investors and branding are configured during deployment.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notice"
        className="ml-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 dark:hover:bg-gray-800 dark:hover:text-gray-200"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyFieldProps {
  label: string;
  value: string | null | undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// CopyField — labeled read-only field with one-click clipboard copy.
// Handles null/undefined value safely (renders "—" with no copy button).
// No toast — inline "Copied ✓" feedback resets after 2 seconds.
// ─────────────────────────────────────────────────────────────────────────────

export function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be blocked in some contexts — fail silently.
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      {value ? (
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
          <span className="flex-1 text-xs font-mono text-gray-800 dark:text-gray-200 break-all select-all">
            {value}
          </span>
          <button
            onClick={handleCopy}
            type="button"
            className={`shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded transition-colors ${
              copied
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">—</p>
      )}
    </div>
  );
}

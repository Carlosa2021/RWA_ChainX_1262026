'use client';

import { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import type { TenantDomain } from '@/lib/domains/types';

// ─────────────────────────────────────────────────────────────────────────────
// DomainActions — row-level action buttons driven by verificationStatus.
//
// Each row owns its own loading/error state — no lifted state required.
// The parent provides callbacks to reflect updates and open the DNS panel.
//
// Status → action matrix:
//   pending     → [Register with Vercel]
//   registering → [Registering… (disabled)]
//   registered  → [Check DNS] [View DNS]
//   verified    → [Open ↗] [View DNS]
//   failed      → [Re-register] [View Error]
// ─────────────────────────────────────────────────────────────────────────────

interface DomainActionsProps {
  domain: TenantDomain;
  ownerAddress: string;
  /** Called with the updated domain after a successful action. */
  onActionComplete: (updatedDomain?: TenantDomain) => void;
  /** Called to open the DnsInstructionsPanel for this domain. */
  onViewDns: (domain: TenantDomain) => void;
}

// ─── API response shapes ──────────────────────────────────────────────────────

interface RegisterResponse {
  success: boolean;
  hostname?: string;
  status?: string;
  dnsInstructions?: {
    txtName: string;
    txtValue: string;
    cnameName: string | null;
    cnameValue: string | null;
  };
  error?: string;
  mode?: string;
}

interface CheckResponse {
  success: boolean;
  hostname?: string;
  verified?: boolean;
  status?: string;
  error?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DomainActions({
  domain,
  ownerAddress,
  onActionComplete,
  onViewDns,
}: DomainActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = domain.verificationStatus;

  // ── Register (pending → registered) ────────────────────────────────────────
  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/domains/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: domain.hostname, ownerAddress }),
      });
      const data = (await res.json()) as RegisterResponse;

      if (!data.success) {
        setError(data.error ?? 'Registration failed. Please try again.');
        return;
      }

      // Build updated domain merging DNS instructions from the response
      const updatedDomain: TenantDomain = {
        ...domain,
        verificationStatus: 'registered',
        verified: false,
        txtName: data.dnsInstructions?.txtName ?? domain.txtName,
        txtValue: data.dnsInstructions?.txtValue ?? domain.txtValue,
        cnameName: data.dnsInstructions?.cnameName ?? domain.cnameName,
        cnameValue: data.dnsInstructions?.cnameValue ?? domain.cnameValue,
        updatedAt: new Date().toISOString(),
      };

      onActionComplete(updatedDomain);
      // Auto-open DNS panel after successful registration
      onViewDns(updatedDomain);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Check DNS (registered → verified | registered) ──────────────────────────
  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/domains/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: domain.hostname, ownerAddress }),
      });
      const data = (await res.json()) as CheckResponse;

      if (!data.success) {
        setError(data.error ?? 'DNS check failed. Please try again.');
        return;
      }

      const updatedDomain: TenantDomain = {
        ...domain,
        verificationStatus: data.verified ? 'verified' : 'registered',
        verified: data.verified ?? false,
        verifiedAt: data.verified ? new Date().toISOString() : domain.verifiedAt,
        lastCheckedAt: new Date().toISOString(),
      };

      onActionComplete(updatedDomain);

      if (!data.verified) {
        setError('DNS not yet verified. Records may still be propagating.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Shared button styles ───────────────────────────────────────────────────

  const primaryBtn =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white text-xs font-semibold transition-colors';
  const secondaryBtn =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors';
  const dangerBtn =
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-red-400 text-white text-xs font-semibold transition-colors';

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        {/* ── pending ── */}
        {status === 'pending' && (
          <button onClick={() => void handleRegister()} disabled={loading} className={primaryBtn}>
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Registering…
              </>
            ) : (
              'Register with Vercel'
            )}
          </button>
        )}

        {/* ── registering ── */}
        {status === 'registering' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-xs font-medium">
            <Loader2 className="w-3 h-3 animate-spin" />
            Registering…
          </span>
        )}

        {/* ── registered ── */}
        {status === 'registered' && (
          <>
            <button onClick={() => void handleCheck()} disabled={loading} className={primaryBtn}>
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Checking…
                </>
              ) : (
                'Check DNS'
              )}
            </button>
            <button onClick={() => onViewDns(domain)} className={secondaryBtn}>
              View DNS
            </button>
          </>
        )}

        {/* ── verified ── */}
        {status === 'verified' && (
          <>
            <a
              href={`https://${domain.hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors"
            >
              Open
              <ExternalLink className="w-3 h-3" />
            </a>
            <button onClick={() => onViewDns(domain)} className={secondaryBtn}>
              View DNS
            </button>
          </>
        )}

        {/* ── failed ── */}
        {status === 'failed' && (
          <>
            <button onClick={() => void handleRegister()} disabled={loading} className={dangerBtn}>
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Re-registering…
                </>
              ) : (
                'Re-register'
              )}
            </button>
            <button onClick={() => onViewDns(domain)} className={secondaryBtn}>
              View Error
            </button>
          </>
        )}
      </div>

      {/* Inline error below buttons */}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 text-right max-w-[200px]">{error}</p>
      )}
    </div>
  );
}

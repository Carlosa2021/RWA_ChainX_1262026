'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import type { TenantDomain } from '@/lib/domains/types';
import { DomainStatusBadge } from '@/components/admin/DomainStatusBadge';
import { CopyField } from '@/components/admin/CopyField';

// ─────────────────────────────────────────────────────────────────────────────
// DnsInstructionsPanel — right-side slide-over for DNS record display.
//
// Supports all domain states:
//   pending    — no DNS records yet
//   registering — transient, should not open, shown defensively
//   registered — TXT + CNAME (or TXT + A-record note for apex)
//   verified   — read-only DNS records, verified timestamp
//   failed     — verificationError displayed with re-register prompt
//
// Vercel apex domain detection: cnameName === null means apex (A-record routing).
// ─────────────────────────────────────────────────────────────────────────────

interface DnsInstructionsPanelProps {
  /** null → panel is hidden */
  domain: TenantDomain | null;
  ownerAddress: string;
  onClose: () => void;
  /** Called when a check confirms verified: true */
  onVerified: (hostname: string) => void;
  /** Called after a successful inline check to propagate row update */
  onDomainUpdate?: (domain: TenantDomain) => void;
}

// ─── Check API response shape ─────────────────────────────────────────────────
interface CheckResponse {
  success: boolean;
  hostname?: string;
  verified?: boolean;
  status?: string;
  message?: string;
  error?: string;
}

// ─── Error message mapper ─────────────────────────────────────────────────────
function humanizeError(raw: string | null | undefined): string {
  if (!raw) return 'An unexpected error occurred.';
  if (raw.includes('domain_taken')) {
    return 'This domain is registered to a different Vercel project. Remove it from that project first, then re-register.';
  }
  if (raw.includes('domain_not_found')) {
    return 'This domain was removed from the Vercel project. Re-register to restore it.';
  }
  if (raw.includes('invalid_name') || raw.includes('vercel_error')) {
    return 'Vercel rejected this hostname. Verify the domain name is correct and try again.';
  }
  return raw;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DnsInstructionsPanel({
  domain,
  ownerAddress,
  onClose,
  onVerified,
  onDomainUpdate,
}: DnsInstructionsPanelProps) {
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checkSuccess, setCheckSuccess] = useState(false);

  // Reset per-session state whenever the domain changes
  // (derived reset — no useEffect needed; new domain clears stale state via
  // the key in the parent or by the panel closing and reopening)

  if (!domain) return null;

  const isApex = domain.cnameName === null && Boolean(domain.txtName);
  const hasDnsInstructions = Boolean(domain.txtName);
  const isRegistered = domain.verificationStatus === 'registered';
  const isVerified = domain.verificationStatus === 'verified';
  const isFailed = domain.verificationStatus === 'failed';

  const handleCheck = async () => {
    setChecking(true);
    setCheckError(null);
    setCheckSuccess(false);
    try {
      const res = await fetch('/api/admin/domains/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: domain.hostname, ownerAddress }),
      });
      const data = (await res.json()) as CheckResponse;

      if (!data.success) {
        setCheckError(data.error ?? 'Verification check failed. Please try again.');
        return;
      }

      if (data.verified) {
        setCheckSuccess(true);
        const updatedDomain: TenantDomain = {
          ...domain,
          verificationStatus: 'verified',
          verified: true,
          verifiedAt: new Date().toISOString(),
          lastCheckedAt: new Date().toISOString(),
        };
        onDomainUpdate?.(updatedDomain);
        onVerified(domain.hostname);
      } else {
        // DNS not yet propagated — update lastCheckedAt only
        const updatedDomain: TenantDomain = {
          ...domain,
          lastCheckedAt: new Date().toISOString(),
        };
        onDomainUpdate?.(updatedDomain);
        setCheckError(
          'DNS records are not verified yet. Add the required records and try again after propagation (15 min – 48 hours).'
        );
      }
    } catch {
      setCheckError('Network error. Please check your connection and try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              DNS Instructions
            </p>
            <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white truncate">
              {domain.hostname}
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {checkSuccess ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </span>
              ) : (
                <DomainStatusBadge status={domain.verificationStatus} />
              )}
              {domain.lastCheckedAt && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Checked {new Date(domain.lastCheckedAt).toLocaleString()}
                </span>
              )}
              {isVerified && domain.verifiedAt && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Verified {new Date(domain.verifiedAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 space-y-6">
          {/* ── Verified state ── */}
          {(isVerified || checkSuccess) && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Domain is verified and active
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  Traffic is being routed to this Vercel project.
                </p>
              </div>
            </div>
          )}

          {/* ── Failed state error ── */}
          {isFailed && domain.verificationError && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                  Registration failed
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {humanizeError(domain.verificationError)}
                </p>
              </div>
            </div>
          )}

          {/* ── No DNS records yet ── */}
          {!hasDnsInstructions && !isFailed && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <AlertCircle className="w-5 h-5 text-gray-400 shrink-0" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No DNS instructions available yet. Register this domain with Vercel first.
              </p>
            </div>
          )}

          {/* ── TXT record ── */}
          {domain.txtName && (
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                TXT Record — Ownership Verification
              </p>
              <div className="space-y-3">
                <CopyField label="Name" value={domain.txtName} />
                <CopyField label="Value" value={domain.txtValue} />
              </div>
            </div>
          )}

          {/* ── CNAME record (subdomain) ── */}
          {!isApex && domain.cnameName && domain.cnameValue && (
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                CNAME Record — Traffic Routing
              </p>
              <div className="space-y-3">
                <CopyField label="Name" value={domain.cnameName} />
                <CopyField label="Value" value={domain.cnameValue} />
              </div>
            </div>
          )}

          {/* ── Apex domain A-record note ── */}
          {isApex && (
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                A Record — Traffic Routing (Apex Domain)
              </p>
              <div className="space-y-3">
                <CopyField label="Name" value={domain.hostname} />
                <CopyField label="Value (Vercel IP)" value="76.76.21.21" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This is an apex domain. Use an A record instead of CNAME.
              </p>
            </div>
          )}

          {/* ── DNS propagation note ── */}
          {hasDnsInstructions && !isVerified && !checkSuccess && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              DNS changes can take 15 minutes to 48 hours to propagate globally.
            </p>
          )}

          {/* ── Inline check error ── */}
          {checkError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">{checkError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-800 shrink-0 flex flex-col gap-2">
          {/* Check Verification Now — only for registered status */}
          {isRegistered && !checkSuccess && (
            <button
              onClick={() => void handleCheck()}
              disabled={checking}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white text-sm font-semibold transition-colors"
            >
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking…
                </>
              ) : (
                'Check Verification Now'
              )}
            </button>
          )}

          {/* Open domain link — for verified domains */}
          {(isVerified || checkSuccess) && (
            <a
              href={`https://${domain.hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open {domain.hostname}
            </a>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

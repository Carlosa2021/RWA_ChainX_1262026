import type { DomainVerificationStatus } from '@/lib/domains/types';
import { Clock, RefreshCw, Globe, CheckCircle, XCircle } from 'lucide-react';

// ─── Status style map ─────────────────────────────────────────────────────────

const STATUS_STYLES: Record<
  DomainVerificationStatus,
  { label: string; cls: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pending',
    cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
    icon: Clock,
  },
  registering: {
    label: 'Registering',
    cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    icon: RefreshCw,
  },
  registered: {
    label: 'DNS Pending',
    cls: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
    icon: Globe,
  },
  verified: {
    label: 'Verified',
    cls: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    cls: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50',
    icon: XCircle,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DomainStatusBadge({ status }: { status: DomainVerificationStatus }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${s.cls}`}
    >
      <Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

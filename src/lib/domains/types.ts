/**
 * TenantDomain types — Sprint 7.2 Custom Domains Foundation
 *
 * Designed for forward compatibility with:
 * - Sprint 8: Tenant persistence (DB-backed domain store)
 * - Sprint 9: Vercel Domains API integration
 * - Sprint 9.2A: Domain model extension (Vercel fields added)
 */

/**
 * Verification lifecycle states.
 *
 * pending     — registered in ChainX DB only; no Vercel registration yet
 * registering — Vercel API call in progress (transient; not stored long-term)
 * registered  — Vercel has the domain; DNS records issued; awaiting DNS propagation
 * verified    — DNS verified by Vercel; domain is active for tenant routing
 * failed      — verification failed (DNS mismatch, Vercel error, etc.)
 */
export type DomainVerificationStatus =
  | 'pending'
  | 'registering'
  | 'registered'
  | 'verified'
  | 'failed';

export interface TenantDomain {
  /** The fully-qualified hostname (e.g. "invest.alzira.com") */
  hostname: string;

  /** ID of the tenant this domain belongs to */
  tenantId: string;

  /** Whether the domain has passed DNS verification */
  verified: boolean;

  /** Granular verification state for UI/API responses */
  verificationStatus: DomainVerificationStatus;

  /** ISO 8601 timestamp — when the domain was registered in the system */
  createdAt: string;

  // ── Vercel Domains API fields (Sprint 9.2B) — optional, null before Vercel integration ──

  /** Vercel's internal domain registration identifier */
  vercelDomainId?: string;

  /** DNS TXT record name to create for verification (e.g. "_vercel") */
  txtName?: string;

  /** DNS TXT record value (verification token issued by Vercel) */
  txtValue?: string;

  /** DNS CNAME record name (for subdomain delegation) */
  cnameName?: string;

  /** DNS CNAME record value (Vercel target, e.g. "cname.vercel-dns.com") */
  cnameValue?: string;

  // ── Verification lifecycle fields ──

  /** ISO 8601 timestamp — when verification was confirmed by Vercel */
  verifiedAt?: string;

  /** Last error message from Vercel when verification failed */
  verificationError?: string;

  /** ISO 8601 timestamp — when Vercel was last polled for this domain's status */
  lastCheckedAt?: string;

  // ── Audit fields ──

  /** Wallet address of the PLATFORM_ADMIN who registered this domain */
  createdBy?: string;

  /** ISO 8601 timestamp — when this record was last modified */
  updatedAt?: string;
}

/**
 * TenantDomain types — Sprint 7.2 Custom Domains Foundation
 *
 * Designed for forward compatibility with:
 * - Sprint 8: Tenant persistence (DB-backed domain store)
 * - Sprint 9: Vercel Domains API integration
 */

export type DomainVerificationStatus = 'pending' | 'verified' | 'failed';

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
}

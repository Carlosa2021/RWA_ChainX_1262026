/**
 * Domain Registry — Sprint 7.2 Custom Domains Foundation
 *
 * Static in-memory mock registry of all known tenant domains.
 * No database. No Vercel Domains API. No DNS lookups.
 *
 * Sprint 8 will replace this with a DB-backed store.
 * Sprint 9 will add Vercel Domains API integration.
 *
 * One tenant may own multiple hostnames (primary + aliases).
 * The registry is keyed by hostname for O(1) lookup.
 */
import type { TenantDomain } from './types';

const DOMAIN_LIST: TenantDomain[] = [
  {
    hostname: 'app.chainx.ch',
    tenantId: 'chainx',
    verified: true,
    verificationStatus: 'verified',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    hostname: 'invest.alzira.com',
    tenantId: 'alzira',
    verified: true,
    verificationStatus: 'verified',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    hostname: 'portal.fundx.io',
    tenantId: 'fundx',
    verified: false,
    verificationStatus: 'pending',
    createdAt: '2025-06-10T00:00:00Z',
  },
];

/**
 * Hostname-keyed map for O(1) resolution.
 * Built once at module load — safe for Edge/SSR environments.
 */
export const DOMAINS: Record<string, TenantDomain> = Object.fromEntries(
  DOMAIN_LIST.map((d) => [d.hostname, d])
);

/**
 * resolveTenant — Sprint 7.1 Tenant Foundation
 *
 * Resolves a TenantConfig from a hostname.
 * Called server-side from layout.tsx using `headers()`.
 *
 * Resolution order:
 * 1. Exact hostname match in TENANTS registry
 * 2. Fallback: ChainX default tenant ("app.chainx.ch")
 *
 * No wildcard matching. No database lookups.
 * Sprint 7.2 will add wildcard subdomain support.
 */
import { TENANTS } from './registry';
import type { TenantConfig } from './types';

const FALLBACK_HOSTNAME = 'app.chainx.ch';

export function resolveTenant(hostname: string): TenantConfig {
  // Strip port if present (e.g. "localhost:3004" → "localhost:3004" stays,
  // but "app.chainx.ch:443" → "app.chainx.ch")
  const normalizedHostname = hostname.split(':')[0];

  return TENANTS[normalizedHostname] ?? TENANTS[hostname] ?? TENANTS[FALLBACK_HOSTNAME];
}

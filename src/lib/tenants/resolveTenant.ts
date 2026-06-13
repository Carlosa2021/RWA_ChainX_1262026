/**
 * resolveTenant — Sprint 7.2 Custom Domains Foundation
 *
 * Resolves a TenantConfig from a hostname via the domain layer.
 * Called server-side from layout.tsx using `headers()`.
 *
 * Resolution order (hostname → domain → tenant):
 * 1. resolveDomain(hostname) → TenantDomain (hostname-keyed registry)
 * 2. TENANTS[domain.tenantId] → TenantConfig
 * 3. Fallback: ChainX default tenant ("chainx")
 *
 * No wildcard matching. No database lookups.
 * Sprint 8 will add DB-backed domain + tenant resolution.
 */
import { TENANTS } from './registry';
import { resolveDomain } from '../domains/resolveDomain';
import type { TenantConfig } from './types';

const FALLBACK_TENANT_ID = 'chainx';

export function resolveTenant(hostname: string): TenantConfig {
  // Step 1: resolve domain record from hostname (includes port normalization)
  const domain = resolveDomain(hostname);

  // Step 2: if domain found, look up its tenant
  if (domain) {
    const tenant = TENANTS[domain.tenantId];
    if (tenant) return tenant;
  }

  // Step 3: fallback to ChainX default tenant
  return TENANTS[FALLBACK_TENANT_ID];
}

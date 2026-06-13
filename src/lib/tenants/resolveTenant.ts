/**
 * resolveTenant — Sprint 8A Persistence Abstraction Layer
 *
 * Resolves a TenantConfig from a hostname via the repository layer.
 * Called server-side from layout.tsx using `headers()`.
 *
 * Resolution order (hostname → domain → tenant):
 * 1. domainRepository.getDomain(hostname) → TenantDomain
 * 2. tenantRepository.getTenantById(domain.tenantId) → TenantConfig
 * 3. Fallback: tenantRepository.getTenantById("chainx")
 *
 * To swap data source: replace implementations in repositories/index.ts.
 * Business logic here never changes when switching Mock → DB.
 */
import { domainRepository, tenantRepository } from '@/lib/repositories';
import type { TenantConfig } from './types';

const FALLBACK_TENANT_ID = 'chainx';

export function resolveTenant(hostname: string): TenantConfig {
  // Step 1: resolve domain record via repository (handles port normalization)
  const domain = domainRepository.getDomain(hostname);

  // Step 2: if domain found, look up its tenant via repository
  if (domain) {
    const tenant = tenantRepository.getTenantById(domain.tenantId);
    if (tenant) return tenant;
  }

  // Step 3: fallback to ChainX default tenant
  return tenantRepository.getTenantById(FALLBACK_TENANT_ID)!;
}

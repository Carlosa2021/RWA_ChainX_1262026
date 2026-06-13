/**
 * MockTenantRepository — Sprint 8A Persistence Abstraction Layer
 *
 * In-memory implementation of ITenantRepository backed by the static
 * TENANTS registry (src/lib/tenants/registry.ts).
 *
 * Implements the full ITenantRepository contract so the business logic
 * layer never imports the raw registry directly.
 *
 * saveTenant() is a no-op: the static registry is read-only.
 * Sprint 8B will replace this class with a DB-backed implementation.
 */
import { TENANTS } from '@/lib/tenants/registry';
import type { TenantConfig } from '@/lib/tenants/types';
import type { ITenantRepository } from './types';

export class MockTenantRepository implements ITenantRepository {
  getTenantById(id: string): TenantConfig | undefined {
    return TENANTS[id];
  }

  getTenantByHostname(hostname: string): TenantConfig | undefined {
    const normalized = hostname.split(':')[0].toLowerCase();
    return Object.values(TENANTS).find((t) => t.hostname === normalized || t.hostname === hostname);
  }

  listTenants(): TenantConfig[] {
    return Object.values(TENANTS);
  }

  // Mock: no persistence — static registry is read-only at this tier.
  // Sprint 8B will implement real upsert logic here.
  saveTenant(_config: TenantConfig): void {
    // no-op
  }
}

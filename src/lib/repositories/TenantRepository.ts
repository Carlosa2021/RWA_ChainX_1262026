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
  // ── Read ────────────────────────────────────────────────────────────────

  async getTenantById(id: string): Promise<TenantConfig | undefined> {
    return TENANTS[id];
  }

  async getTenantByHostname(hostname: string): Promise<TenantConfig | undefined> {
    const normalized = hostname.split(':')[0].toLowerCase();
    return Object.values(TENANTS).find((t) => t.hostname === normalized || t.hostname === hostname);
  }

  async listTenants(): Promise<TenantConfig[]> {
    return Object.values(TENANTS);
  }

  // ── Write — no-op: static registry is read-only in Mock mode ─────────────

  async createTenant(_config: TenantConfig): Promise<void> {
    // no-op
  }

  async updateTenant(
    _id: string,
    _updates: Partial<Omit<TenantConfig, 'id'>>
  ): Promise<TenantConfig | undefined> {
    return undefined;
  }

  async saveTenant(_config: TenantConfig): Promise<void> {
    // no-op
  }

  async saveBranding(_tenantId: string, _config: Record<string, unknown>): Promise<void> {
    // no-op
  }
}

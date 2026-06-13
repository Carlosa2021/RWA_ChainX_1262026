/**
 * Repository Contracts — Sprint 8A Persistence Abstraction Layer
 *
 * These interfaces define the public API for data access.
 * Business logic depends ONLY on these contracts — never on concrete
 * registry objects or future DB clients directly.
 *
 * Current implementations: Mock (in-memory static registries)
 * Future implementations:  Postgres, Supabase, PlanetScale, etc.
 */
import type { TenantConfig } from '@/lib/tenants/types';
import type { TenantDomain } from '@/lib/domains/types';

// ─────────────────────────────────────────────────────────────────────────────
// Tenant Repository
// ─────────────────────────────────────────────────────────────────────────────

export interface ITenantRepository {
  /** Look up a tenant by its unique ID (e.g. "chainx", "alzira") */
  getTenantById(id: string): TenantConfig | undefined;

  /** Look up a tenant by its primary hostname (e.g. "app.chainx.ch") */
  getTenantByHostname(hostname: string): TenantConfig | undefined;

  /** Return all registered tenants */
  listTenants(): TenantConfig[];

  /**
   * Persist a tenant configuration.
   * Mock implementation: no-op (data is static).
   * Real implementation: upsert to DB.
   */
  saveTenant(config: TenantConfig): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain Repository
// ─────────────────────────────────────────────────────────────────────────────

export interface IDomainRepository {
  /**
   * Look up a domain record by hostname.
   * Normalizes port suffix before lookup.
   * Returns undefined if not found.
   */
  getDomain(hostname: string): TenantDomain | undefined;

  /** Return all registered domain records */
  listDomains(): TenantDomain[];

  /**
   * Persist a domain record.
   * Mock implementation: no-op (data is static).
   * Real implementation: upsert to DB.
   */
  saveDomain(domain: TenantDomain): void;
}

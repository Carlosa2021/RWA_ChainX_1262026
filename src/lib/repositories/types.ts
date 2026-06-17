/**
 * Repository Contracts — Sprint 8C Tenant Management Write Layer
 *
 * These interfaces define the public API for data access.
 * Business logic depends ONLY on these contracts — never on concrete
 * registry objects or future DB clients directly.
 *
 * Current implementations: Mock (in-memory static registries)
 *                           Postgres (@vercel/postgres)
 */
import type { TenantConfig } from '@/lib/tenants/types';
import type { TenantDomain, DomainVerificationStatus } from '@/lib/domains/types';

export type { DomainVerificationStatus };

// ─────────────────────────────────────────────────────────────────────────────
// Tenant Repository
// ─────────────────────────────────────────────────────────────────────────────

export interface ITenantRepository {
  // ── Read ──────────────────────────────────────────────────────────────────

  /** Look up a tenant by its unique ID (e.g. "chainx", "alzira") */
  getTenantById(id: string): Promise<TenantConfig | undefined>;

  /** Look up a tenant by its primary hostname (e.g. "app.chainx.ch") */
  getTenantByHostname(hostname: string): Promise<TenantConfig | undefined>;

  /** Return all registered tenants */
  listTenants(): Promise<TenantConfig[]>;

  // ── Write ─────────────────────────────────────────────────────────────────

  /**
   * Create a new tenant. Throws on duplicate id.
   * Mock: no-op. Postgres: INSERT.
   */
  createTenant(config: TenantConfig): Promise<void>;

  /**
   * Update a tenant by ID. Returns the updated config, or undefined if not found.
   * Mock: no-op (returns undefined). Postgres: UPDATE.
   */
  updateTenant(
    id: string,
    updates: Partial<Omit<TenantConfig, 'id'>>
  ): Promise<TenantConfig | undefined>;

  /**
   * Upsert a tenant configuration. Inserts if not exists, updates if exists.
   * Mock: no-op. Postgres: INSERT ... ON CONFLICT DO UPDATE.
   */
  saveTenant(config: TenantConfig): Promise<void>;

  /**
   * Persist visual branding overrides (JSONB) for a tenant.
   * Only visual/presentational fields are accepted — structural fields are ignored.
   * Mock: no-op. Postgres: upsert to tenant_branding.
   */
  saveBranding(tenantId: string, config: Record<string, unknown>): Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Domain Repository
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Data returned by Vercel Domains API when a domain is registered.
 * Stored in tenant_domains for use during the verification step.
 * Sprint 9.2B will populate these fields via POST /api/admin/domains/register.
 */
export interface VercelRegistrationData {
  /** Vercel's internal domain registration identifier */
  vercelDomainId: string;
  /** DNS TXT record name to create (e.g. "_vercel") */
  txtName: string;
  /** DNS TXT record value (verification token) */
  txtValue: string;
  /** DNS CNAME record name (null for apex domains) */
  cnameName: string | null;
  /** DNS CNAME record value (null for apex domains) */
  cnameValue: string | null;
  /** Operator wallet address for audit */
  createdBy?: string;
}

export interface IDomainRepository {
  // ── Read ──────────────────────────────────────────────────────────────────

  /**
   * Look up a domain record by hostname.
   * Normalizes port suffix before lookup.
   * Returns undefined if not found.
   */
  getDomain(hostname: string): Promise<TenantDomain | undefined>;

  /** Return all registered domain records */
  listDomains(): Promise<TenantDomain[]>;

  // ── Write ─────────────────────────────────────────────────────────────────

  /**
   * Create a new domain record. Throws on duplicate hostname.
   * Mock: no-op. Postgres: INSERT.
   */
  createDomain(domain: TenantDomain): Promise<void>;

  /**
   * Update a domain record by hostname.
   * Returns the updated record, or undefined if not found.
   * Mock: no-op (returns undefined). Postgres: UPDATE.
   */
  updateDomain(
    hostname: string,
    updates: Partial<Omit<TenantDomain, 'hostname'>>
  ): Promise<TenantDomain | undefined>;

  /**
   * Upsert a domain record. Inserts if not exists, updates if exists.
   * Mock: no-op. Postgres: INSERT ... ON CONFLICT DO UPDATE.
   */
  saveDomain(domain: TenantDomain): Promise<void>;

  /**
   * Store the result of a Vercel Domains API registration call.
   * Persists vercel_domain_id, DNS TXT/CNAME records, and audit fields.
   * Called by POST /api/admin/domains/register (Sprint 9.2B).
   * Mock: no-op. Postgres: UPDATE.
   */
  setVercelRegistration(hostname: string, data: VercelRegistrationData): Promise<void>;

  /**
   * Update domain verification status after polling Vercel API.
   * Also updates verified flag, verified_at, verification_error, and last_checked_at.
   * Called by POST /api/admin/domains/check (Sprint 9.3).
   * Mock: no-op. Postgres: UPDATE.
   */
  setVerificationStatus(
    hostname: string,
    status: DomainVerificationStatus,
    meta?: {
      verifiedAt?: string;
      verificationError?: string;
      lastCheckedAt?: string;
    }
  ): Promise<void>;
}

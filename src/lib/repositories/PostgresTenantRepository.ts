/**
 * PostgresTenantRepository — Sprint 8B Vercel Postgres Persistence
 *
 * Implements ITenantRepository using @vercel/postgres.
 * All queries are parameterized via tagged template literals.
 * No string concatenation. No dynamic SQL.
 *
 * READ-ONLY: write methods throw — Sprint 8C will implement admin writes.
 *
 * Architecture: Domain → Tenant → Branding (one-way dependency).
 * `hostname` is a STRUCTURAL routing field — owned by tenant_domains.
 * The branding JSONB config may ONLY override visual/presentational fields.
 * Structural fields (id, hostname) are never readable from branding config.
 *
 * Row shape:
 *   id, primary_hostname (from tenant_domains), brand_name, brand_url,
 *   support_email, primary_color, secondary_color, favicon_url,
 *   show_infra_notice, branding_config (JSONB — visual overrides only)
 */
import { sql } from '@/lib/db/client';
import type { TenantConfig } from '@/lib/tenants/types';
import type { ITenantRepository } from './types';

interface TenantRow {
  id: string;
  /** Authoritative primary hostname from tenant_domains — never from branding JSONB */
  primary_hostname: string;
  brand_name: string;
  brand_url: string;
  support_email: string;
  primary_color: string;
  secondary_color: string;
  favicon_url: string | null;
  show_infra_notice: boolean;
  plan: string;
  /** Visual-only overrides — structural fields are blocked in rowToTenantConfig */
  branding_config: Record<string, unknown> | null;
}

/**
 * Maps a DB row to TenantConfig.
 *
 * Structural fields (id, hostname) come EXCLUSIVELY from authoritative DB columns.
 * branding_config JSONB may only override visual/presentational fields:
 *   brandName, brandUrl, supportEmail, primaryColor, secondaryColor,
 *   faviconUrl, showInfraNotice
 *
 * hostname and id are NEVER readable from branding_config. Any attempt to
 * set them via JSONB is silently ignored — the authoritative column wins.
 */
function rowToTenantConfig(row: TenantRow): TenantConfig {
  const overrides = row.branding_config ?? {};
  return {
    // STRUCTURAL — authoritative source only, no JSONB override possible
    id: row.id,
    hostname: row.primary_hostname,
    plan: row.plan as 'starter' | 'pro' | 'enterprise',

    // VISUAL — branding JSONB may override these
    brandName: (overrides.brandName as string | undefined) ?? row.brand_name,
    brandUrl: (overrides.brandUrl as string | undefined) ?? row.brand_url,
    supportEmail: (overrides.supportEmail as string | undefined) ?? row.support_email,
    primaryColor: (overrides.primaryColor as string | undefined) ?? row.primary_color,
    secondaryColor: (overrides.secondaryColor as string | undefined) ?? row.secondary_color,
    faviconUrl: (overrides.faviconUrl as string | undefined) ?? row.favicon_url ?? undefined,
    showInfraNotice:
      typeof overrides.showInfraNotice === 'boolean'
        ? overrides.showInfraNotice
        : row.show_infra_notice,

    // VISUAL BRANDING JSONB-only — no column in tenants table
    logoUrl: (overrides.logoUrl as string | undefined) ?? undefined,
    tagline: (overrides.tagline as string | undefined) ?? undefined,
  };
}

export class PostgresTenantRepository implements ITenantRepository {
  async getTenantById(id: string): Promise<TenantConfig | undefined> {
    const result = await sql<TenantRow>`
      SELECT
        t.id,
        COALESCE(
          (SELECT td2.hostname FROM tenant_domains td2
           WHERE td2.tenant_id = t.id ORDER BY td2.created_at ASC LIMIT 1),
          t.id
        ) AS primary_hostname,
        t.brand_name,
        t.brand_url,
        t.support_email,
        t.primary_color,
        t.secondary_color,
        t.favicon_url,
        t.show_infra_notice,
        t.plan,
        tb.config AS branding_config
      FROM tenants t
      LEFT JOIN tenant_branding tb ON tb.tenant_id = t.id
      WHERE t.id = ${id}
      LIMIT 1
    `;
    const row = result.rows[0];
    return row ? rowToTenantConfig(row) : undefined;
  }

  async getTenantByHostname(hostname: string): Promise<TenantConfig | undefined> {
    const normalized = hostname.split(':')[0].toLowerCase();
    const result = await sql<TenantRow>`
      SELECT
        t.id,
        td.hostname AS primary_hostname,
        t.brand_name,
        t.brand_url,
        t.support_email,
        t.primary_color,
        t.secondary_color,
        t.favicon_url,
        t.show_infra_notice,
        t.plan,
        tb.config AS branding_config
      FROM tenants t
      JOIN tenant_domains td ON td.tenant_id = t.id
      LEFT JOIN tenant_branding tb ON tb.tenant_id = t.id
      WHERE td.hostname = ${normalized}
      LIMIT 1
    `;
    const row = result.rows[0];
    return row ? rowToTenantConfig(row) : undefined;
  }

  async listTenants(): Promise<TenantConfig[]> {
    const result = await sql<TenantRow>`
      SELECT
        t.id,
        COALESCE(
          (SELECT td2.hostname FROM tenant_domains td2
           WHERE td2.tenant_id = t.id ORDER BY td2.created_at ASC LIMIT 1),
          t.id
        ) AS primary_hostname,
        t.brand_name,
        t.brand_url,
        t.support_email,
        t.primary_color,
        t.secondary_color,
        t.favicon_url,
        t.show_infra_notice,
        t.plan,
        tb.config AS branding_config
      FROM tenants t
      LEFT JOIN tenant_branding tb ON tb.tenant_id = t.id
      ORDER BY t.created_at ASC
    `;
    return result.rows.map(rowToTenantConfig);
  }

  // ── Write ───────────────────────────────────────────────────────────────────

  async createTenant(config: TenantConfig): Promise<void> {
    await sql`
      INSERT INTO tenants (
        id, brand_name, brand_url, support_email,
        primary_color, secondary_color, favicon_url, show_infra_notice, plan
      )
      VALUES (
        ${config.id},
        ${config.brandName},
        ${config.brandUrl},
        ${config.supportEmail},
        ${config.primaryColor},
        ${config.secondaryColor},
        ${config.faviconUrl ?? null},
        ${config.showInfraNotice},
        ${config.plan}
      )
    `;
    // future audit event: { actor, action: 'tenant.create', target: config.id, ts: Date.now() }
  }

  async updateTenant(
    id: string,
    updates: Partial<Omit<TenantConfig, 'id'>>
  ): Promise<TenantConfig | undefined> {
    const current = await this.getTenantById(id);
    if (!current) return undefined;
    const merged = { ...current, ...updates };
    await sql`
      UPDATE tenants SET
        brand_name        = ${merged.brandName},
        brand_url         = ${merged.brandUrl},
        support_email     = ${merged.supportEmail},
        primary_color     = ${merged.primaryColor},
        secondary_color   = ${merged.secondaryColor},
        favicon_url       = ${merged.faviconUrl ?? null},
        show_infra_notice = ${merged.showInfraNotice},
        plan              = ${merged.plan},
        updated_at        = now()
      WHERE id = ${id}
    `;
    // future audit event: { actor, action: 'tenant.update', target: id, ts: Date.now() }
    return this.getTenantById(id);
  }

  async saveTenant(config: TenantConfig): Promise<void> {
    await sql`
      INSERT INTO tenants (
        id, brand_name, brand_url, support_email,
        primary_color, secondary_color, favicon_url, show_infra_notice, plan
      )
      VALUES (
        ${config.id},
        ${config.brandName},
        ${config.brandUrl},
        ${config.supportEmail},
        ${config.primaryColor},
        ${config.secondaryColor},
        ${config.faviconUrl ?? null},
        ${config.showInfraNotice},
        ${config.plan}
      )
      ON CONFLICT (id) DO UPDATE SET
        brand_name        = EXCLUDED.brand_name,
        brand_url         = EXCLUDED.brand_url,
        support_email     = EXCLUDED.support_email,
        primary_color     = EXCLUDED.primary_color,
        secondary_color   = EXCLUDED.secondary_color,
        favicon_url       = EXCLUDED.favicon_url,
        show_infra_notice = EXCLUDED.show_infra_notice,
        plan              = EXCLUDED.plan,
        updated_at        = now()
    `;
    // future audit event: { actor, action: 'tenant.save', target: config.id, ts: Date.now() }
  }

  async saveBranding(tenantId: string, config: Record<string, unknown>): Promise<void> {
    // Strip structural fields — branding JSONB is visual-only
    const {
      id: _id,
      hostname: _hostname,
      tenantId: _tenantId,
      ...visualConfig
    } = config as Record<string, unknown>;
    void _id;
    void _hostname;
    void _tenantId;
    const configJson = JSON.stringify(visualConfig);
    await sql`
      INSERT INTO tenant_branding (tenant_id, config, updated_at)
      VALUES (${tenantId}, ${configJson}::jsonb, now())
      ON CONFLICT (tenant_id) DO UPDATE SET
        config     = EXCLUDED.config,
        updated_at = now()
    `;
    // future audit event: { actor, action: 'branding.save', target: tenantId, ts: Date.now() }
  }
}

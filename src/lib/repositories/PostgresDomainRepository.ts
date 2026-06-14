/**
 * PostgresDomainRepository — Sprint 8B Vercel Postgres Persistence
 *
 * Implements IDomainRepository using @vercel/postgres.
 * All queries are parameterized via tagged template literals.
 * No string concatenation. No dynamic SQL.
 *
 * READ-ONLY: write methods throw — Sprint 8C will implement admin writes.
 */
import { sql } from '@/lib/db/client';
import type { TenantDomain, DomainVerificationStatus } from '@/lib/domains/types';
import type { IDomainRepository } from './types';

interface DomainRow {
  hostname: string;
  tenant_id: string;
  verified: boolean;
  verification_status: string;
  created_at: string;
}

function rowToDomain(row: DomainRow): TenantDomain {
  return {
    hostname: row.hostname,
    tenantId: row.tenant_id,
    verified: row.verified,
    verificationStatus: row.verification_status as DomainVerificationStatus,
    createdAt: row.created_at,
  };
}

export class PostgresDomainRepository implements IDomainRepository {
  async getDomain(hostname: string): Promise<TenantDomain | undefined> {
    const normalized = hostname.split(':')[0].toLowerCase();
    const result = await sql<DomainRow>`
      SELECT
        hostname,
        tenant_id,
        verified,
        verification_status,
        created_at::text
      FROM tenant_domains
      WHERE hostname = ${normalized}
      LIMIT 1
    `;
    const row = result.rows[0];
    return row ? rowToDomain(row) : undefined;
  }

  async listDomains(): Promise<TenantDomain[]> {
    const result = await sql<DomainRow>`
      SELECT
        hostname,
        tenant_id,
        verified,
        verification_status,
        created_at::text
      FROM tenant_domains
      ORDER BY created_at ASC
    `;
    return result.rows.map(rowToDomain);
  }

  // ── Write ───────────────────────────────────────────────────────────────────

  async createDomain(domain: TenantDomain): Promise<void> {
    await sql`
      INSERT INTO tenant_domains (
        hostname, tenant_id, verified, verification_status, created_at
      )
      VALUES (
        ${domain.hostname},
        ${domain.tenantId},
        ${domain.verified},
        ${domain.verificationStatus},
        ${domain.createdAt}
      )
    `;
    // future audit event: { actor, action: 'domain.create', target: domain.hostname, ts: Date.now() }
  }

  async updateDomain(
    hostname: string,
    updates: Partial<Omit<TenantDomain, 'hostname'>>
  ): Promise<TenantDomain | undefined> {
    const current = await this.getDomain(hostname);
    if (!current) return undefined;
    const merged = { ...current, ...updates };
    await sql`
      UPDATE tenant_domains SET
        tenant_id           = ${merged.tenantId},
        verified            = ${merged.verified},
        verification_status = ${merged.verificationStatus}
      WHERE hostname = ${hostname}
    `;
    // future audit event: { actor, action: 'domain.update', target: hostname, ts: Date.now() }
    return this.getDomain(hostname);
  }

  async saveDomain(domain: TenantDomain): Promise<void> {
    await sql`
      INSERT INTO tenant_domains (
        hostname, tenant_id, verified, verification_status, created_at
      )
      VALUES (
        ${domain.hostname},
        ${domain.tenantId},
        ${domain.verified},
        ${domain.verificationStatus},
        ${domain.createdAt}
      )
      ON CONFLICT (hostname) DO UPDATE SET
        tenant_id           = EXCLUDED.tenant_id,
        verified            = EXCLUDED.verified,
        verification_status = EXCLUDED.verification_status
    `;
    // future audit event: { actor, action: 'domain.save', target: domain.hostname, ts: Date.now() }
  }
}

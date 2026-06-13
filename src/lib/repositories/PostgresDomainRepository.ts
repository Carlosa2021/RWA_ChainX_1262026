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

  // Sprint 8C: implement domain registration flow
  saveDomain(_domain: TenantDomain): void {
    throw new Error('PostgresDomainRepository.saveDomain: not implemented — Sprint 8C');
  }
}

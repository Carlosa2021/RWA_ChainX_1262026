/**
 * MockDomainRepository — Sprint 8A Persistence Abstraction Layer
 *
 * In-memory implementation of IDomainRepository backed by the static
 * DOMAINS registry (src/lib/domains/registry.ts).
 *
 * Implements the full IDomainRepository contract so the business logic
 * layer never imports the raw registry directly.
 *
 * saveDomain() is a no-op: the static registry is read-only.
 * Sprint 8B will replace this class with a DB-backed implementation.
 */
import { DOMAINS } from '@/lib/domains/registry';
import type { TenantDomain } from '@/lib/domains/types';
import type { IDomainRepository } from './types';

export class MockDomainRepository implements IDomainRepository {
  // ── Read ────────────────────────────────────────────────────────────────

  async getDomain(hostname: string): Promise<TenantDomain | undefined> {
    const normalized = hostname.split(':')[0].toLowerCase();
    return DOMAINS[normalized];
  }

  async listDomains(): Promise<TenantDomain[]> {
    return Object.values(DOMAINS);
  }

  // ── Write — no-op: static registry is read-only in Mock mode ─────────────

  async createDomain(_domain: TenantDomain): Promise<void> {
    // no-op
  }

  async updateDomain(
    _hostname: string,
    _updates: Partial<Omit<TenantDomain, 'hostname'>>
  ): Promise<TenantDomain | undefined> {
    return undefined;
  }

  async saveDomain(_domain: TenantDomain): Promise<void> {
    // no-op
  }
}

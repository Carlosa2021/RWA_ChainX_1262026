/**
 * Repository Index — Sprint 8B Vercel Postgres Persistence Layer
 *
 * Env-based switching: if POSTGRES_URL is set → Postgres implementations,
 * otherwise → Mock (in-memory) implementations.
 *
 * Business logic (resolveTenant, resolveDomain, route handlers) imports from
 * here and never depends on concrete classes directly.
 *
 * To add a new backend: implement ITenantRepository / IDomainRepository and
 * add a condition below. Zero changes required elsewhere.
 */
import { MockTenantRepository } from './TenantRepository';
import { MockDomainRepository } from './DomainRepository';
import { PostgresTenantRepository } from './PostgresTenantRepository';
import { PostgresDomainRepository } from './PostgresDomainRepository';
import type { ITenantRepository, IDomainRepository } from './types';

const usePostgres = Boolean(process.env.POSTGRES_URL);

export const tenantRepository: ITenantRepository = usePostgres
  ? new PostgresTenantRepository()
  : new MockTenantRepository();

export const domainRepository: IDomainRepository = usePostgres
  ? new PostgresDomainRepository()
  : new MockDomainRepository();

// Re-export interfaces for consumer convenience
export type { ITenantRepository, IDomainRepository };

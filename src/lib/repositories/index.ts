/**
 * Repository Index — Sprint 8A Persistence Abstraction Layer
 *
 * Single import point for all repository singletons.
 * Business logic imports from here — never from concrete classes directly.
 *
 * To swap implementations (e.g. Mock → Postgres):
 * 1. Create a new class implementing ITenantRepository / IDomainRepository
 * 2. Replace the instantiation below
 * 3. Zero changes to business logic
 */
import { MockTenantRepository } from './TenantRepository';
import { MockDomainRepository } from './DomainRepository';
import type { ITenantRepository, IDomainRepository } from './types';

export const tenantRepository: ITenantRepository = new MockTenantRepository();
export const domainRepository: IDomainRepository = new MockDomainRepository();

// Re-export interfaces for consumer convenience
export type { ITenantRepository, IDomainRepository };

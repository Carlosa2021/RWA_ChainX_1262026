/**
 * resolveDomain — Sprint 8A Persistence Abstraction Layer
 *
 * Resolves a TenantDomain from a raw hostname string via DomainRepository.
 * Called server-side only (compatible with Next.js App Router + headers()).
 * No window access. No client-side assumptions.
 *
 * Resolution steps:
 * 1. Delegate to domainRepository.getDomain() — port stripping + normalization
 *    handled inside the repository implementation.
 * 2. Return domain record, or undefined if not found.
 *
 * To swap data source: replace MockDomainRepository in repositories/index.ts.
 */
import { domainRepository } from '@/lib/repositories';
import type { TenantDomain } from './types';

/**
 * Resolve a TenantDomain from a raw hostname.
 * Returns `undefined` if no matching domain is registered.
 * Callers must handle the undefined case (e.g. fallback to default tenant).
 */
export function resolveDomain(hostname: string): TenantDomain | undefined {
  return domainRepository.getDomain(hostname);
}

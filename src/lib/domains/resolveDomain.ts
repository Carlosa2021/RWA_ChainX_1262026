/**
 * resolveDomain — Sprint 7.2 Custom Domains Foundation
 *
 * Resolves a TenantDomain from a raw hostname string.
 * Called server-side only (compatible with Next.js App Router + headers()).
 * No window access. No client-side assumptions.
 *
 * Resolution steps:
 * 1. Strip port suffix (e.g. "app.chainx.ch:3004" → "app.chainx.ch")
 * 2. Lowercase normalize
 * 3. Exact match in DOMAINS registry
 * 4. Return undefined if not found (caller decides fallback)
 */
import { DOMAINS } from './registry';
import type { TenantDomain } from './types';

/**
 * Normalize a raw hostname by stripping the port.
 * e.g. "app.chainx.ch:443" → "app.chainx.ch"
 * e.g. "localhost:3004" → "localhost"
 */
function normalizeHostname(raw: string): string {
  return raw.split(':')[0].toLowerCase();
}

/**
 * Resolve a TenantDomain from a raw hostname.
 * Returns `undefined` if no matching domain is registered.
 * Callers must handle the undefined case (e.g. fallback to default tenant).
 */
export function resolveDomain(hostname: string): TenantDomain | undefined {
  const normalized = normalizeHostname(hostname);
  return DOMAINS[normalized];
}

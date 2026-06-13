/**
 * TenantConfig — Sprint 7.1 Tenant Foundation
 *
 * Designed for forward compatibility with:
 * - Sprint 7.2: Custom domain provisioning
 * - Sprint 8: Tenant persistence
 */
export interface TenantConfig {
  /** Unique tenant identifier */
  id: string;

  /** Resolved hostname (matches the registry key) */
  hostname: string;

  /** Brand display name shown in UI */
  brandName: string;

  /** Canonical URL for the tenant deployment */
  brandUrl: string;

  /** Public support email address */
  supportEmail: string;

  /** Primary brand color (hex) */
  primaryColor: string;

  /** Secondary / background brand color (hex) */
  secondaryColor: string;

  /** Custom favicon URL (optional) */
  faviconUrl?: string;

  /** Show "Powered by ChainX Infrastructure" notice */
  showInfraNotice: boolean;
}

/**
 * Tenant Registry — Sprint 7.1 Tenant Foundation
 *
 * Static in-memory registry of all known tenants.
 * No database. No external API.
 *
 * Adding tenants requires a code deploy (by design for Sprint 7.1).
 * Sprint 8 will migrate this to a persistent store.
 */
import type { TenantConfig } from './types';

const TENANTS: Record<string, TenantConfig> = {
  /**
   * ChainX — Default / fallback tenant
   */
  'app.chainx.ch': {
    id: 'chainx',
    hostname: 'app.chainx.ch',
    brandName: 'ChainX RWA',
    brandUrl: 'https://app.chainx.ch',
    supportEmail: 'hola@chainx.ch',
    primaryColor: '#2563EB',
    secondaryColor: '#0B1220',
    showInfraNotice: true,
  },

  /**
   * Alzira Capital — Demo tenant for white-label showcase
   */
  'invest.alzira.com': {
    id: 'alzira',
    hostname: 'invest.alzira.com',
    brandName: 'Alzira Capital',
    brandUrl: 'https://invest.alzira.com',
    supportEmail: 'info@alzira.com',
    primaryColor: '#0F766E',
    secondaryColor: '#0C1A1A',
    showInfraNotice: true,
  },

  /**
   * FundX — Demo tenant for white-label showcase
   */
  'portal.fundx.io': {
    id: 'fundx',
    hostname: 'portal.fundx.io',
    brandName: 'FundX Platform',
    brandUrl: 'https://portal.fundx.io',
    supportEmail: 'soporte@fundx.io',
    primaryColor: '#7C3AED',
    secondaryColor: '#0F0A1E',
    showInfraNotice: false,
  },
};

export { TENANTS };

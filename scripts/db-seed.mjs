/**
 * DB Seed Script — Sprint 8B Vercel Postgres Persistence
 *
 * Self-contained ES module. No TypeScript compilation required.
 * No path aliases. No ts-node. No tsconfig-paths.
 *
 * Usage:
 *   POSTGRES_URL_NON_POOLING=postgres://... node scripts/db-seed.mjs
 *
 * Or via npm:
 *   npm run db:seed
 *
 * Prerequisites:
 *   1. Vercel Postgres database created
 *   2. Migration 001_initial.sql already executed against the DB
 *   3. POSTGRES_URL_NON_POOLING set in environment (direct, non-pooled connection)
 *
 * Idempotent: ON CONFLICT DO UPDATE — safe to run multiple times.
 * Data: mirrors src/lib/tenants/registry.ts and src/lib/domains/registry.ts exactly.
 *       Keep in sync manually when registry data changes.
 */

import { createClient } from '@vercel/postgres';

// ─────────────────────────────────────────────────────────────────────────────
// Seed data — mirrors static registries (update when registries change)
// ─────────────────────────────────────────────────────────────────────────────

const TENANTS = [
  {
    id: 'chainx',
    brandName: 'ChainX RWA',
    brandUrl: 'https://app.chainx.ch',
    supportEmail: 'hola@chainx.ch',
    primaryColor: '#2563EB',
    secondaryColor: '#0B1220',
    faviconUrl: null,
    showInfraNotice: true,
    plan: 'enterprise',
  },
  {
    id: 'alzira',
    brandName: 'Alzira Capital',
    brandUrl: 'https://invest.alzira.com',
    supportEmail: 'info@alzira.com',
    primaryColor: '#0F766E',
    secondaryColor: '#0C1A1A',
    faviconUrl: null,
    showInfraNotice: true,
    plan: 'enterprise',
  },
  {
    id: 'fundx',
    brandName: 'FundX Platform',
    brandUrl: 'https://portal.fundx.io',
    supportEmail: 'soporte@fundx.io',
    primaryColor: '#7C3AED',
    secondaryColor: '#0F0A1E',
    faviconUrl: null,
    showInfraNotice: false,
    plan: 'enterprise',
  },
];

const DOMAINS = [
  {
    hostname: 'app.chainx.ch',
    tenantId: 'chainx',
    verified: true,
    verificationStatus: 'verified',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    hostname: 'invest.alzira.com',
    tenantId: 'alzira',
    verified: true,
    verificationStatus: 'verified',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    hostname: 'portal.fundx.io',
    tenantId: 'fundx',
    verified: false,
    verificationStatus: 'pending',
    createdAt: '2025-06-10T00:00:00Z',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  if (!process.env.POSTGRES_URL_NON_POOLING) {
    console.error('❌ POSTGRES_URL_NON_POOLING is not set.');
    console.error(
      '   Export it before running: POSTGRES_URL_NON_POOLING=... node scripts/db-seed.mjs'
    );
    process.exit(1);
  }

  const client = createClient();
  await client.connect();

  try {
    console.log('🌱 Seeding tenants...');
    for (const t of TENANTS) {
      await client.sql`
        INSERT INTO tenants (
          id, brand_name, brand_url, support_email,
          primary_color, secondary_color, favicon_url, show_infra_notice, plan
        )
        VALUES (
          ${t.id}, ${t.brandName}, ${t.brandUrl}, ${t.supportEmail},
          ${t.primaryColor}, ${t.secondaryColor}, ${t.faviconUrl},
          ${t.showInfraNotice}, ${t.plan}
        )
        ON CONFLICT (id) DO UPDATE SET
          brand_name        = EXCLUDED.brand_name,
          brand_url         = EXCLUDED.brand_url,
          support_email     = EXCLUDED.support_email,
          primary_color     = EXCLUDED.primary_color,
          secondary_color   = EXCLUDED.secondary_color,
          favicon_url       = EXCLUDED.favicon_url,
          show_infra_notice = EXCLUDED.show_infra_notice,
          updated_at        = now()
      `;
      console.log(`  ✅ tenant: ${t.id}`);
    }

    console.log('\n🌱 Seeding domains...');
    for (const d of DOMAINS) {
      await client.sql`
        INSERT INTO tenant_domains (
          hostname, tenant_id, verified, verification_status, created_at
        )
        VALUES (
          ${d.hostname}, ${d.tenantId}, ${d.verified},
          ${d.verificationStatus}, ${d.createdAt}
        )
        ON CONFLICT (hostname) DO UPDATE SET
          tenant_id           = EXCLUDED.tenant_id,
          verified            = EXCLUDED.verified,
          verification_status = EXCLUDED.verification_status
      `;
      console.log(`  ✅ domain: ${d.hostname} → ${d.tenantId}`);
    }

    console.log('\n✅ Seed complete.');
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();

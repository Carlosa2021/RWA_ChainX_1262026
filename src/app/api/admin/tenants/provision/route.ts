import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/postgres';
import { tenantRepository } from '@/lib/repositories';

// ─── Validation constants ─────────────────────────────────────────────────────

/** Tenant ID: lowercase alphanumeric + hyphens, 1-50 chars */
const TENANT_ID_RE = /^[a-z0-9-]{1,50}$/;

/** Basic email format check (no external libs) */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valid plan values */
const VALID_PLANS = new Set(['starter', 'pro', 'enterprise']);

/** Hex color (#rrggbb) */
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

/** RFC-1123 DNS hostname: labels of 1-63 chars separated by dots, total ≤ 253 chars */
const DNS_HOSTNAME_RE =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/** Hostnames reserved for internal infrastructure. Cannot be claimed by tenants. */
const RESERVED_HOSTNAMES = new Set([
  'app.chainx.ch',
  'chainx.ch',
  'chainx.app',
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
]);

/** Allowed visual-only branding fields — structural fields are never persisted to tenant_branding */
const ALLOWED_BRANDING_FIELDS = new Set([
  'brandName',
  'brandUrl',
  'supportEmail',
  'primaryColor',
  'secondaryColor',
  'faviconUrl',
  'showInfraNotice',
  'logoUrl',
  'tagline',
]);

// ─── POST /api/admin/tenants/provision ───────────────────────────────────────
//
// Purpose: Atomically provision a new tenant + its initial domain.
//          Resolves the orphan-tenant risk present when using the two-step
//          POST /api/admin/tenants → POST /api/admin/domains flow.
//
// Architecture:
//   1. Validate all input upfront (before any DB write)
//   2. Duplicate checks (before BEGIN)
//   3. Postgres mode: BEGIN → INSERT tenants → INSERT tenant_domains → COMMIT
//      On error: ROLLBACK → return 500
//   4. Best-effort: tenantRepository.saveBranding() (after COMMIT)
//      Failure here does NOT rollback the transaction.
//   5. Mock mode (no POSTGRES_URL): return success immediately (no-op repos)
//
// Auth:
//   ownerAddress must match NEXT_PUBLIC_OWNER_ADDRESS (same as all admin routes).
//
// Body (minimum):
//   ownerAddress   string — caller's wallet address
//   id             string — tenant slug: ^[a-z0-9-]{1,50}$
//   brandName      string — display name (required)
//   brandUrl       string — canonical URL (required)
//   supportEmail   string — valid email (required)
//   plan           string — starter | pro | enterprise (required)
//   hostname       string — valid RFC-1123 DNS hostname (required)
//
// Optional:
//   primaryColor   string — hex color (default #2563EB)
//   secondaryColor string — hex color (default #0B1220)
//   faviconUrl     string
//   showInfraNotice boolean (default true)
//
// Returns:
//   { success: true, tenantId, hostname, brandingPersisted: boolean }
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  // ── RBAC: PLATFORM_ADMIN only ───────────────────────────────────────────────
  // Owner wallet address = PLATFORM_ADMIN (mirrors AuthContext + usePermissions).
  const configuredOwner = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase().trim();
  const callerAddress = String(body.ownerAddress ?? '')
    .toLowerCase()
    .trim();

  if (!configuredOwner || !callerAddress || callerAddress !== configuredOwner) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 403 });
  }

  // ── Upfront validation — ALL fields checked before the first DB call ─────────

  // Tenant: id
  const id = String(body.id ?? '')
    .trim()
    .toLowerCase();
  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required.' }, { status: 400 });
  }
  if (!TENANT_ID_RE.test(id)) {
    return NextResponse.json(
      { success: false, error: 'id must be 1-50 lowercase alphanumeric characters or hyphens.' },
      { status: 400 }
    );
  }

  // Tenant: brandName
  const brandName = String(body.brandName ?? '').trim();
  if (!brandName) {
    return NextResponse.json({ success: false, error: 'brandName is required.' }, { status: 400 });
  }
  if (brandName.length > 100) {
    return NextResponse.json(
      { success: false, error: 'brandName exceeds maximum length (100 chars).' },
      { status: 400 }
    );
  }

  // Tenant: brandUrl
  const brandUrl = String(body.brandUrl ?? '').trim();
  if (!brandUrl) {
    return NextResponse.json({ success: false, error: 'brandUrl is required.' }, { status: 400 });
  }

  // Tenant: supportEmail
  const supportEmail = String(body.supportEmail ?? '')
    .trim()
    .toLowerCase();
  if (!supportEmail) {
    return NextResponse.json(
      { success: false, error: 'supportEmail is required.' },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(supportEmail)) {
    return NextResponse.json(
      { success: false, error: 'supportEmail is not a valid email address.' },
      { status: 400 }
    );
  }

  // Tenant: plan
  const plan = String(body.plan ?? '')
    .trim()
    .toLowerCase();
  if (!plan) {
    return NextResponse.json({ success: false, error: 'plan is required.' }, { status: 400 });
  }
  if (!VALID_PLANS.has(plan)) {
    return NextResponse.json(
      { success: false, error: 'plan must be one of: starter, pro, enterprise.' },
      { status: 400 }
    );
  }

  // Tenant: colors (optional with defaults)
  const primaryColor = String(body.primaryColor ?? '#2563EB').trim();
  if (!HEX_COLOR_RE.test(primaryColor)) {
    return NextResponse.json(
      { success: false, error: 'primaryColor must be a valid hex color (e.g. #2563EB).' },
      { status: 400 }
    );
  }

  const secondaryColor = String(body.secondaryColor ?? '#0B1220').trim();
  if (!HEX_COLOR_RE.test(secondaryColor)) {
    return NextResponse.json(
      { success: false, error: 'secondaryColor must be a valid hex color (e.g. #0B1220).' },
      { status: 400 }
    );
  }

  const faviconUrl =
    typeof body.faviconUrl === 'string' && body.faviconUrl.trim() ? body.faviconUrl.trim() : null;

  const showInfraNotice = body.showInfraNotice !== false; // default true

  // Domain: hostname
  const hostname = String(body.hostname ?? '')
    .trim()
    .toLowerCase();
  if (!hostname) {
    return NextResponse.json({ success: false, error: 'hostname is required.' }, { status: 400 });
  }
  if (hostname.length > 253) {
    return NextResponse.json(
      { success: false, error: 'Hostname exceeds maximum length (253 chars).' },
      { status: 400 }
    );
  }
  if (!DNS_HOSTNAME_RE.test(hostname)) {
    return NextResponse.json(
      { success: false, error: 'Invalid hostname format. Must be a valid DNS name.' },
      { status: 400 }
    );
  }
  if (RESERVED_HOSTNAMES.has(hostname)) {
    return NextResponse.json(
      { success: false, error: 'This hostname is reserved and cannot be registered.' },
      { status: 400 }
    );
  }

  // ── Mock mode — no POSTGRES_URL ─────────────────────────────────────────────
  // Repositories are no-ops in mock mode. Return success immediately so local
  // development and testing work without a real Postgres instance.
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { success: true, tenantId: id, hostname, brandingPersisted: false, mode: 'mock' },
      { status: 201 }
    );
  }

  // ── Duplicate checks (read-before-write, before BEGIN) ──────────────────────
  // Performed outside the transaction to return precise 409 errors.
  // Postgres mode only — Mock mode has no persistent state.
  const [existingTenant, existingDomain] = await Promise.all([
    tenantRepository.getTenantById(id),
    // getDomain normalizes port — safe to call with plain hostname
    (async () => {
      const { domainRepository } = await import('@/lib/repositories');
      return domainRepository.getDomain(hostname);
    })(),
  ]);

  if (existingTenant) {
    return NextResponse.json(
      { success: false, error: `Tenant with id "${id}" already exists.` },
      { status: 409 }
    );
  }
  if (existingDomain) {
    return NextResponse.json(
      { success: false, error: `Hostname "${hostname}" is already registered.` },
      { status: 409 }
    );
  }

  // ── Atomic transaction: INSERT tenant + INSERT domain ───────────────────────
  // Uses createClient() directly for explicit transaction control.
  // The singleton `sql` tagged template does not support transactions.
  const createdAt = new Date().toISOString();
  const client = createClient();
  await client.connect();

  try {
    await client.sql`BEGIN`;

    await client.sql`
      INSERT INTO tenants (
        id, brand_name, brand_url, support_email,
        primary_color, secondary_color, favicon_url, show_infra_notice, plan
      )
      VALUES (
        ${id}, ${brandName}, ${brandUrl}, ${supportEmail},
        ${primaryColor}, ${secondaryColor}, ${faviconUrl},
        ${showInfraNotice}, ${plan}
      )
    `;

    await client.sql`
      INSERT INTO tenant_domains (
        hostname, tenant_id, verified, verification_status, created_at
      )
      VALUES (
        ${hostname}, ${id}, ${false}, ${'pending'}, ${createdAt}
      )
    `;

    await client.sql`COMMIT`;
  } catch (err) {
    await client.sql`ROLLBACK`;
    console.error('❌ provision: transaction rolled back', err);
    return NextResponse.json(
      { success: false, error: 'Failed to provision tenant. Transaction rolled back.' },
      { status: 500 }
    );
  } finally {
    await client.end();
  }

  // future audit event: { actor: callerAddress, action: 'tenant.provision', target: id, hostname, ts: Date.now() }

  // ── Best-effort branding persistence (after COMMIT) ──────────────────────────
  // Failure here does NOT rollback the tenant/domain — they are already committed.
  // Branding has safe defaults from the tenants table; this is optional enrichment.
  let brandingPersisted = false;
  const brandingConfig: Record<string, unknown> = {};
  for (const key of ALLOWED_BRANDING_FIELDS) {
    if (key in body) {
      brandingConfig[key] = body[key];
    }
  }
  // Ensure resolved defaults are included
  brandingConfig.brandName = brandName;
  brandingConfig.brandUrl = brandUrl;
  brandingConfig.supportEmail = supportEmail;
  brandingConfig.primaryColor = primaryColor;
  brandingConfig.secondaryColor = secondaryColor;
  brandingConfig.showInfraNotice = showInfraNotice;
  if (faviconUrl) brandingConfig.faviconUrl = faviconUrl;

  try {
    await tenantRepository.saveBranding(id, brandingConfig);
    brandingPersisted = true;
  } catch {
    // Non-fatal — tenant and domain are committed; branding can be set later via /api/admin/branding
  }

  return NextResponse.json(
    { success: true, tenantId: id, hostname, brandingPersisted },
    { status: 201 }
  );
}

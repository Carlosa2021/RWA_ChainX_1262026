import { NextRequest, NextResponse } from 'next/server';
import { tenantRepository } from '@/lib/repositories';

// ─── Allowed visual-only branding fields ─────────────────────────────────────
// Structural fields (id, hostname, tenantId) are stripped before persistence.
// This enforces the Domain → Tenant → Branding hierarchy at the API boundary.

const ALLOWED_VISUAL_FIELDS = new Set([
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

/** Hex color (#rrggbb) */
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

// ─── POST /api/admin/branding ─────────────────────────────────────────────────
//
// Purpose: Persist visual branding overrides for a tenant to Postgres.
//          Complements localStorage (BrandingContext) — Postgres becomes
//          source of truth when POSTGRES_URL is configured.
// Auth:    Caller's wallet address must match NEXT_PUBLIC_OWNER_ADDRESS.
//          Only PLATFORM_ADMIN (owner) may update branding.
// Writes:  tenantRepository.saveBranding() → tenant_branding.config (JSONB)
//
// Body:
//   ownerAddress  string — caller's wallet address (auth check)
//   tenantId      string — target tenant ID (required)
//   config        object — visual branding fields only
//
// Structural fields (id, hostname, tenantId, verificationStatus, domain) in
// config are silently stripped before persistence.
//
// Returns:
//   { success: true, tenantId: string }
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
  // Server-side: compare caller's wallet address to configured owner address.
  // Owner wallet = PLATFORM_ADMIN role (see src/lib/rbac/usePermissions.ts).
  const configuredOwner = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase().trim();
  const callerAddress = String(body.ownerAddress ?? '')
    .toLowerCase()
    .trim();

  if (!configuredOwner || !callerAddress || callerAddress !== configuredOwner) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 403 });
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  const tenantId = String(body.tenantId ?? '')
    .trim()
    .toLowerCase();
  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'tenantId is required.' }, { status: 400 });
  }

  const rawConfig = body.config;
  if (!rawConfig || typeof rawConfig !== 'object' || Array.isArray(rawConfig)) {
    return NextResponse.json(
      { success: false, error: 'config must be a non-null object.' },
      { status: 400 }
    );
  }

  // ── Strip structural fields — only visual overrides allowed ─────────────────
  const inputConfig = rawConfig as Record<string, unknown>;
  const visualConfig: Record<string, unknown> = {};
  for (const key of ALLOWED_VISUAL_FIELDS) {
    if (key in inputConfig) {
      visualConfig[key] = inputConfig[key];
    }
  }

  // ── Validate color fields if provided ───────────────────────────────────────
  for (const colorField of ['primaryColor', 'secondaryColor'] as const) {
    if (colorField in visualConfig) {
      const val = String(visualConfig[colorField] ?? '');
      if (!HEX_COLOR_RE.test(val)) {
        return NextResponse.json(
          { success: false, error: `${colorField} must be a valid hex color (e.g. #2563EB).` },
          { status: 400 }
        );
      }
    }
  }

  if (Object.keys(visualConfig).length === 0) {
    return NextResponse.json(
      { success: false, error: 'config must contain at least one visual branding field.' },
      { status: 400 }
    );
  }

  // ── Tenant existence check ───────────────────────────────────────────────────
  // Only enforce when Postgres is active — Mock mode is development-only.
  if (process.env.POSTGRES_URL) {
    const tenant = await tenantRepository.getTenantById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { success: false, error: `Tenant "${tenantId}" does not exist.` },
        { status: 404 }
      );
    }
  }

  // ── Persist ─────────────────────────────────────────────────────────────────
  await tenantRepository.saveBranding(tenantId, visualConfig);

  // future audit event: { actor: callerAddress, action: 'branding.save', target: tenantId, ts: Date.now() }

  return NextResponse.json({ success: true, tenantId }, { status: 200 });
}

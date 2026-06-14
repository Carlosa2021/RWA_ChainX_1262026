import { NextRequest, NextResponse } from 'next/server';
import { tenantRepository } from '@/lib/repositories';

// ─── Validation constants ─────────────────────────────────────────────────────

/** Tenant ID: lowercase alphanumeric + hyphens, 1-50 chars */
const TENANT_ID_RE = /^[a-z0-9-]{1,50}$/;

/** Basic email format check (no external libs) */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valid plan values — internal tier identifiers */
const VALID_PLANS = new Set(['starter', 'pro', 'enterprise']);

/** Hex color (#rrggbb) */
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

// ─── POST /api/admin/tenants ──────────────────────────────────────────────────
//
// Purpose: Create a new tenant in Postgres.
// Auth:    Caller's wallet address must match NEXT_PUBLIC_OWNER_ADDRESS.
//          Only PLATFORM_ADMIN (owner) may create tenants.
// Writes:  tenantRepository.createTenant()
//
// Body:
//   ownerAddress   string  — caller's wallet address (auth check)
//   id             string  — tenant slug: [a-z0-9-]{1-50}
//   brandName      string  — display name (required)
//   brandUrl       string  — canonical URL (required)
//   supportEmail   string  — support email (required, valid format)
//   plan           string  — starter | pro | enterprise (required)
//   primaryColor?  string  — hex color (default #2563EB)
//   secondaryColor? string — hex color (default #0B1220)
//   faviconUrl?    string  — optional favicon URL
//   showInfraNotice? boolean (default true)
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

  const brandUrl = String(body.brandUrl ?? '').trim();
  if (!brandUrl) {
    return NextResponse.json({ success: false, error: 'brandUrl is required.' }, { status: 400 });
  }

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
    typeof body.faviconUrl === 'string' && body.faviconUrl.trim()
      ? body.faviconUrl.trim()
      : undefined;

  const showInfraNotice = body.showInfraNotice !== false; // default true

  // ── Duplicate check (read-before-write) ────────────────────────────────────
  const existing = await tenantRepository.getTenantById(id);
  if (existing) {
    return NextResponse.json(
      { success: false, error: `Tenant with id "${id}" already exists.` },
      { status: 409 }
    );
  }

  // ── Persist ─────────────────────────────────────────────────────────────────
  await tenantRepository.createTenant({
    id,
    hostname: '', // hostname is set via tenant_domains — not on the tenant record itself
    brandName,
    brandUrl,
    supportEmail,
    primaryColor,
    secondaryColor,
    faviconUrl,
    showInfraNotice,
    plan: plan as 'starter' | 'pro' | 'enterprise',
  });

  // future audit event: { actor: callerAddress, action: 'tenant.create', target: id, ts: Date.now() }

  return NextResponse.json({ success: true, tenantId: id }, { status: 201 });
}

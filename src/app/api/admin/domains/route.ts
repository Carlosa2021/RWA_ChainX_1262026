import { NextRequest, NextResponse } from 'next/server';
import { domainRepository, tenantRepository } from '@/lib/repositories';
import type { DomainVerificationStatus } from '@/lib/domains/types';

// ─── Validation constants ─────────────────────────────────────────────────────

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

// ─── POST /api/admin/domains ──────────────────────────────────────────────────
//
// Purpose: Register a new domain for an existing tenant.
// Auth:    Caller's wallet address must match NEXT_PUBLIC_OWNER_ADDRESS.
//          Only PLATFORM_ADMIN (owner) may register domains.
// Writes:  domainRepository.createDomain()
//
// Body:
//   ownerAddress  string — caller's wallet address (auth check)
//   hostname      string — valid DNS hostname (required)
//   tenantId      string — existing tenant ID (required)
//
// Returns:
//   { success: true, hostname: string }
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

  const tenantId = String(body.tenantId ?? '')
    .trim()
    .toLowerCase();
  if (!tenantId) {
    return NextResponse.json({ success: false, error: 'tenantId is required.' }, { status: 400 });
  }

  // ── Referential integrity: tenant must exist ────────────────────────────────
  const tenant = await tenantRepository.getTenantById(tenantId);
  if (!tenant) {
    return NextResponse.json(
      { success: false, error: `Tenant "${tenantId}" does not exist.` },
      { status: 404 }
    );
  }

  // ── Duplicate hostname check ────────────────────────────────────────────────
  const existing = await domainRepository.getDomain(hostname);
  if (existing) {
    return NextResponse.json(
      { success: false, error: `Hostname "${hostname}" is already registered.` },
      { status: 409 }
    );
  }

  // ── Persist ─────────────────────────────────────────────────────────────────
  const verificationStatus: DomainVerificationStatus = 'pending';
  await domainRepository.createDomain({
    hostname,
    tenantId,
    verified: false,
    verificationStatus,
    createdAt: new Date().toISOString(),
  });

  // future audit event: { actor: callerAddress, action: 'domain.create', target: hostname, ts: Date.now() }

  return NextResponse.json({ success: true, hostname }, { status: 201 });
}

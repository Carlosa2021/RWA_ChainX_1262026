import { NextRequest, NextResponse } from 'next/server';
import { tenantRepository } from '@/lib/repositories';

// ─── GET /api/admin/tenants/[id] ──────────────────────────────────────────────
//
// Purpose: Retrieve a single tenant by ID.
// Auth:    ownerAddress query param must match NEXT_PUBLIC_OWNER_ADDRESS.
// Reads:   tenantRepository.getTenantById(id)
//
// Path params:
//   id            string — tenant slug
//
// Query params:
//   ownerAddress  string — caller's wallet address (auth check)
//
// Returns:
//   { success: true, tenant: TenantConfig }
//
// Error cases:
//   400 — missing ownerAddress
//   403 — unauthorized (non-owner wallet)
//   404 — tenant not found
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // ── RBAC: PLATFORM_ADMIN only ───────────────────────────────────────────────
  const configuredOwner = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase().trim();
  const callerAddress = (req.nextUrl.searchParams.get('ownerAddress') ?? '').toLowerCase().trim();

  if (!callerAddress) {
    return NextResponse.json(
      { success: false, error: 'ownerAddress query parameter is required.' },
      { status: 400 }
    );
  }
  if (!configuredOwner || callerAddress !== configuredOwner) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 403 });
  }

  // ── Resolve tenant ──────────────────────────────────────────────────────────
  const { id } = await params;
  const tenant = await tenantRepository.getTenantById(id);

  if (!tenant) {
    return NextResponse.json(
      { success: false, error: `Tenant "${id}" not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, tenant });
}

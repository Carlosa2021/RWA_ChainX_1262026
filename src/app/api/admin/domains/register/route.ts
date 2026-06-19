import { NextRequest, NextResponse } from 'next/server';
import { domainRepository } from '@/lib/repositories';
import {
  registerDomainWithVercel,
  VercelDomainTakenError,
  VercelAuthError,
  VercelRateLimitError,
  VercelApiError,
} from '@/lib/vercel/domains';

// ─── Validation constants (mirrors existing admin routes exactly) ──────────────

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

// ─── POST /api/admin/domains/register ────────────────────────────────────────
//
// Purpose: Register an existing tenant domain with the Vercel Domains API and
//          store the resulting DNS verification instructions.
//
// Prerequisites:
//   The domain row must already exist in tenant_domains (created via
//   POST /api/admin/domains) with any status other than 'verified'.
//
// Lifecycle transition:
//   pending | registering | failed → registering → registered
//   (verified is Sprint 9.3 — this route does NOT verify DNS)
//
// Auth:
//   ownerAddress must match NEXT_PUBLIC_OWNER_ADDRESS (PLATFORM_ADMIN only).
//   The VERCEL_TOKEN is never passed through the client and never logged.
//
// Body:
//   ownerAddress  string — caller's wallet address (auth check)
//   hostname      string — valid DNS hostname that exists in tenant_domains
//
// Success (200):
//   { success: true, hostname, status: 'registered', dnsInstructions: { ... } }
//
// Mock mode (no POSTGRES_URL) (200):
//   { success: true, hostname, status: 'registered', dnsInstructions: { ... }, mode: 'mock' }
//
// Error cases:
//   400 — invalid or reserved hostname
//   403 — unauthorized (non-owner wallet)
//   404 — domain not found in tenant_domains
//   409 — domain already registered or verified (+ existing DNS instructions if any)
//   422 — Vercel rejected the domain (e.g. invalid_name after passing local validation)
//   429 — Vercel rate limit — domain kept at 'registering' for retry
//   500 — platform config error (bad/missing token) — domain NOT marked failed
//   503 — Vercel 5xx or network error — domain kept at 'registering' for retry
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
  // Pattern mirrors all existing admin routes.
  // The Vercel API call never occurs for unauthorized callers.
  const configuredOwner = process.env.NEXT_PUBLIC_OWNER_ADDRESS?.toLowerCase().trim();
  const callerAddress = String(body.ownerAddress ?? '')
    .toLowerCase()
    .trim();

  if (!configuredOwner || !callerAddress || callerAddress !== configuredOwner) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 403 });
  }

  // ── Validate hostname ───────────────────────────────────────────────────────
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

  // ── Mock mode (no Postgres) ─────────────────────────────────────────────────
  // When POSTGRES_URL is absent the domainRepository is the in-memory mock.
  // Rather than attempting a real Vercel API call (which would require real
  // credentials), return a deterministic mock response so developers can test
  // the full admin UI flow locally without configuring Vercel.
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({
      success: true,
      hostname,
      status: 'registered',
      dnsInstructions: {
        txtName: `_vercel.${hostname}`,
        txtValue: 'mock-verification-token',
        cnameName: hostname,
        cnameValue: 'cname.vercel-dns.com',
      },
      mode: 'mock',
    });
  }

  // ── Postgres mode — pre-flight checks ─────────────────────────────────────

  // 1. Domain must already exist in tenant_domains.
  const domain = await domainRepository.getDomain(hostname);
  if (!domain) {
    return NextResponse.json(
      {
        success: false,
        error: `Domain "${hostname}" is not registered in this platform. Create it first via POST /api/admin/domains.`,
      },
      { status: 404 }
    );
  }

  // 2. Idempotency guards — prevent redundant Vercel calls.
  if (domain.verificationStatus === 'verified') {
    return NextResponse.json(
      {
        success: false,
        error: `Domain "${hostname}" is already verified and active. No registration needed.`,
      },
      { status: 409 }
    );
  }

  if (domain.verificationStatus === 'registered') {
    // Domain was already registered with Vercel in a previous call.
    // Return 409 with whatever DNS instructions we can surface.
    // Note: getDomain() does not currently return Vercel columns (Sprint 9.2A
    // limitation — rowToDomain maps core columns only). dnsInstructions will
    // be null here until getDomain() is extended in Sprint 9.3.
    return NextResponse.json(
      {
        success: false,
        error: `Domain "${hostname}" is already registered with Vercel. Use POST /api/admin/domains/check to verify DNS propagation.`,
        dnsInstructions: domain.txtName
          ? {
              txtName: domain.txtName,
              txtValue: domain.txtValue,
              cnameName: domain.cnameName ?? null,
              cnameValue: domain.cnameValue ?? null,
            }
          : null,
      },
      { status: 409 }
    );
  }

  // ── Pre-flight status write: pending | failed → registering ────────────────
  // Written BEFORE the Vercel API call so that if the serverless function
  // times out mid-flight, the row is left at 'registering' (a clearly
  // retriable state) rather than at 'pending' (ambiguous) or 'failed' (wrong).
  await domainRepository.setVerificationStatus(hostname, 'registering');

  // ── Call Vercel Domains API ────────────────────────────────────────────────
  try {
    const data = await registerDomainWithVercel(hostname);

    // ── Persist DNS instructions: registering → registered ──────────────────
    await domainRepository.setVercelRegistration(hostname, {
      ...data,
      createdBy: callerAddress,
    });

    return NextResponse.json({
      success: true,
      hostname,
      status: 'registered',
      dnsInstructions: {
        txtName: data.txtName,
        txtValue: data.txtValue,
        cnameName: data.cnameName,
        cnameValue: data.cnameValue,
      },
    });
  } catch (err) {
    // ── VercelDomainTakenError: another project owns this domain ────────────
    // Mark as 'failed' — admin must remove domain from the other project first.
    if (err instanceof VercelDomainTakenError) {
      await domainRepository.setVerificationStatus(hostname, 'failed', {
        verificationError: 'domain_taken: already registered to another Vercel project',
      });
      return NextResponse.json(
        {
          success: false,
          error: `Domain "${hostname}" is already registered to another Vercel project. Remove it from that project before registering here.`,
        },
        { status: 409 }
      );
    }

    // ── VercelAuthError: platform configuration error ────────────────────────
    // Do NOT mark the domain as 'failed' — this is not a domain problem.
    // Do NOT echo any token or credential detail.
    if (err instanceof VercelAuthError) {
      console.error(
        '[domains/register] Vercel authentication error — check VERCEL_TOKEN and VERCEL_PROJECT_ID configuration.'
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Domain registration could not be completed due to a server configuration error.',
        },
        { status: 500 }
      );
    }

    // ── VercelRateLimitError: keep 'registering', caller should retry ────────
    if (err instanceof VercelRateLimitError) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (err.retryAfter !== undefined) {
        headers['Retry-After'] = String(err.retryAfter);
      }
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Vercel API rate limit exceeded. Please try again shortly.',
        }),
        { status: 429, headers }
      );
    }

    // ── VercelApiError ────────────────────────────────────────────────────────
    if (err instanceof VercelApiError) {
      if (err.statusCode >= 500 || err.statusCode === 0) {
        // 5xx or network error — transient, retriable.
        // Keep domain at 'registering' so the admin can retry.
        return NextResponse.json(
          {
            success: false,
            error: 'Vercel service is temporarily unavailable. Please try again later.',
          },
          { status: 503 }
        );
      }

      // Other 4xx (e.g. invalid_name after passing local validation).
      // This is a domain-specific error — mark as 'failed'.
      await domainRepository.setVerificationStatus(hostname, 'failed', {
        verificationError: `vercel_error: ${err.code ?? 'unknown'} (HTTP ${err.statusCode})`,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Vercel rejected this domain. Verify the hostname is correct and try again.',
        },
        { status: 422 }
      );
    }

    // ── Unexpected errors ─────────────────────────────────────────────────────
    // Log the message only — never log the full error object which could
    // contain stack frames referencing env vars.
    console.error(
      '[domains/register] Unexpected error:',
      err instanceof Error ? err.message : 'unknown'
    );
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

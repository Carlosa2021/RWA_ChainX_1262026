import { NextRequest, NextResponse } from 'next/server';
import { domainRepository } from '@/lib/repositories';
import {
  checkDomainWithVercel,
  VercelDomainNotFoundError,
  VercelAuthError,
  VercelRateLimitError,
  VercelApiError,
} from '@/lib/vercel/domains';

// ─── Validation constants (mirrors register route exactly) ───────────────────

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

// ─── POST /api/admin/domains/check ──────────────────────────────────────────
//
// Purpose: Check whether a domain already registered with the Vercel Domains
//          API has had its DNS records verified.
//
// Prerequisites:
//   The domain row must exist in tenant_domains with status 'registered'
//   (i.e. registerDomainWithVercel has already been called successfully).
//
// Lifecycle transitions:
//   registered → verified  (Vercel reports verified: true)
//   registered → registered (Vercel reports verified: false — DNS pending)
//   registered → failed    (domain removed from Vercel project — 404)
//
// Auth:
//   ownerAddress must match NEXT_PUBLIC_OWNER_ADDRESS (PLATFORM_ADMIN only).
//   VERCEL_TOKEN is never passed to the client and never logged.
//
// Body:
//   ownerAddress  string — caller's wallet address (auth check)
//   hostname      string — valid DNS hostname that exists in tenant_domains
//
// Success (200) — verified:
//   { success: true, hostname, verified: true, status: 'verified', message }
//
// Success (200) — DNS pending:
//   { success: true, hostname, verified: false, status: 'registered', message }
//
// Success (200) — already verified (idempotent early return):
//   { success: true, hostname, verified: true, status: 'verified', message }
//
// Mock mode (200):
//   { success: true, hostname, verified: false, status: 'registered', message, mode: 'mock' }
//
// Error cases:
//   400 — invalid/reserved hostname, wrong status (pending/registering/failed)
//   403 — unauthorized (non-owner wallet)
//   404 — domain not found in tenant_domains
//   409 — domain removed from Vercel project (VercelDomainNotFoundError)
//   429 — Vercel rate limit — domain kept at 'registered' for retry
//   500 — platform config error (bad/missing token)
//   503 — Vercel 5xx or network error — domain kept at 'registered' for retry
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
      { success: false, error: 'This hostname is reserved and cannot be checked.' },
      { status: 400 }
    );
  }

  // ── Mock mode (no Postgres) ─────────────────────────────────────────────────
  // When POSTGRES_URL is absent, return a deterministic mock response so
  // developers can test the admin flow locally without Vercel credentials.
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({
      success: true,
      hostname,
      verified: false,
      status: 'registered',
      message: 'Mock mode: domain verification simulated as pending.',
      mode: 'mock',
    });
  }

  // ── Get domain from repository ──────────────────────────────────────────────
  const domain = await domainRepository.getDomain(hostname);
  if (!domain) {
    return NextResponse.json(
      {
        success: false,
        error: `Domain "${hostname}" is not registered in this platform.`,
      },
      { status: 404 }
    );
  }

  // ── Status guard ────────────────────────────────────────────────────────────
  // Only 'registered' domains can be checked. All other states are terminal or
  // indicate a prerequisite step has not been completed.
  if (domain.verificationStatus === 'pending') {
    return NextResponse.json(
      {
        success: false,
        error: `Domain "${hostname}" has not been registered with Vercel yet. Call POST /api/admin/domains/register first.`,
      },
      { status: 400 }
    );
  }

  if (domain.verificationStatus === 'registering') {
    return NextResponse.json(
      {
        success: false,
        error: `Domain "${hostname}" registration with Vercel is still in progress. Wait for it to complete and try again.`,
      },
      { status: 400 }
    );
  }

  if (domain.verificationStatus === 'verified') {
    // Idempotent early return — no Vercel call needed.
    return NextResponse.json({
      success: true,
      hostname,
      verified: true,
      status: 'verified',
      message: `Domain "${hostname}" is already verified and active.`,
    });
  }

  if (domain.verificationStatus === 'failed') {
    return NextResponse.json(
      {
        success: false,
        error: `Domain "${hostname}" registration failed. Re-register via POST /api/admin/domains/register before checking verification.`,
      },
      { status: 400 }
    );
  }

  // ── Call Vercel Domains API ────────────────────────────────────────────────
  const now = new Date().toISOString();

  try {
    const result = await checkDomainWithVercel(hostname);

    if (result.verified) {
      // ── DNS verified: registered → verified ─────────────────────────────
      await domainRepository.setVerificationStatus(hostname, 'verified', {
        verifiedAt: now,
        lastCheckedAt: now,
        verificationError: null,
      });

      return NextResponse.json({
        success: true,
        hostname,
        verified: true,
        status: 'verified',
        message: `Domain "${hostname}" verified successfully.`,
      });
    }

    // ── DNS not yet propagated: registered → registered (unchanged) ─────────
    // verified: false is NOT a failure. The admin must add the required DNS
    // records and call this endpoint again after propagation.
    await domainRepository.setVerificationStatus(hostname, 'registered', {
      lastCheckedAt: now,
      verificationError: null,
    });

    return NextResponse.json({
      success: true,
      hostname,
      verified: false,
      status: 'registered',
      message:
        'DNS records are not verified yet. Add the required DNS records and try again after propagation.',
    });
  } catch (err) {
    // ── VercelDomainNotFoundError: domain removed from the Vercel project ───
    // Mark as 'failed' — admin must re-register the domain.
    if (err instanceof VercelDomainNotFoundError) {
      await domainRepository.setVerificationStatus(hostname, 'failed', {
        verificationError: 'domain_not_found: removed from Vercel project',
        lastCheckedAt: now,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Domain "${hostname}" was not found in the Vercel project. It may have been removed. Re-register via POST /api/admin/domains/register.`,
        },
        { status: 409 }
      );
    }

    // ── VercelAuthError: platform configuration error ────────────────────────
    // Do NOT mark the domain as 'failed' — this is not a domain problem.
    // Do NOT echo any token or credential detail.
    if (err instanceof VercelAuthError) {
      console.error(
        '[domains/check] Vercel authentication error — check VERCEL_TOKEN and VERCEL_PROJECT_ID configuration.'
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Domain verification could not be completed due to a server configuration error.',
        },
        { status: 500 }
      );
    }

    // ── VercelRateLimitError: keep 'registered', caller should retry ─────────
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

    // ── VercelApiError: 5xx or network error — transient, retriable ──────────
    if (err instanceof VercelApiError) {
      if (err.statusCode >= 500 || err.statusCode === 0) {
        // Transient — do NOT write DB. Domain stays at 'registered'.
        return NextResponse.json(
          {
            success: false,
            error: 'Vercel service is temporarily unavailable. Please try again later.',
          },
          { status: 503 }
        );
      }

      // Unexpected 4xx — transient, do not change domain status.
      return NextResponse.json(
        {
          success: false,
          error: 'Vercel returned an unexpected error. Please try again.',
        },
        { status: 503 }
      );
    }

    // ── Unexpected errors ────────────────────────────────────────────────────
    console.error('[domains/check] Unexpected error:', err instanceof Error ? err.message : err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

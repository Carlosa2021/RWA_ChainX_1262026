/**
 * Vercel Domains API Client — Sprint 9.2B Domain Registration
 *
 * Server-side only. Reads credentials exclusively from environment variables.
 * SECURITY:
 *   - VERCEL_TOKEN is never logged, never included in error messages,
 *     never returned to the caller.
 *   - All throw paths use generic messages or Vercel's own error codes only.
 *
 * Endpoints used:
 *   POST /v10/projects/{projectId}/domains  — add a domain to the project
 *
 * Called by: POST /api/admin/domains/register (Sprint 9.2B)
 * Polling:   GET  /v10/projects/{projectId}/domains/{hostname} — Sprint 9.3
 */
import type { VercelRegistrationData } from '@/lib/repositories/types';

// ─────────────────────────────────────────────────────────────────────────────
// Typed error classes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Domain is already registered to another Vercel project.
 * Vercel returns: 409 + code "domain_taken".
 * Route behavior: mark domain as 'failed', return 409 to admin.
 */
export class VercelDomainTakenError extends Error {
  constructor(hostname: string) {
    super(`Domain "${hostname}" is already registered to another Vercel project.`);
    this.name = 'VercelDomainTakenError';
  }
}

/**
 * Authentication or configuration failure.
 * Vercel returns: 401 or 403.
 * Also thrown when VERCEL_TOKEN or VERCEL_PROJECT_ID is absent.
 * Route behavior: do NOT mark domain as 'failed' (this is a platform config
 * error, not a domain error). Return 500 with a generic message.
 */
export class VercelAuthError extends Error {
  constructor(
    message = 'Vercel API authentication failed. Check VERCEL_TOKEN and VERCEL_PROJECT_ID.'
  ) {
    super(message);
    this.name = 'VercelAuthError';
  }
}

/**
 * Vercel API rate limit exceeded.
 * Vercel returns: 429 with optional Retry-After header.
 * Route behavior: keep domain at 'registering' (retriable). Return 429.
 */
export class VercelRateLimitError extends Error {
  /** Value of the Retry-After header in seconds, if provided by Vercel. */
  readonly retryAfter?: number;
  constructor(retryAfter?: number) {
    super('Vercel API rate limit exceeded.');
    this.name = 'VercelRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Generic Vercel API error — any 4xx (excluding 401/403/409/429) or 5xx,
 * or a network-level failure (statusCode === 0).
 * Route behavior:
 *   5xx / network (statusCode >= 500 or === 0): keep 'registering', return 503.
 *   Other 4xx: mark 'failed', return 422.
 */
export class VercelApiError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  constructor(statusCode: number, code?: string) {
    // Do not include any URL, token, or auth details in this message.
    super(`Vercel API error: ${code ?? 'unknown'} (HTTP ${statusCode})`);
    this.name = 'VercelApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Vercel API response shapes (internal — not exported)
// ─────────────────────────────────────────────────────────────────────────────

interface VercelDomainVerification {
  type: string;
  /** DNS record name, e.g. "_vercel.invest.alzira.com" */
  domain: string;
  /** DNS record value, e.g. "vc-domain-verify=abc123" */
  value: string;
  reason: string;
}

interface VercelDomainResponse {
  /** The registered hostname, e.g. "invest.alzira.com" */
  name: string;
  /** Apex domain, e.g. "alzira.com". Equals name for apex registrations. */
  apexName: string;
  projectId: string;
  verified: boolean;
  /** DNS verification records to display to the tenant's DNS admin. */
  verification: VercelDomainVerification[];
}

interface VercelErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Register a hostname with the Vercel Domains API for this project.
 * Returns DNS verification instructions to display to the platform admin.
 *
 * Environment variables required (server-side only):
 *   VERCEL_TOKEN      — Bearer token from Vercel Dashboard → Settings → Tokens
 *   VERCEL_PROJECT_ID — Project ID from Vercel Dashboard → Project Settings
 *   VERCEL_TEAM_ID    — Team ID (optional; required for team/org accounts)
 *
 * Throws:
 *   VercelAuthError        — missing/invalid VERCEL_TOKEN or VERCEL_PROJECT_ID
 *   VercelDomainTakenError — domain belongs to another Vercel project (409)
 *   VercelRateLimitError   — rate limit exceeded (429)
 *   VercelApiError         — any other Vercel API failure or network error
 */
export async function registerDomainWithVercel(hostname: string): Promise<VercelRegistrationData> {
  // ── Credentials check ────────────────────────────────────────────────────────
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    // Throw immediately — do NOT log the actual env var values.
    throw new VercelAuthError('VERCEL_TOKEN or VERCEL_PROJECT_ID is not configured.');
  }

  // ── Build request URL ─────────────────────────────────────────────────────────
  const url = new URL(
    `https://api.vercel.com/v10/projects/${encodeURIComponent(projectId)}/domains`
  );
  if (teamId) {
    url.searchParams.set('teamId', teamId);
  }

  // ── Call Vercel API ───────────────────────────────────────────────────────────
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        // Token is sent in the header only — never logged or echoed.
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: hostname }),
    });
  } catch {
    // Network-level failure — fetch itself threw (no response from Vercel).
    // statusCode 0 signals a network error to the caller.
    throw new VercelApiError(0, 'network_error');
  }

  // ── Parse JSON response ───────────────────────────────────────────────────────
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new VercelApiError(res.status, 'parse_error');
  }

  // ── Error handling ────────────────────────────────────────────────────────────
  if (!res.ok) {
    const errBody = json as VercelErrorResponse;
    const code = errBody?.error?.code ?? 'unknown';

    if (res.status === 401 || res.status === 403) {
      // Do NOT include any auth detail or token hint in this error.
      throw new VercelAuthError();
    }

    if (res.status === 409 && code === 'domain_taken') {
      throw new VercelDomainTakenError(hostname);
    }

    if (res.status === 429) {
      const retryAfterHeader = res.headers.get('Retry-After');
      const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : undefined;
      throw new VercelRateLimitError(Number.isFinite(retryAfter) ? retryAfter : undefined);
    }

    // All other 4xx and 5xx errors
    throw new VercelApiError(res.status, code);
  }

  // ── Map success response → VercelRegistrationData ────────────────────────────
  const data = json as VercelDomainResponse;

  // Apex detection: if the registered name equals the apex domain,
  // Vercel uses A records (not CNAME) — so cnameName/cnameValue are null.
  const isApex = data.name === data.apexName;

  // verification[] may be empty if the domain is already verified on this project.
  const verification = Array.isArray(data.verification) ? data.verification[0] : undefined;

  if (!verification) {
    // Log a warning — this is unusual but not a failure.
    // No secrets are referenced in this message.
    console.warn(
      `[vercel/domains] No verification records returned for "${hostname}". ` +
        'The domain may already be verified on this project.'
    );
  }

  return {
    // Use the hostname (data.name) as the stable Vercel domain identifier.
    // Vercel's own domain-level endpoints are keyed by hostname, not by a UUID.
    vercelDomainId: data.name,
    txtName: verification?.domain ?? '',
    txtValue: verification?.value ?? '',
    cnameName: isApex ? null : data.name,
    cnameValue: isApex ? null : 'cname.vercel-dns.com',
    // createdBy is set by the route — not available from the Vercel response.
  };
}

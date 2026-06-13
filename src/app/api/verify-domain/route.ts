import { NextRequest, NextResponse } from 'next/server';

// RFC-1123 DNS hostname: labels of 1-63 chars separated by dots, total ≤ 253 chars
const DNS_HOSTNAME_RE =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/**
 * Hostnames reserved for internal infrastructure.
 * Clients cannot claim these as custom domains.
 */
const RESERVED_HOSTNAMES = new Set([
  'app.chainx.ch',
  'chainx.ch',
  'chainx.app',
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const raw =
    typeof (body as Record<string, unknown>).hostname === 'string'
      ? ((body as Record<string, unknown>).hostname as string).trim().toLowerCase()
      : '';

  if (!raw) {
    return NextResponse.json({ success: false, error: 'hostname is required.' }, { status: 400 });
  }

  if (raw.length > 253) {
    return NextResponse.json(
      { success: false, error: 'Hostname exceeds maximum length (253 chars).' },
      { status: 400 }
    );
  }

  if (!DNS_HOSTNAME_RE.test(raw)) {
    return NextResponse.json(
      { success: false, error: 'Invalid hostname format. Must be a valid DNS name.' },
      { status: 400 }
    );
  }

  if (RESERVED_HOSTNAMES.has(raw)) {
    return NextResponse.json(
      { success: false, error: 'This hostname is reserved and cannot be used.' },
      { status: 400 }
    );
  }

  // Sprint 7.2: mock-safe response.
  // Sprint 9 will integrate Vercel Domains API for real DNS verification.
  return NextResponse.json({
    success: true,
    status: 'pending',
    hostname: raw,
  });
}

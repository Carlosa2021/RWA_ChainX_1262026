import { NextRequest, NextResponse } from 'next/server';

// DNS hostname regex: allows labels of 1-63 chars separated by dots, total ≤ 253 chars
const DNS_HOSTNAME_RE =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const domain =
    typeof (body as Record<string, unknown>).domain === 'string'
      ? ((body as Record<string, unknown>).domain as string).trim().toLowerCase()
      : '';

  if (!domain) {
    return NextResponse.json({ success: false, error: 'domain is required.' }, { status: 400 });
  }

  if (domain.length > 253) {
    return NextResponse.json(
      { success: false, error: 'Domain exceeds maximum length (253 chars).' },
      { status: 400 }
    );
  }

  if (!DNS_HOSTNAME_RE.test(domain)) {
    return NextResponse.json({ success: false, error: 'Invalid domain format.' }, { status: 400 });
  }

  // Phase 2: mock-safe response — real Vercel Domains API integration is Sprint 7
  return NextResponse.json({
    success: true,
    domain,
    status: 'pending',
    message: 'Domain verification request received. Configure your DNS CNAME record as instructed.',
    cname: {
      type: 'CNAME',
      host: domain.split('.')[0],
      value: 'cname.chainx.app',
    },
  });
}

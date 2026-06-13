import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { kycAdminEmail, kycConfirmationEmail, type KycEmailData } from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.CHAINX_ADMIN_EMAIL!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, documentType, applicantEmail } = body as Partial<KycEmailData>;

    // Input validation
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json({ error: 'Wallet address inválida' }, { status: 400 });
    }
    if (!documentType || typeof documentType !== 'string') {
      return NextResponse.json({ error: 'Tipo de documento requerido' }, { status: 400 });
    }

    const data: KycEmailData = {
      walletAddress,
      documentType: documentType.trim(),
      submittedAt: new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        dateStyle: 'full',
        timeStyle: 'short',
      }),
      applicantEmail: applicantEmail?.trim().toLowerCase(),
    };

    const emailJobs: Promise<unknown>[] = [
      resend.emails.send({
        from: `ChainX RWA <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `KYC recibido: ${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`,
        html: kycAdminEmail(data),
      }),
    ];

    // Only send confirmation if applicant email provided
    if (applicantEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicantEmail)) {
      emailJobs.push(
        resend.emails.send({
          from: `ChainX RWA <${FROM_EMAIL}>`,
          to: [applicantEmail],
          subject: 'Documentos KYC recibidos — ChainX RWA',
          html: kycConfirmationEmail(data),
        })
      );
    }

    const results = await Promise.allSettled(emailJobs);

    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        console.error(`[kyc-notify] Email job ${i} failed:`, result.reason);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[kyc-notify] Unexpected error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

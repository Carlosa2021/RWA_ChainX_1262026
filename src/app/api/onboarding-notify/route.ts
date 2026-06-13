import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  onboardingAdminEmail,
  onboardingConfirmationEmail,
  type OnboardingEmailData,
} from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.CHAINX_ADMIN_EMAIL!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { legalName, contactName, contactEmail, country, plan } =
      body as Partial<OnboardingEmailData>;

    // Input validation
    if (!legalName || typeof legalName !== 'string' || legalName.trim().length < 2) {
      return NextResponse.json({ error: 'Nombre de empresa inválido' }, { status: 400 });
    }
    if (!contactName || typeof contactName !== 'string') {
      return NextResponse.json({ error: 'Nombre de contacto requerido' }, { status: 400 });
    }
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json({ error: 'Email de contacto inválido' }, { status: 400 });
    }

    const data: OnboardingEmailData = {
      legalName: legalName.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      country: (country ?? 'No especificado').trim(),
      plan: (plan ?? 'No especificado').trim(),
      submittedAt: new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    };

    const [adminResult, customerResult] = await Promise.allSettled([
      resend.emails.send({
        from: `ChainX RWA <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        subject: `Nueva empresa onboarding: ${data.legalName} — Plan ${data.plan}`,
        html: onboardingAdminEmail(data),
      }),
      resend.emails.send({
        from: `ChainX RWA <${FROM_EMAIL}>`,
        to: [data.contactEmail],
        subject: `Bienvenido a ChainX RWA — ${data.legalName}`,
        html: onboardingConfirmationEmail(data),
      }),
    ]);

    if (adminResult.status === 'rejected') {
      console.error('[onboarding-notify] Admin email failed:', adminResult.reason);
      // Still return success — onboarding itself completed, email is secondary
    }

    if (customerResult.status === 'rejected') {
      console.warn('[onboarding-notify] Customer email failed:', customerResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[onboarding-notify] Unexpected error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

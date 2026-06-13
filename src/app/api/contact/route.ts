import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  contactAdminEmail,
  contactConfirmationEmail,
  type ContactEmailData,
} from '@/lib/email/templates';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.CHAINX_ADMIN_EMAIL!;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body as Partial<ContactEmailData>;

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nombre requerido (mínimo 2 caracteres)' },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Mensaje requerido (mínimo 10 caracteres)' },
        { status: 400 }
      );
    }

    const data: ContactEmailData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim(),
      message: message.trim(),
    };

    // Send both emails in parallel
    const [adminResult, customerResult] = await Promise.allSettled([
      resend.emails.send({
        from: `ChainX RWA <${FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        replyTo: data.email,
        subject: `Nuevo contacto: ${data.name}${data.company ? ` (${data.company})` : ''}`,
        html: contactAdminEmail(data),
      }),
      resend.emails.send({
        from: `ChainX RWA <${FROM_EMAIL}>`,
        to: [data.email],
        subject: 'Hemos recibido tu mensaje — ChainX RWA',
        html: contactConfirmationEmail(data),
      }),
    ]);

    if (adminResult.status === 'rejected') {
      console.error('[contact/route] Admin email failed:', adminResult.reason);
      return NextResponse.json(
        { error: 'Error al enviar el mensaje. Inténtalo de nuevo.' },
        { status: 500 }
      );
    }

    if (customerResult.status === 'rejected') {
      // Admin email succeeded — log warning but return success to user
      console.warn('[contact/route] Customer confirmation email failed:', customerResult.reason);
    }

    return NextResponse.json({ success: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('[contact/route] Unexpected error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}

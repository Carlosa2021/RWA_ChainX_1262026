/**
 * ChainX RWA — Reusable email HTML templates
 * All templates are server-side only (never imported in client components).
 */

const BRAND_COLOR = '#2563EB'; // Institutional blue
const BRAND_NAME = process.env.NEXT_PUBLIC_BRAND_NAME ?? 'ChainX RWA';
const BRAND_DOMAIN = process.env.NEXT_PUBLIC_BRAND_DOMAIN ?? 'app.chainx.ch';
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_BRAND_SUPPORT_EMAIL ?? 'hola@chainx.ch';

function baseLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND_COLOR};border-radius:8px 8px 0 0;padding:28px 36px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                ${BRAND_NAME}
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.75);">
                Real World Assets Tokenization Platform
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px;border-radius:0 0 8px 8px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                © ${new Date().getFullYear()} ChainX® — Registered trademark N° 830657, Switzerland<br/>
                <a href="https://${BRAND_DOMAIN}" style="color:${BRAND_COLOR};text-decoration:none;">${BRAND_DOMAIN}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────────────────

export interface ContactEmailData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export function contactAdminEmail(data: ContactEmailData): string {
  return baseLayout(
    'Nuevo mensaje de contacto — ChainX RWA',
    `<h2 style="margin:0 0 20px;font-size:20px;color:#111827;">Nuevo mensaje de contacto</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Nombre</span><br/>
        <span style="font-size:15px;color:#111827;font-weight:600;">${data.name}</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Email</span><br/>
        <a href="mailto:${data.email}" style="font-size:15px;color:${BRAND_COLOR};">${data.email}</a>
      </td></tr>
      ${
        data.company
          ? `<tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Empresa</span><br/>
        <span style="font-size:15px;color:#111827;">${data.company}</span>
      </td></tr>`
          : ''
      }
      <tr><td style="padding:8px 0;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Mensaje</span><br/>
        <p style="margin:8px 0 0;font-size:15px;color:#374151;line-height:1.6;background:#f9fafb;padding:16px;border-radius:6px;border-left:3px solid ${BRAND_COLOR};">${data.message.replace(/\n/g, '<br/>')}</p>
      </td></tr>
    </table>
    <div style="margin-top:24px;padding:16px;background:#eff6ff;border-radius:6px;">
      <p style="margin:0;font-size:13px;color:#1e40af;">
        Responde directamente a: <a href="mailto:${data.email}" style="color:${BRAND_COLOR};font-weight:600;">${data.email}</a>
      </p>
    </div>`
  );
}

export function contactConfirmationEmail(data: ContactEmailData): string {
  return baseLayout(
    'Hemos recibido tu mensaje — ChainX RWA',
    `<h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Gracias por contactarnos, ${data.name}.</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hemos recibido tu mensaje y te responderemos en un plazo de 24–48 horas hábiles.</p>
    <div style="background:#f9fafb;border-radius:6px;padding:20px;border-left:3px solid ${BRAND_COLOR};">
      <p style="margin:0 0 6px;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Tu mensaje</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">${data.message.replace(/\n/g, '<br/>')}</p>
    </div>
    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;">
      Si tienes alguna pregunta urgente, puedes contactarnos directamente en 
      <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR};">${SUPPORT_EMAIL}</a>.
    </p>`
  );
}

// ─────────────────────────────────────────────
// ONBOARDING COMPLETION
// ─────────────────────────────────────────────

export interface OnboardingEmailData {
  legalName: string;
  contactName: string;
  contactEmail: string;
  country: string;
  plan: string;
  submittedAt: string;
}

export function onboardingAdminEmail(data: OnboardingEmailData): string {
  return baseLayout(
    `Nueva empresa onboarding: ${data.legalName}`,
    `<h2 style="margin:0 0 20px;font-size:20px;color:#111827;">🏢 Nueva empresa completó el onboarding</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Empresa</span><br/>
        <span style="font-size:16px;color:#111827;font-weight:700;">${data.legalName}</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Contacto</span><br/>
        <span style="font-size:15px;color:#111827;">${data.contactName}</span>
        &nbsp;—&nbsp;<a href="mailto:${data.contactEmail}" style="color:${BRAND_COLOR};">${data.contactEmail}</a>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">País</span><br/>
        <span style="font-size:15px;color:#111827;">${data.country}</span>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Plan seleccionado</span><br/>
        <span style="font-size:15px;color:#111827;font-weight:600;">${data.plan}</span>
      </td></tr>
      <tr><td style="padding:8px 0;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Enviado</span><br/>
        <span style="font-size:14px;color:#374151;">${data.submittedAt}</span>
      </td></tr>
    </table>
    <div style="margin-top:24px;">
      <a href="https://${BRAND_DOMAIN}/admin/users" 
         style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">
        Ver en el panel de administración →
      </a>
    </div>`
  );
}

export function onboardingConfirmationEmail(data: OnboardingEmailData): string {
  return baseLayout(
    'Bienvenido a ChainX RWA — Onboarding completado',
    `<h2 style="margin:0 0 8px;font-size:20px;color:#111827;">¡Bienvenido a ChainX RWA, ${data.contactName}!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">
      Tu empresa <strong style="color:#111827;">${data.legalName}</strong> ha completado el proceso de onboarding correctamente.
      Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en un plazo de 24–48 horas hábiles.
    </p>
    <div style="background:#eff6ff;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1e40af;">Resumen de tu solicitud</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6b7280;width:140px;">Empresa</td>
          <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:600;">${data.legalName}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6b7280;">Plan</td>
          <td style="padding:4px 0;font-size:13px;color:#111827;font-weight:600;">${data.plan}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;font-size:13px;color:#6b7280;">País</td>
          <td style="padding:4px 0;font-size:13px;color:#111827;">${data.country}</td>
        </tr>
      </table>
    </div>
    <p style="margin:0 0 8px;font-size:14px;color:#374151;">Próximos pasos:</p>
    <ol style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#374151;line-height:2;">
      <li>Revisión de documentos legales por nuestro equipo (24–48h)</li>
      <li>Configuración de tu instancia Enterprise</li>
      <li>Llamada de onboarding con tu gestor de cuenta</li>
    </ol>
    <p style="margin:0;font-size:13px;color:#6b7280;">
      ¿Preguntas? Escríbenos a 
      <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR};">${SUPPORT_EMAIL}</a>
    </p>`
  );
}

// ─────────────────────────────────────────────
// KYC SUBMISSION
// ─────────────────────────────────────────────

export interface KycEmailData {
  walletAddress: string;
  documentType: string;
  submittedAt: string;
  applicantEmail?: string;
}

export function kycAdminEmail(data: KycEmailData): string {
  return baseLayout(
    'Nueva solicitud KYC — ChainX RWA',
    `<h2 style="margin:0 0 20px;font-size:20px;color:#111827;">🔐 Nueva solicitud KYC recibida</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Wallet</span><br/>
        <code style="font-size:13px;color:#111827;background:#f3f4f6;padding:3px 6px;border-radius:4px;">${data.walletAddress}</code>
      </td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Tipo de documento</span><br/>
        <span style="font-size:15px;color:#111827;font-weight:600;">${data.documentType.toUpperCase()}</span>
      </td></tr>
      ${
        data.applicantEmail
          ? `<tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Email solicitante</span><br/>
        <a href="mailto:${data.applicantEmail}" style="color:${BRAND_COLOR};">${data.applicantEmail}</a>
      </td></tr>`
          : ''
      }
      <tr><td style="padding:8px 0;">
        <span style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Enviado</span><br/>
        <span style="font-size:14px;color:#374151;">${data.submittedAt}</span>
      </td></tr>
    </table>
    <div style="margin-top:24px;">
      <a href="https://${BRAND_DOMAIN}/admin/users"
         style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">
        Revisar solicitud →
      </a>
    </div>`
  );
}

export function kycConfirmationEmail(data: KycEmailData): string {
  return baseLayout(
    'Documentos KYC recibidos — ChainX RWA',
    `<h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Documentos recibidos correctamente</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">
      Hemos recibido tus documentos KYC. Nuestro equipo de compliance los revisará en un plazo de 24–48 horas hábiles.
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#15803d;">✓ Documentos en revisión</p>
      <p style="margin:0;font-size:13px;color:#166534;">
        Wallet: <code style="background:#dcfce7;padding:2px 6px;border-radius:3px;">${data.walletAddress.slice(0, 6)}...${data.walletAddress.slice(-4)}</code>
        &nbsp;·&nbsp; Tipo: <strong>${data.documentType.toUpperCase()}</strong>
      </p>
    </div>
    <p style="margin:0 0 8px;font-size:14px;color:#374151;">Una vez verificado recibirás:</p>
    <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#374151;line-height:2;">
      <li>Confirmación de aprobación por email</li>
      <li>Acceso completo a inversiones en la plataforma</li>
      <li>Tokens de seguridad ERC-3643 en tu wallet</li>
    </ul>
    <p style="margin:0;font-size:13px;color:#6b7280;">
      ¿Preguntas sobre el proceso KYC? 
      <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND_COLOR};">${SUPPORT_EMAIL}</a>
    </p>`
  );
}

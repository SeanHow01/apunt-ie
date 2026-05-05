// lib/setu/email.ts
import { Resend } from 'resend'
import type { SafApplication } from './saf-types'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@apunt.ie'

const BASE = `
  <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px 20px; color: #1A1A18;">
  <div style="font-size: 11px; font-family: monospace; color: #999; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">SETU Student Assistance Fund · Punt</div>
`
const FOOT = `
  <p style="font-size: 11px; font-family: system-ui; color: #bbb; margin-top: 32px;">Punt is an independent financial education platform. This email was sent because you have an active SAF application at apunt.ie/setu.</p>
  </div>
`

export async function sendApplicationConfirmed(
  to: string,
  application: Pick<SafApplication, 'reference_number' | 'amount_requested'>
): Promise<void> {
  if (!process.env.RESEND_API_KEY) { console.warn('[email] RESEND_API_KEY missing — skipping'); return }
  await resend.emails.send({
    from: FROM, to,
    subject: `SAF application received — ${application.reference_number}`,
    html: `${BASE}
      <h1 style="font-size:22px;font-weight:400;margin:0 0 16px;letter-spacing:-0.02em;">Application received</h1>
      <p style="font-size:14px;font-family:system-ui;color:#555;line-height:1.6;margin:0 0 12px;">Your SAF application has been received and will be reviewed by the committee.</p>
      <div style="background:#F5F2EC;border:1px solid #E8E5DC;border-radius:6px;padding:16px;margin:20px 0;font-family:monospace;font-size:14px;color:#1A1A18;">
        Reference: <strong>${application.reference_number}</strong><br/>
        Amount requested: <strong>€${(application.amount_requested ?? 0).toFixed(2)}</strong>
      </div>
      <p style="font-size:14px;font-family:system-ui;color:#555;line-height:1.6;margin:0 0 8px;">The committee typically meets every 3–4 weeks. You will be notified at this email address when a decision has been made.</p>
      <p style="font-size:14px;font-family:system-ui;color:#555;line-height:1.6;margin:0 0 24px;">If you have questions, contact Student Services at <a href="mailto:studentservices@setu.ie" style="color:#C0392B;">studentservices@setu.ie</a>.</p>
      <a href="https://apunt.ie/setu/saf/${application.reference_number}" style="display:inline-block;padding:10px 20px;background:#1A1A18;color:#fff;text-decoration:none;border-radius:5px;font-family:system-ui;font-size:13px;font-weight:600;">Track your application →</a>
    ${FOOT}`,
  })
}

export async function sendInfoRequested(
  to: string,
  application: Pick<SafApplication, 'reference_number' | 'info_requested_note'>
): Promise<void> {
  if (!process.env.RESEND_API_KEY) { console.warn('[email] RESEND_API_KEY missing — skipping'); return }
  await resend.emails.send({
    from: FROM, to,
    subject: `Additional information needed — ${application.reference_number}`,
    html: `${BASE}
      <h1 style="font-size:22px;font-weight:400;margin:0 0 16px;">Additional information needed</h1>
      <p style="font-size:14px;font-family:system-ui;color:#555;line-height:1.6;margin:0 0 16px;">The SAF committee has reviewed your application <strong style="font-family:monospace;">${application.reference_number}</strong> and requires some additional information before a decision can be made.</p>
      <div style="background:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;padding:16px;margin:20px 0;font-size:14px;font-family:system-ui;color:#92400E;line-height:1.6;">
        <strong>What the committee needs:</strong><br/>${application.info_requested_note ?? ''}
      </div>
      <p style="font-size:14px;font-family:system-ui;color:#555;line-height:1.6;margin:0 0 24px;">Please upload the requested documents as soon as possible.</p>
      <a href="https://apunt.ie/setu/saf/${application.reference_number}" style="display:inline-block;padding:10px 20px;background:#1A1A18;color:#fff;text-decoration:none;border-radius:5px;font-family:system-ui;font-size:13px;font-weight:600;">Upload documents →</a>
    ${FOOT}`,
  })
}

export async function sendDecision(
  to: string,
  application: Pick<SafApplication, 'reference_number' | 'status' | 'amount_awarded'>
): Promise<void> {
  if (!process.env.RESEND_API_KEY) { console.warn('[email] RESEND_API_KEY missing — skipping'); return }
  const approved = application.status === 'approved'
  await resend.emails.send({
    from: FROM, to,
    subject: approved ? `SAF application approved — ${application.reference_number}` : `SAF application outcome — ${application.reference_number}`,
    html: `${BASE}
      <h1 style="font-size:22px;font-weight:400;margin:0 0 16px;">${approved ? 'Application approved' : 'Application outcome'}</h1>
      ${approved
        ? `<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:16px;margin:0 0 16px;"><div style="font-size:14px;font-family:system-ui;color:#15803D;line-height:1.6;">Your application <strong style="font-family:monospace;">${application.reference_number}</strong> has been approved for <strong>€${(application.amount_awarded ?? 0).toFixed(2)}</strong>. Payment will be made to the bank account provided within 5–10 working days.</div></div>`
        : `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:16px;margin:0 0 16px;"><div style="font-size:14px;font-family:system-ui;color:#991B1B;line-height:1.6;">Your application <strong style="font-family:monospace;">${application.reference_number}</strong> was unsuccessful. You may submit a new application with additional information, or appeal the decision. Contact Student Services for details.</div></div>`
      }
      <p style="font-size:13px;font-family:system-ui;color:#555;line-height:1.6;">For queries contact <a href="mailto:studentservices@setu.ie" style="color:#C0392B;">studentservices@setu.ie</a> or call in to Student Services.</p>
      ${!approved ? `<p style="font-size:13px;font-family:system-ui;color:#555;line-height:1.6;">MABS also provides free, confidential money advice: <strong>0818 07 2050</strong> or <a href="https://www.mabs.ie" style="color:#C0392B;">mabs.ie</a></p>` : ''}
    ${FOOT}`,
  })
}

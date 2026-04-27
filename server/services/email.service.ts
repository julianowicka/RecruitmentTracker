import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../lib/config';

interface VerificationEmailInput {
  to: string;
  name: string;
  verificationUrl: string;
}

class EmailService {
  isConfigured(): boolean {
    return Boolean(EMAIL_CONFIG.SMTP_HOST || EMAIL_CONFIG.LOG_VERIFICATION_LINKS);
  }

  private getTransporter() {
    if (!EMAIL_CONFIG.SMTP_HOST) {
      return null;
    }

    return nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP_HOST,
      port: EMAIL_CONFIG.SMTP_PORT,
      secure: EMAIL_CONFIG.SMTP_SECURE,
      auth: EMAIL_CONFIG.SMTP_USER
        ? {
            user: EMAIL_CONFIG.SMTP_USER,
            pass: EMAIL_CONFIG.SMTP_PASS,
          }
        : undefined,
    });
  }

  async sendVerificationEmail({ to, name, verificationUrl }: VerificationEmailInput): Promise<void> {
    const transporter = this.getTransporter();

    if (!transporter && EMAIL_CONFIG.LOG_VERIFICATION_LINKS) {
      console.log(`[email] Verification email for ${to}: ${verificationUrl}`);
      return;
    }

    if (!transporter) {
      throw new Error('Email delivery is not configured');
    }

    await transporter.sendMail({
      from: EMAIL_CONFIG.FROM,
      to,
      subject: 'Potwierdz email w Recruitment Tracker',
      text: [
        `Czesc ${name},`,
        '',
        'Potwierdz adres email, klikajac w link:',
        verificationUrl,
        '',
        'Link wygasa za 24 godziny.',
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
          <h1>Potwierdz email</h1>
          <p>Czesc ${escapeHtml(name)},</p>
          <p>Potwierdz adres email, zeby aktywowac konto w Recruitment Tracker.</p>
          <p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 16px; background: #0f172a; color: #fff; text-decoration: none; border-radius: 8px;">
              Potwierdz email
            </a>
          </p>
          <p>Jesli przycisk nie dziala, wklej ten link w przegladarce:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>Link wygasa za 24 godziny.</p>
        </div>
      `,
    });
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export const emailService = new EmailService();

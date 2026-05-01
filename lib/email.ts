import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  if (!resend) {
    console.warn('Resend not configured — skipping email send');
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@sellsnap.com',
    to: email,
    subject: 'Reset your SellSnap password',
    html: `
      <p>You requested a password reset for your SellSnap account.</p>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });

  if (error) {
    console.error('Failed to send reset email', { error });
  }
}

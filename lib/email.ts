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

export async function sendPaymentConfirmationEmail(params: {
  sellerEmail: string;
  sellerName: string;
  productName: string;
  amount: number;
  buyerEmail?: string | null;
  dashboardUrl: string;
}) {
  if (!resend) {
    console.warn('Resend not configured — skipping email send');
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'noreply@sellsnap.com',
    to: params.sellerEmail,
    subject: `You've got a sale — ₦${params.amount.toLocaleString()} for ${params.productName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="margin-bottom: 8px;">You made a sale! 🎉</h2>
        <p style="color: #555; margin-bottom: 24px;">${params.productName} was just purchased.</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Product</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600;">${params.productName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-size: 14px;">Amount</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600;">₦${params.amount.toLocaleString()}</td>
          </tr>
          ${params.buyerEmail ? `<tr><td style="padding: 8px 0; color: #888; font-size: 14px;">Buyer</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${params.buyerEmail}</td></tr>` : ''}
        </table>
        <a href="${params.dashboardUrl}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #111; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">View in Dashboard</a>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send payment confirmation email', { error });
  }
}

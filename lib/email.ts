import { Resend } from 'resend';
import { render } from '@react-email/render';
import * as React from 'react';
import nodemailer from 'nodemailer';

// Auth Templates
import { WelcomeEmail } from '@/components/emails/templates/auth/WelcomeEmail';
import { EmailVerification } from '@/components/emails/templates/auth/EmailVerification';
import { ForgotPassword } from '@/components/emails/templates/auth/ForgotPassword';
import { PasswordResetSuccess } from '@/components/emails/templates/auth/PasswordResetSuccess';

// Payment Templates
import { SellerPaymentReceived } from '@/components/emails/templates/payments/SellerPaymentReceived';
// import { CustomerPaymentReceipt } from '@/components/emails/templates/payments/CustomerPaymentReceipt';

// Withdrawal Templates
// import { WithdrawalInitiated } from '@/components/emails/templates/withdrawals/WithdrawalInitiated';
// import { WithdrawalSuccess } from '@/components/emails/templates/withdrawals/WithdrawalSuccess';
// import { WithdrawalFailed } from '@/components/emails/templates/withdrawals/WithdrawalFailed';

// Security Templates
// import { NewLoginAlert } from '@/components/emails/templates/security/NewLoginAlert';
// import { EmailChanged } from '@/components/emails/templates/security/EmailChanged';
// import { AccountDeleted } from '@/components/emails/templates/security/AccountDeleted';


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.EMAIL_FROM || 'noreply@sellsnap.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, element: React.ReactElement) {
  try {
    const html = await render(element);
    
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const info = await transporter.sendMail({
        from: `"SellSnap" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      return { success: true, data: info.messageId };
    } else {
      console.warn(`No email provider configured — skipping email send [${subject}] to [${to}]`);
      return { success: false, error: 'No email provider configured' };
    }
  } catch (error) {
    console.error('Error rendering or sending email:', error);
    return { success: false, error: 'Internal server error during email dispatch' };
  }
}

// ==========================================
// AUTHENTICATION EMAILS
// ==========================================

export async function sendWelcomeEmail(to: string, name: string, dashboardUrl: string) {
  return sendEmail(
    to,
    'Welcome to SellSnap!',
    React.createElement(WelcomeEmail, { name, dashboardUrl })
  );
}

export async function sendEmailVerification(to: string, name: string, verifyUrl: string) {
  return sendEmail(
    to,
    'Verify your SellSnap email address',
    React.createElement(EmailVerification, { name, verifyUrl })
  );
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  return sendEmail(
    to,
    'Reset your SellSnap password',
    React.createElement(ForgotPassword, { name, resetUrl })
  );
}

export async function sendPasswordResetSuccess(to: string, name: string) {
  return sendEmail(
    to,
    'Password reset successful',
    React.createElement(PasswordResetSuccess, { name })
  );
}

// ==========================================
// PAYMENT EMAILS
// ==========================================

export async function sendSellerPaymentReceived(
  to: string,
  sellerName: string,
  productName: string,
  amount: number,
  dashboardUrl: string,
  buyerEmail?: string | null
) {
  return sendEmail(
    to,
    `You've got a sale — ₦${amount.toLocaleString()} for ${productName}`,
    React.createElement(SellerPaymentReceived, {
      sellerName,
      productName,
      amount,
      buyerEmail,
      dashboardUrl,
    })
  );
}

// export async function sendCustomerPaymentReceipt(
//   to: string,
//   productName: string,
//   amount: number,
//   sellerBusinessName: string,
//   transactionReference: string
// ) {
//   return sendEmail(
//     to,
//     `Receipt for your purchase of ${productName}`,
//     React.createElement(CustomerPaymentReceipt, {
//       productName,
//       amount,
//       sellerBusinessName,
//       transactionReference,
//     })
//   );
// }

// ==========================================
// WITHDRAWAL EMAILS
// ==========================================

// export async function sendWithdrawalInitiated(
//   to: string,
//   name: string,
//   amount: number,
//   bankName: string,
//   accountNumber: string,
//   expectedDate: string
// ) {
//   return sendEmail(
//     to,
//     `Your withdrawal of ₦${amount.toLocaleString()} has been initiated`,
//     React.createElement(WithdrawalInitiated, {
//       name,
//       amount,
//       bankName,
//       accountNumber,
//       expectedDate,
//     })
//   );
// }

// export async function sendWithdrawalSuccess(
//   to: string,
//   name: string,
//   amount: number,
//   bankName: string,
//   accountNumber: string
// ) {
//   return sendEmail(
//     to,
//     `Your withdrawal of ₦${amount.toLocaleString()} was successful`,
//     React.createElement(WithdrawalSuccess, {
//       name,
//       amount,
//       bankName,
//       accountNumber,
//     })
//   );
// }

// export async function sendWithdrawalFailed(
//   to: string,
//   name: string,
//   amount: number,
//   bankName: string,
//   accountNumber: string,
//   reason: string
// ) {
//   return sendEmail(
//     to,
//     `Your withdrawal of ₦${amount.toLocaleString()} failed`,
//     React.createElement(WithdrawalFailed, {
//       name,
//       amount,
//       bankName,
//       accountNumber,
//       reason,
//     })
//   );
// }

// ==========================================
// SECURITY EMAILS
// ==========================================

// export async function sendNewLoginAlert(
//   to: string,
//   name: string,
//   deviceInfo: string,
//   location: string,
//   time: string
// ) {
//   return sendEmail(
//     to,
//     'New login to your SellSnap account',
//     React.createElement(NewLoginAlert, {
//       name,
//       deviceInfo,
//       location,
//       time,
//     })
//   );
// }

// export async function sendEmailChanged(to: string, name: string, newEmail: string) {
//   return sendEmail(
//     to,
//     'Your SellSnap email was updated',
//     React.createElement(EmailChanged, { name, newEmail })
//   );
// }

// export async function sendAccountDeleted(to: string, name: string) {
//   return sendEmail(
//     to,
//     'Your SellSnap account has been deleted',
//     React.createElement(AccountDeleted, { name })
//   );
// }

// ==========================================
// SUPPORT SYSTEM (NODEMAILER)
// ==========================================

// Transporter is now defined at the top of the file

export async function sendSupportNotification(ticket: { name: string; email: string; subject: string; message: string; id: string }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('Nodemailer not configured — skipping support notification email');
    return { success: false, error: 'SMTP not configured' };
  }

  const supportEmail = process.env.SUPPORT_EMAIL || 'admin@sellsnap.com';

  try {
    const info = await transporter.sendMail({
      from: `"SellSnap Support" <${process.env.SMTP_USER}>`,
      to: supportEmail,
      subject: `New Support Ticket: ${ticket.subject} [${ticket.id}]`,
      text: `Name: ${ticket.name}\nEmail: ${ticket.email}\nSubject: ${ticket.subject}\n\nMessage:\n${ticket.message}`,
      replyTo: ticket.email,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send support notification via nodemailer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

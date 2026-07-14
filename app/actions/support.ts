'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { sendSupportNotification } from '@/lib/email';

const supportSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitSupportTicket(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const parsed = supportSchema.safeParse(rawData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { name, email, subject, message } = parsed.data;

    // 1. Save to Database
    const ticket = await db.supportTicket.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // 2. Send Email Notification
    await sendSupportNotification({
      id: ticket.id,
      name,
      email,
      subject,
      message,
    });

    return { success: true };
  } catch (error) {
    console.error('submitSupportTicket.failed', { error });
    return { success: false, error: 'Something went wrong. Please try again later.' };
  }
}

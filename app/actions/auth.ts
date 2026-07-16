'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'Minimum 8 characters with uppercase, lowercase, number & special character'),
  businessName: z.string().optional(),
});

export async function signUp(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const parsed = signUpSchema.safeParse(rawData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { password, name, businessName } = parsed.data;
    const email = parsed.data.email.toLowerCase();

    // Rate limit signup by email
    const rl = await rateLimit(`signup_${email}`, 3, 3600000); // 3 signups per hour per email
    if (!rl.success) {
      return { success: false, error: 'Too many signup attempts. Please try again later.' };
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        email,
        passwordHash,
        name,
        businessName,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('auth.signup.failed', { error });
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

export async function forgotPassword(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const { email } = rawData as { email: string };
    const normalizedEmail = email?.toLowerCase();

    // Rate limit forgot password by email
    const rl = await rateLimit(`forgot_${normalizedEmail}`, 3, 3600000); // 3 attempts per hour
    if (!rl.success) {
      return { success: false, error: 'Too many requests. Please try again later.' };
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'Enter a valid email address' };
    }

    const user = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return { success: false, error: 'No account found with that email' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordResetToken.create({
      data: { email: normalizedEmail, token, expiresAt },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/auth/reset-password?token=${token}`;
    await sendPasswordResetEmail(normalizedEmail, user.name, resetLink);

    return { success: true };
  } catch (error) {
    console.error('auth.forgotPassword.failed', { error });
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'Minimum 8 characters with uppercase, lowercase, number & special character'),
});

export async function resetPassword(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const parsed = resetPasswordSchema.safeParse(rawData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { token, password } = parsed.data;

    // Rate limit reset attempts by token
    const rl = await rateLimit(`reset_${token}`, 5, 3600000); // 5 attempts per hour
    if (!rl.success) {
      return { success: false, error: 'Too many attempts. Please try again later.' };
    }

    const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken) {
      return { success: false, error: 'Invalid or expired reset link' };
    }

    if (resetToken.usedAt) {
      return { success: false, error: 'This reset link has already been used' };
    }

    if (resetToken.expiresAt < new Date()) {
      return { success: false, error: 'This reset link has expired' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    await db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    console.error('auth.resetPassword.failed', { error });
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

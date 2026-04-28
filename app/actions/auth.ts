'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().optional(),
});

export async function signUp(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData);
    const parsed = signUpSchema.safeParse(rawData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { email, password, name, businessName } = parsed.data;

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

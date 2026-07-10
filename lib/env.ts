import { z } from 'zod';

const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

const envSchema = z.object({
  DATABASE_URL: isSQLite
    ? z.string().min(1)
    : z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  FLW_PUBLIC_KEY: z.string().min(1),
  FLW_SECRET_KEY: z.string().min(1),
  FLW_WEBHOOK_HASH: z.string().min(1),
  CLOUDINARY_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  // Support both NEXTAUTH_SECRET and AUTH_SECRET (NextAuth v5 renamed it)
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.AUTH_URL,
  FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
  FLW_WEBHOOK_HASH: process.env.FLW_WEBHOOK_HASH,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  // Treat empty string as undefined so optional() passes
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  EMAIL_FROM: process.env.EMAIL_FROM,
});

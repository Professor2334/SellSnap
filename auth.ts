import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { rateLimit } from '@/lib/rate-limit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const email = credentials.email as string;
        const normalizedEmail = email.toLowerCase();

        // Rate limit by email to prevent brute force
        const rl = await rateLimit(`login_${normalizedEmail}`, 5, 60000); // 5 attempts per minute
        if (!rl.success) {
          throw new Error('Too many login attempts. Please try again later.');
        }
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email: normalizedEmail },
        });

        // User might exist via Google OAuth and not have a passwordHash
        if (!user || !user.passwordHash) {
          throw new Error('No user found with this email or password not set');
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isOnboarded: user.isOnboarded,
          businessName: user.businessName,
        };
      },
    }),
  ],
});

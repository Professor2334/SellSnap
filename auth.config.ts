import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth',
  },
  providers: [], // Providers are added in auth.ts to avoid Edge issues
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.isOnboarded = (user as any).isOnboarded;
        token.businessName = (user as any).businessName;
      }
      if (trigger === 'update' && session) {
        // You can update the token if needed when `useSession().update()` is called
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        // Cast as any or define types if needed, using standard ts handling here
        (session.user as any).isOnboarded = token.isOnboarded as boolean;
        (session.user as any).businessName = token.businessName as string | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

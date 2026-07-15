import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

const authMiddleware = auth((req) => {
  const token = req.auth;
  const isOnboarded = (token?.user as any)?.isOnboarded as boolean | undefined;
  
  const isRootPage = req.nextUrl.pathname === '/';
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding');

  // Authenticated user visiting the root/landing page → redirect to dashboard or onboarding
  if (token && isRootPage) {
    if (!isOnboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.nextUrl));
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Unauthenticated user trying to access a protected page → send to login
  if (!token && (isDashboardPage || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/auth', req.nextUrl));
  }

  // Authenticated user visiting the auth page → send them home or to onboarding
  if (token && isAuthPage) {
    if (!isOnboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.nextUrl));
    }
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Fully onboarded user trying to re-do onboarding → skip to dashboard
  if (token && isOnboarded && isOnboardingPage) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Authenticated but NOT onboarded user trying to access dashboard → send to onboarding
  if (token && !isOnboarded && isDashboardPage) {
    return NextResponse.redirect(new URL('/onboarding', req.nextUrl));
  }

  return NextResponse.next();
});

export default async function middleware(req: NextRequest) {
  // WORKAROUND for Next.js body locking bug: 
  // Bypass NextAuth middleware for Server Actions since they verify their own auth using getSession().
  if (req.method === 'POST' && req.headers.has('next-action')) {
    return NextResponse.next();
  }

  return authMiddleware(req as any, null as any);
}

export const config = {
  // Include '/' so authenticated users are never shown the marketing page
  matcher: ['/', '/dashboard/:path*', '/onboarding/:path*', '/auth'],
};

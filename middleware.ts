import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const token = req.auth;
  const isOnboarded = (token?.user as any)?.isOnboarded as boolean | undefined;
  
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding');

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

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/auth'],
};

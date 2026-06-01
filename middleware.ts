import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isOnboarded = token?.isOnboarded as boolean | undefined;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding');

  // Unauthenticated user trying to access a protected page → send to login
  if (!token && (isDashboardPage || isOnboardingPage)) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // Authenticated user visiting the auth page → send them home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Fully onboarded user trying to re-do onboarding → skip to dashboard
  if (token && isOnboarded && isOnboardingPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/auth'],
};

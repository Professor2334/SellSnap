import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isOnboarded = token?.isOnboarded as boolean;
    const isLoginPage = req.nextUrl.pathname.startsWith('/auth');
    const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding');

    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    if (token) {
      if (isOnboarded && isOnboardingPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
        const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');

        if (isAuthRoute && token) {
          return false; // Redirect authenticated users away from auth pages
        }

        if (isAdminRoute) {
          return token?.role === 'admin';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
};


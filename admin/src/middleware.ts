import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'password123';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow access to login page without authentication
  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  // Check for admin authentication
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'], // Apply middleware to all routes except API and static files
};
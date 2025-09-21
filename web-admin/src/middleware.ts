import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // List of protected routes
  const protectedRoutes = [
    '/dashboard',
    '/users',
    '/stories',
    '/experiences',
    '/bookings',
    '/finance',
    '/reports'
  ];
  
  // Check if the request is for a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Check for authentication token in cookies or headers
    const authToken = request.cookies.get('admin_token')?.value;
    
    // If no token found, redirect to login
    if (!authToken) {
      console.log(`[Middleware] No token found for ${pathname}, redirecting to login`);
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    } else {
      console.log(`[Middleware] Token found for ${pathname}, allowing access`);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};

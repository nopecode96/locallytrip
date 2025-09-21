import { NextRequest } from 'next/server';

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Fallback to cookies
  const cookieToken = request.cookies.get('admin_token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}
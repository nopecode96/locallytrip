import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://locallytrip-backend:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Login failed' },
        { status: response.status }
      );
    }

    // Set cookie for token persistence
    const responseObj = NextResponse.json(data);
    if (data.success && data.data?.token) {
      responseObj.cookies.set('admin_token', data.data.token, {
        httpOnly: false, // Need to be accessible by client
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400, // 1 day
        path: '/',
      });
    }

    return responseObj;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          message: 'Email and password are required' 
        },
        { status: 400 }
      );
    }

    // Use internal container communication
    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    const responseObj = NextResponse.json(data, { 
      status: response.status 
    });

    // If login successful, set admin_token cookie
    if (data.success && data.data && data.data.token) {
      responseObj.cookies.set('admin_token', data.data.token, {
        httpOnly: false, // Allow access from JavaScript
        secure: false, // Set to true in production with HTTPS
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });
    }

    return responseObj;

  } catch (error: any) {
    console.error('Admin auth API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error',
        message: 'An error occurred during authentication',
        debug: error.message 
      },
      { status: 500 }
    );
  }
}

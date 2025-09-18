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
    const backendUrl = process.env.INTERNAL_API_URL || 'http://backend:3001';
    const response = await fetch(`${backendUrl}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { 
      status: response.status 
    });

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

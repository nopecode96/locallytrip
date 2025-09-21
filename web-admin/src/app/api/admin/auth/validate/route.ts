import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'No token provided'
      }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Validate token with backend
    const backendUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001/api/v1';
    const response = await fetch(`${backendUrl}/admin/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: 'Invalid token'
      }, { status: 401 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Token validation failed'
    }, { status: 500 });
  }
}
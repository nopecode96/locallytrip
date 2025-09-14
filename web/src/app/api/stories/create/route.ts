import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Proxy to LocallyTrip backend API (no /api/v1 prefix for this backend)
    const response = await fetch(`${backendUrl}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // Don't set Content-Type for FormData, let browser set boundary
      },
      body: formData,
    });

    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create story' },
        { status: response.status || 400 }
      );
    }
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
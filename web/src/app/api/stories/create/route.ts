import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Proxy to LocallyTrip backend API
    const response = await fetch(`${backendUrl}/api/v1/stories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create story' },
        { status: 400 }
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
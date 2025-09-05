import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Fetch host stories from backend
    const response = await fetch(`${BACKEND_URL}/api/v1/stories/my-stories`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to fetch host stories' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Host stories API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Get FormData for file upload support
    const formData = await request.formData();

    // Create new story for host using backend endpoint directly
    const response = await fetch(`${BACKEND_URL}/api/v1/stories`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to create story' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create host story API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

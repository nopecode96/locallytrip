import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get authorization header if present
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const response = await fetch(`${BACKEND_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Newsletter subscribe API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to process newsletter subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

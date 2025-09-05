import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from '@/utils/backend';

const backendUrl = getBackendUrl();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${backendUrl}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { 
      status: response.ok ? 200 : response.status 
    });
  } catch (error) {
    console.error('Resend verification API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send verification email' 
      },
      { status: 500 }
    );
  }
}

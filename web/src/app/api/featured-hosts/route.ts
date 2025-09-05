import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '4';
    
    const backendUrl = getServerBackendUrl();
    const response = await fetch(`${backendUrl}/featured-hosts?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured hosts from backend',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

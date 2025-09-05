import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = getServerBackendUrl();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'IDR';
    
    const url = `${backendUrl}/experiences/stats/price-range?currency=${currency}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    
    
    // Return error instead of static fallback - Database only!
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch price range from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

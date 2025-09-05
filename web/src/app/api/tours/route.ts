import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    
    // Call the backend API
    const backendUrl = getServerBackendUrl();
    const apiUrl = query ? `${backendUrl}/tours?${query}` : `${backendUrl}/tours`;
    
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      tours: data.tours || data.data || data,
      source: 'backend'
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tours from backend',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

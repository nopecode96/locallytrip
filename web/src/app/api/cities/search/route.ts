import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const limit = searchParams.get('limit') || '10';

    const backendUrl = getServerBackendUrl();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (limit) params.append('limit', limit);

    const queryString = params.toString();
    const url = `${backendUrl}/cities/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data || [],
      message: 'Cities fetched successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to search cities',
        data: [],
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const backendUrl = getServerBackendUrl();
    
    const url = `${backendUrl}/cities/${id}`;
    
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
      data: data.data || null,
      message: 'City fetched successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch city',
        data: null,
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

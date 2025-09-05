import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET() {
  try {
    const backendUrl = getServerBackendUrl();
    
    const response = await fetch(`${backendUrl}/host-categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    
    
    // Return error instead of static fallback - Database only!
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch categories from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET() {
  try {
    const backendUrl = getServerBackendUrl();
    
    const response = await fetch(`${backendUrl}/communication/apps`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache', // Cache communication apps as they change rarely
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching communication apps:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch communication apps',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

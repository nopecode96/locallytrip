import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
import { getServerImageUrl } from '@/utils/serverImages';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hostId = params.id;
    const backendUrl = getServerBackendUrl();
    
    const response = await fetch(`${backendUrl}/hosts/${hostId}/reviews`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // No image URL transformation - let client handle it
    // This prevents server-side 'backend' hostname from reaching client
    
    return NextResponse.json(data);
  } catch (error) {
    
    
    // Return error instead of static fallback - Database only!
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch host reviews from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
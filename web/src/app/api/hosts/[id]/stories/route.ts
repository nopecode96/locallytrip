import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
import { getServerImageUrl } from '@/utils/serverImages';

export async function GET(
  request: Request,
  { params }: { params: { hostId: string } }
) {
  try {
    const hostId = params.hostId;
    const backendUrl = getServerBackendUrl();
    const response = await fetch(`${backendUrl}/hosts/${hostId}/stories`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    // No image URL transformation - let client handle it
    // This prevents server-side 'backend' hostname from reaching client
    
    return NextResponse.json(data);
  } catch (error) {
    
    
    // Return error instead of static fallback - Database only!
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch host stories from database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
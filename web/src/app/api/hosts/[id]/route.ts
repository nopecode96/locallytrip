import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
import { getServerImageUrl } from '@/utils/serverImages';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hostId = params.id;
    const backendUrl = getServerBackendUrl();
    
    const response = await fetch(`${backendUrl}/hosts/${hostId}`, {
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
    return NextResponse.json(
      { 
        success: false, 
        error: 'Host not found',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 404 }
    );
  }
}
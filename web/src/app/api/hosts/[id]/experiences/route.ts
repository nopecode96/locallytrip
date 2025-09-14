import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hostId = params.id;
    const { searchParams } = new URL(request.url);
    
    // Build query string for filters
    const queryString = searchParams.toString();
    const queryParam = queryString ? `?${queryString}` : '';

    // Forward request to backend - use internal Docker service name for container-to-container communication
    const backendUrl = getServerBackendUrl();
    const response = await fetch(`${backendUrl}/hosts/${hostId}/experiences${queryParam}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Host experiences API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
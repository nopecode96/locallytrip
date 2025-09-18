import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = getServerBackendUrl();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get the authorization header from the incoming request
    const authHeader = request.headers.get('authorization');
    
    // Prepare headers for backend request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Include authorization header if present
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const response = await fetch(`${backendUrl}/experiences/${id}/submit-review`, {
      method: 'PATCH',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Experience not found' },
          { status: 404 }
        );
      }
      if (response.status === 400) {
        const errorData = await response.json();
        return NextResponse.json(
          { success: false, message: errorData.message || 'Invalid request' },
          { status: 400 }
        );
      }
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit experience for review',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support PATCH method for consistency with backend
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}

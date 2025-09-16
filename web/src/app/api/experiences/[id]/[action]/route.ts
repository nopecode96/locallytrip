import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const experienceId = params.id;
    const action = params.action;
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Get request body if needed (for reject action with reason)
    let body = null;
    try {
      body = await request.json();
    } catch {
      // No body is fine for most actions
    }

    // Forward request to backend
    const backendUrl = getServerBackendUrl();
    const response = await fetch(`${backendUrl}/experiences/${experienceId}/${action}`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { success: false, error: `Backend error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Experience ${params.action} API error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

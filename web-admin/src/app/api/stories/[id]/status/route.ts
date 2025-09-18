import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://locallytrip-backend:3001';

function getAuthTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check cookies as fallback
  const tokenCookie = request.cookies.get('admin_token');
  return tokenCookie?.value || null;
}

// PATCH /api/stories/[id]/status - Update story status (approve/reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, reason } = body;

    // Validate status
    if (!['draft', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be: draft, published, or archived' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/stories/${params.id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, reason }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Failed to update story status' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
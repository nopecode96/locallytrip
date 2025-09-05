import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Authorization token required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    const backendUrl = getServerBackendUrl();
    
    const response = await fetch(`${backendUrl}/auth/remove-avatar`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to remove avatar'
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar removed successfully'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

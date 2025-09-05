import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
import { getServerImageUrl } from '@/utils/serverImages';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        message: 'Authorization header required'
      }, { status: 401 });
    }

    const backendUrl = getServerBackendUrl();

    // Forward request to backend
    const response = await fetch(`${backendUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to get profile'
      }, { status: response.status });
    }

    // Transform image URLs for server-side compatibility
    if (data.success && data.user) {
      if (data.user.avatar) {
        data.user.avatar = getServerImageUrl(data.user.avatar);
      }
    } else if (data.data && data.data.avatar) {
      data.data.avatar = getServerImageUrl(data.data.avatar);
    }

    return NextResponse.json({
      success: true,
      data: data.user || data.data
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

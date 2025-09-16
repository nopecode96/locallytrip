import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendUrl = getServerBackendUrl();
    const response = await fetch(`${backendUrl}/user-languages`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user languages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user languages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('POST /api/user-languages - Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('POST /api/user-languages - No authorization header');
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('🔍 Frontend API Route - Request body:', body);
    
    const backendUrl = getServerBackendUrl();
    console.log('🔍 Frontend API Route - Backend URL:', backendUrl);

    const response = await fetch(`${backendUrl}/user-languages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    console.log('🔍 Frontend API Route - Backend response status:', response.status);
    const data = await response.json();
    console.log('🔍 Frontend API Route - Backend response data:', data);
    
    if (!response.ok || !data.success) {
      console.log('🔍 Frontend API Route - Backend error:', data);
      return NextResponse.json(
        { success: false, error: data.error || data.message || 'Failed to add user language' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding user language:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add user language',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Upload image API - Authorization header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.log('Upload image API - No authorization header');
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    console.log('Upload image API - FormData keys:', Array.from(formData.keys()));
    
    const backendUrl = getServerBackendUrl();
    
    // Forward to backend
    console.log('Upload image API - Forwarding to:', `${backendUrl}/stories/upload-image`);
    const response = await fetch(`${backendUrl}/stories/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData
    });

    console.log('Upload image API - Backend response status:', response.status);
    const data = await response.json();
    console.log('Upload image API - Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error || data.message || 'Failed to upload image' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload image API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

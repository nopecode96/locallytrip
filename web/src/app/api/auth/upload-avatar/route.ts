import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
import { getServerImageUrl } from '@/utils/serverImages';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    
    const formData = await request.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided'
      }, { status: 400 });
    }


    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid file type. Please upload an image.'
      }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      }, { status: 400 });
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Authorization token required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Create FormData for backend
    const backendFormData = new FormData();
    backendFormData.append('avatar', file);

    const backendUrl = getServerBackendUrl();
    
    const response = await fetch(`${backendUrl}/auth/upload-avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: backendFormData
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to upload avatar'
      }, { status: response.status });
    }

    // Transform image URLs for server-side compatibility
    if (data.success && data.data) {
      if (data.data.url) {
        data.data.url = getServerImageUrl(data.data.url);
      }
      if (data.data.avatar) {
        data.data.avatar = getServerImageUrl(data.data.avatar);
      }
      if (data.data.avatarUrl) {
        data.data.avatarUrl = getServerImageUrl(data.data.avatarUrl);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: data.data || data
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

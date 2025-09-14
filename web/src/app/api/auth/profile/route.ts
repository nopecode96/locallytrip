import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
import { getServerImageUrl } from '@/utils/serverImages';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Profile API route called');
    
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.log('❌ No auth header provided');
      return NextResponse.json({
        success: false,
        message: 'Authorization header required'
      }, { status: 401 });
    }

    const backendUrl = getServerBackendUrl();
    console.log('🌐 Backend URL:', backendUrl);

    // Forward request to backend
    console.log('🚀 Calling backend at:', `${backendUrl}/auth/profile`);
    const response = await fetch(`${backendUrl}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Backend response status:', response.status);
    const data = await response.json();
    console.log('📋 Backend response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.log('❌ Backend response not OK:', response.status, data);
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to get profile'
      }, { status: response.status });
    }

    // Transform image URLs for client-side compatibility
    // Use NEXT_PUBLIC_IMAGES for browser-accessible URLs
    const clientImageBaseUrl = process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images';
    
    if (data.success && data.user) {
      if (data.user.avatar && !data.user.avatar.startsWith('http')) {
        data.user.avatar = `${clientImageBaseUrl}/${data.user.avatar.replace(/^\/+/, '')}`;
      }
      if (data.user.avatarUrl && !data.user.avatarUrl.startsWith('http')) {
        data.user.avatarUrl = `${clientImageBaseUrl}/users/avatars/${data.user.avatarUrl.replace(/^\/+/, '')}`;
      }
    } else if (data.data) {
      if (data.data.avatar && !data.data.avatar.startsWith('http')) {
        data.data.avatar = `${clientImageBaseUrl}/${data.data.avatar.replace(/^\/+/, '')}`;
      }
      if (data.data.avatarUrl && !data.data.avatarUrl.startsWith('http')) {
        data.data.avatarUrl = `${clientImageBaseUrl}/users/avatars/${data.data.avatarUrl.replace(/^\/+/, '')}`;
      }
    }

    console.log('✅ Returning successful response');
    return NextResponse.json({
      success: true,
      data: data.user || data.data
    });

  } catch (error) {
    console.error('💥 Profile API route error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: 'No authorization token provided'
      }, { status: 401 });
    }

    const backendUrl = getServerBackendUrl();
    
    console.log('Updating profile with data:', body);
    
    const response = await fetch(`${backendUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    console.log('Backend response:', data);
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: data.error || 'Failed to update profile'
      }, { status: response.status });
    }

    // Transform image URLs for updated user data
    const clientImageBaseUrl = process.env.NEXT_PUBLIC_IMAGES || 'http://localhost:3001/images';
    
    if (data.success && data.data) {
      if (data.data.avatar && !data.data.avatar.startsWith('http')) {
        data.data.avatar = `${clientImageBaseUrl}/${data.data.avatar.replace(/^\/+/, '')}`;
      }
      if (data.data.avatarUrl && !data.data.avatarUrl.startsWith('http')) {
        data.data.avatarUrl = `${clientImageBaseUrl}/users/avatars/${data.data.avatarUrl.replace(/^\/+/, '')}`;
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

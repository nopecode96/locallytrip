import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

interface Props {
  params: { slug: string };
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  let { slug } = params;

  // Remove trailing slash if present
  if (slug && slug.endsWith('/')) {
    slug = slug.slice(0, -1);
  }

  if (!slug) {
    return NextResponse.json(
      { success: false, message: 'Story slug or ID is required' },
      { status: 400 }
    );
  }

  try {
    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Check if slug is numeric (ID) or actual slug
    const isNumericId = /^\d+$/.test(slug);
    const endpoint = isNumericId 
      ? `${backendUrl}/stories/${slug}` 
      : `${backendUrl}/stories/slug/${encodeURIComponent(slug)}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Story not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to fetch story', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: Props
) {
  try {
    let { slug } = params;
    
    if (slug && slug.endsWith('/')) {
      slug = slug.slice(0, -1);
    }
    
    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Get the form data from the request
    const formData = await request.formData();
    
    // Check if slug is numeric (ID) or actual slug, for PUT we usually use ID
    const isNumericId = /^\d+$/.test(slug);
    const endpoint = `${backendUrl}/stories/${slug}`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        // Don't set Content-Type for FormData, let fetch handle it
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update story' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update story API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update story',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  try {
    let { slug } = params;
    
    if (slug && slug.endsWith('/')) {
      slug = slug.slice(0, -1);
    }
    
    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    console.log(`DELETE /api/stories/${slug} - Forwarding to backend`);
    
    // For DELETE, we typically use ID, but backend can handle both
    const endpoint = `${backendUrl}/stories/${slug}`;
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    const data = await response.json();
    
    console.log(`DELETE /api/stories/${slug} - Backend response:`, { 
      status: response.status, 
      success: data.success,
      message: data.message 
    });
    
    if (!response.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to delete story' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete story API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete story',
      },
      { status: 500 }
    );
  }
}

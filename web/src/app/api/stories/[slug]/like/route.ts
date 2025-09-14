import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // First, get the story ID from slug
    const storyResponse = await fetch(`${backendUrl}/stories/slug/${slug}`);
    if (!storyResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Story not found' },
        { status: 404 }
      );
    }
    
    const storyData = await storyResponse.json();
    const storyId = storyData.data?.id;
    
    if (!storyId) {
      return NextResponse.json(
        { success: false, message: 'Story ID not found' },
        { status: 404 }
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    };

    // Make request to backend
    const response = await fetch(`${backendUrl}/stories/${storyId}/like`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to process like' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Like API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // First, get the story ID from slug
    const storyResponse = await fetch(`${backendUrl}/stories/slug/${slug}`);
    if (!storyResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Story not found' },
        { status: 404 }
      );
    }
    
    const storyData = await storyResponse.json();
    const storyId = storyData.data?.id;
    
    if (!storyId) {
      return NextResponse.json(
        { success: false, message: 'Story ID not found' },
        { status: 404 }
      );
    }

    const headers: Record<string, string> = {
      'Authorization': authHeader,
    };

    // Make request to backend to get like status
    const response = await fetch(`${backendUrl}/stories/${storyId}/like-status`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to get like status' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Like status API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Get authorization header
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    const backendUrl = getServerBackendUrl();

    // First, get story ID from slug
    const storyResponse = await fetch(`${backendUrl}/stories/slug/${slug}`);
    
    if (!storyResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Story not found' },
        { status: 404 }
      );
    }

    const storyData = await storyResponse.json();
    
    if (!storyData.success) {
      return NextResponse.json(
        { success: false, message: 'Story not found' },
        { status: 404 }
      );
    }

    const storyId = storyData.data.id;

    // Get like status from backend
    const response = await fetch(`${backendUrl}/stories/${storyId}/like-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to get like status' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('API Error in like-status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storyId, content, parentId } = body;

    if (!storyId || !content?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Story ID and comment content are required' },
        { status: 400 }
      );
    }

    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Prepare request body with snake_case for backend
    const requestBody: any = {
      story_id: storyId, // Transform camelCase to snake_case
      content: content.trim(),
    };

    // Add parentId if this is a reply
    if (parentId) {
      requestBody.parent_id = parentId; // Transform camelCase to snake_case
    }

    // Make request to backend
    const response = await fetch(`${backendUrl}/comments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to post comment' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: parentId ? 'Reply posted successfully' : 'Comment posted successfully'
    });

  } catch (error) {
    console.error('Comment API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('storyId');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    if (!storyId) {
      return NextResponse.json(
        { success: false, message: 'Story ID is required' },
        { status: 400 }
      );
    }

    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Make request to backend
    const response = await fetch(
      `${backendUrl}/comments?storyId=${storyId}&page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers,
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to fetch comments' 
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data,
      pagination: data.pagination || null
    });

  } catch (error) {
    console.error('Comments fetch API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

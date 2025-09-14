import { NextResponse, NextRequest } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '12';
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const featured = searchParams.get('featured') || '';
    const cityId = searchParams.get('cityId') || '';

    const backendUrl = getServerBackendUrl();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (featured === 'true') params.append('featured', 'true');
    if (cityId) params.append('cityId', cityId);

    const queryString = params.toString();
    const url = `${backendUrl}/stories${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform stories data to match frontend expectations
    const stories = (data.data || data.stories || []).map((story: any) => ({
      ...story,
      // image field is already correctly named from backend
      authorName: story.author?.name, // Map nested author name
      authorImage: story.author?.avatarUrl, // Map nested author avatar
      views: story.viewCount, // Map viewCount to views
      likes: story.likeCount, // Map likeCount to likes
      commentsCount: story.commentCount, // Map commentCount to commentsCount
      // Ensure City data is properly passed through
      City: story.City, // Keep the City association for location display
    }));

    return NextResponse.json({
      success: true,
      stories: stories,
      pagination: data.pagination || {},
      message: 'Stories fetched successfully from backend API'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to fetch stories from backend API',
        stories: [],
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = getServerBackendUrl();
    console.log('POST /api/stories - Backend URL:', backendUrl);
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    console.log('POST /api/stories - Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('POST /api/stories - No authorization header');
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Get the form data from the request
    const formData = await request.formData();
    console.log('POST /api/stories - FormData keys:', Array.from(formData.keys()));
    
    // Check if coverImage exists
    const coverImageFile = formData.get('coverImage');
    console.log('POST /api/stories - CoverImage file:', coverImageFile ? 'EXISTS' : 'NULL', 
                coverImageFile instanceof File ? `Size: ${coverImageFile.size}` : 'Not a file');
    
    // Proxy to LocallyTrip backend API (no /api/v1 prefix)
    const backendEndpoint = `${backendUrl}/stories`;
    console.log('POST /api/stories - Forwarding to:', backendEndpoint);
    
    const response = await fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // Don't set Content-Type for FormData, let fetch handle it
      },
      body: formData,
    });

    console.log('POST /api/stories - Backend response status:', response.status);
    const data = await response.json();
    console.log('POST /api/stories - Backend response data:', data);
    
    if (!response.ok || !data.success) {
      console.log('POST /api/stories - Backend error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create story' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Create story API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create story',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

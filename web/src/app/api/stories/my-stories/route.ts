import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = getServerBackendUrl();
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    console.log('My Stories API - Backend URL:', backendUrl);
    console.log('My Stories API - Auth Header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Proxy to LocallyTrip backend API (no /api/v1 prefix)
    const response = await fetch(`${backendUrl}/stories/my-stories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    console.log('My Stories API - Backend Response Status:', response.status);
    
    const data = await response.json();
    
    console.log('My Stories API - Backend Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      // Transform the data to match frontend expectations  
      const transformedData = {
        ...data,
        data: data.data.map((story: any) => ({
          ...story,
          uuid: story.uuid, // Explicitly preserve UUID for secure edit URLs
          // image field is already correctly named from backend
          authorName: story.author?.name, // Map nested author name
          authorImage: story.author?.avatarUrl, // Map nested author avatar
          views: story.viewCount, // Map viewCount to views
          likes: story.likeCount, // Map likeCount to likes
          commentsCount: story.commentCount, // Map commentCount to commentsCount
          status: story.published ? 'published' : 'draft', // Map published boolean to status string
        }))
      };
      
      return NextResponse.json(transformedData);
    } else {
      return NextResponse.json(
        { success: false, message: data.error || data.message || 'Failed to fetch user stories' },
        { status: response.status || 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
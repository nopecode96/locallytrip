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

    const backendUrl = getServerBackendUrl();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (featured === 'true') params.append('featured', 'true');

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

    return NextResponse.json({
      success: true,
      stories: data.data || data.stories || [],
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
    
    // Proxy to LocallyTrip backend API (no /api/v1 prefix)
    const response = await fetch(`${backendUrl}/stories`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        // Don't set Content-Type for FormData, let fetch handle it
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
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

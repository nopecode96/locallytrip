import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = getServerBackendUrl();
    const { id } = params; // This could be either numeric ID or UUID
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    console.log('Host Story by ID API - Story ID:', id);
    console.log('Host Story by ID API - Backend URL:', backendUrl);
    console.log('Host Story by ID API - Auth Header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Try to get story by UUID first, then by ID if UUID fails
    let response;
    
    // First try by UUID/ID using my-stories endpoint
    response = await fetch(`${backendUrl}/stories/my-stories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    console.log('Host Story by ID API - Backend Response Status:', response.status);
    
    if (!response.ok) {
      console.log('Host Story by ID API - Backend Error:', await response.text());
      return NextResponse.json(
        { success: false, message: 'Story not found or access denied' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Host Story by ID API - Backend Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      // Transform the data to match frontend expectations
      const transformedData = {
        ...data,
        data: {
          ...data.data,
          uuid: data.data.uuid, // Explicitly preserve UUID
          // Ensure all required fields for edit form
          tags: data.data.tags || [],
          keywords: data.data.keywords || [],
          metaTitle: data.data.metaTitle || '',
          metaDescription: data.data.metaDescription || '',
          cityId: data.data.cityId || '',
          readingTime: data.data.readingTime || 5,
          status: data.data.status || 'draft'
        }
      };
      
      return NextResponse.json(transformedData);
    } else {
      return NextResponse.json(
        { success: false, message: data.error || data.message || 'Failed to fetch story' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching host story by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = getServerBackendUrl();
    const { id } = params;
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.formData();
    
    console.log('Update Story API - Story ID:', id);
    console.log('Update Story API - Backend URL:', backendUrl);
    
    // Forward the request to backend using the main stories endpoint (supports UUID)
    const response = await fetch(`${backendUrl}/stories/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
      },
      body: body, // Forward FormData as-is for file uploads
    });

    console.log('Update Story API - Backend Response Status:', response.status);
    
    const data = await response.json();
    
    if (data.success) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { success: false, message: data.error || data.message || 'Failed to update story' },
        { status: response.status || 400 }
      );
    }
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

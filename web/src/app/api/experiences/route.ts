import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = getServerBackendUrl();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward all query parameters to backend
    const queryString = searchParams.toString();
    const url = `${backendUrl}/experiences${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to add hostName to experiences for frontend compatibility
    if (data.success && data.data && data.data.experiences) {
      data.data.experiences = data.data.experiences.map((experience: any) => {
        const transformedExperience = {
          ...experience,
          hostName: experience.host ? experience.host.name : 'Unknown Host'
        };

        // Transform host structure to match frontend interface
        if (experience.host && experience.host.name) {
          const fullName = experience.host.name;
          const nameParts = fullName.split(' ');
          transformedExperience.host = {
            ...experience.host,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            avatar: experience.host.avatarUrl || null, // Transform avatarUrl to avatar
          };
        }

        return transformedExperience;
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch experiences',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file uploads)
      const formData = await request.formData();
      console.log('POST /api/experiences - FormData keys:', Array.from(formData.keys()));
      
      // Check if images exist
      const imageFiles = formData.getAll('images');
      console.log('POST /api/experiences - Image files count:', imageFiles.length);
      
      // Forward FormData directly to backend
      const response = await fetch(`${backendUrl}/experiences`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          // Don't set Content-Type for FormData, let fetch handle it
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    } else {
      // Handle regular JSON data (fallback)
      const body = await request.json();
      
      const response = await fetch(`${backendUrl}/experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json(errorData, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

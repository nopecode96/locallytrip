import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = getServerBackendUrl();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const response = await fetch(`${backendUrl}/experiences/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Experience not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to match frontend interface
    if (data.success && data.data) {
      const experience = data.data;
      
      // Transform host structure to match frontend interface
      if (experience.host && experience.host.name) {
        const fullName = experience.host.name;
        const nameParts = fullName.split(' ');
        experience.host = {
          ...experience.host,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          avatar: experience.host.avatarUrl || null, // Transform avatarUrl to avatar
        };
      }
      
      // Transform array field names from backend to frontend convention
      if (experience.included) {
        experience.includedItems = experience.included;
        delete experience.included;
      }
      if (experience.excluded) {
        experience.excludedItems = experience.excluded;
        delete experience.excluded;
      }
      
      // Transform itinerary data to map timeSchedule to time field
      if (experience.itinerary && Array.isArray(experience.itinerary)) {
        experience.itinerary = experience.itinerary.map((step: any) => ({
          ...step,
          time: step.timeSchedule || step.time || '', // Map timeSchedule to time
          // Keep timeSchedule for backward compatibility but prioritize time
        }));
      }
      
      data.data = experience;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header required' },
        { status: 401 }
      );
    }

    let body: any;
    let isFormData = false;
    let requestBody: string | FormData;
    let requestHeaders: Record<string, string> = {
      'Authorization': authHeader,
    };

    // Try to detect if this is FormData by checking content-type or attempting to parse as FormData
    const contentType = request.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('multipart/form-data')) {
        // Handle FormData (images + other fields)
        const formData = await request.formData();
        isFormData = true;
        
        // Extract and parse JSON fields from FormData
        body = {};
        const jsonFields = [
          'includedItems', 'excludedItems', 'deliverables', 'equipmentUsed', 
          'itinerary', 'hostSpecificData', 'imagesToDelete'
        ];
        
        // Process text fields
        formData.forEach((value, key) => {
          if (key === 'images') {
            // Skip images, they'll be handled as FormData
            return;
          } else if (jsonFields.includes(key)) {
            try {
              body[key] = JSON.parse(value as string);
            } catch {
              body[key] = value;
            }
          } else {
            body[key] = value;
          }
        });
        
        // Transform field names from frontend to backend convention
        if (body.includedItems) {
          body.included = body.includedItems;
          delete body.includedItems;
        }
        if (body.excludedItems) {
          body.excluded = body.excludedItems;
          delete body.excludedItems;
        }
        
        // Create new FormData with transformed field names
        const backendFormData = new FormData();
        
        // Add all transformed fields
        Object.entries(body).forEach(([key, value]) => {
          if (typeof value === 'object') {
            backendFormData.append(key, JSON.stringify(value));
          } else {
            backendFormData.append(key, value as string);
          }
        });
        
        // Add images from original FormData
        formData.forEach((value, key) => {
          if (key === 'images') {
            backendFormData.append(key, value);
          }
        });
        
        requestBody = backendFormData;
        // Don't set Content-Type for FormData, let browser set it with boundary
      } else {
        // Handle JSON (text-only updates)
        body = await request.json();
        isFormData = false;

        // Transform field names from frontend to backend convention
        if (body.includedItems) {
          body.included = body.includedItems;
          delete body.includedItems;
        }
        if (body.excludedItems) {
          body.excluded = body.excludedItems;
          delete body.excludedItems;
        }

        requestBody = JSON.stringify(body);
        requestHeaders['Content-Type'] = 'application/json';
      }
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Debug logging
    console.log('PUT /api/experiences/[id] - Debug Info:');
    console.log('- Is FormData:', isFormData);
    console.log('- Request Headers:', requestHeaders);
    if (!isFormData) {
      console.log('- JSON Body:', body);
    } else {
      console.log('- FormData fields (parsed):', body);
      // Log FormData keys for debugging
      const formDataKeys: string[] = [];
      if (requestBody instanceof FormData) {
        requestBody.forEach((value, key) => {
          if (key !== 'images') {
            formDataKeys.push(`${key}: ${value}`);
          } else {
            formDataKeys.push(`${key}: [File]`);
          }
        });
      }
      console.log('- FormData entries:', formDataKeys);
    }

    const response = await fetch(`${backendUrl}/experiences/${id}`, {
      method: 'PUT',
      headers: requestHeaders,
      body: requestBody,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Experience not found' },
          { status: 404 }
        );
      }
      if (response.status === 401) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const response = await fetch(`${backendUrl}/experiences/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Experience not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

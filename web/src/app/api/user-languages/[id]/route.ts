import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('PUT /api/user-languages/[id] - Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('PUT /api/user-languages/[id] - No authorization header');
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id } = params;
    const backendUrl = getServerBackendUrl();

    console.log('PUT /api/user-languages/[id] - Updating language ID:', id, 'with data:', body);

    const response = await fetch(`${backendUrl}/user-languages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    console.log('PUT /api/user-languages/[id] - Backend response status:', response.status);
    const data = await response.json();
    console.log('PUT /api/user-languages/[id] - Backend response data:', data);

    if (!response.ok || !data.success) {
      console.log('PUT /api/user-languages/[id] - Backend error:', data);
      return NextResponse.json(
        { success: false, error: data.error || data.message || 'Failed to update user language' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating user language:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update user language',
        details: process.env.NODE_ENV === 'development' ? error : undefined
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
    const authHeader = request.headers.get('authorization');
    console.log('DELETE /api/user-languages/[id] - Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('DELETE /api/user-languages/[id] - No authorization header');
      return NextResponse.json(
        { success: false, error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const { id } = params;
    const backendUrl = getServerBackendUrl();

    console.log('DELETE /api/user-languages/[id] - Deleting language ID:', id);

    const response = await fetch(`${backendUrl}/user-languages/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });

    console.log('DELETE /api/user-languages/[id] - Backend response status:', response.status);
    const data = await response.json();
    console.log('DELETE /api/user-languages/[id] - Backend response data:', data);

    if (!response.ok || !data.success) {
      console.log('DELETE /api/user-languages/[id] - Backend error:', data);
      return NextResponse.json(
        { success: false, error: data.error || data.message || 'Failed to delete user language' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting user language:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete user language',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

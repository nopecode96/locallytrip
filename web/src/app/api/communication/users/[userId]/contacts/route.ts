import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get('includePrivate') === 'true';
    
    const backendUrl = getServerBackendUrl();
    
    const queryParams = new URLSearchParams();
    if (includePrivate) {
      queryParams.append('includePrivate', 'true');
    }
    
    const url = `${backendUrl}/communication/users/${userId}/contacts${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user contacts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user contacts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();
    
    const backendUrl = getServerBackendUrl();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to backend
    const response = await fetch(`${backendUrl}/communication/users/${userId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend responded with ${response.status}`,
          message: errorData.message || 'Failed to add/update contact'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding/updating user contact:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add/update user contact',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

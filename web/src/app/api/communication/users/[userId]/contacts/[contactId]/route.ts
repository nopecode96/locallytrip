import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; contactId: string } }
) {
  try {
    const { userId, contactId } = params;
    
    const backendUrl = getServerBackendUrl();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    // Forward the request to backend
    const response = await fetch(`${backendUrl}/communication/users/${userId}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader })
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          error: `Backend responded with ${response.status}`,
          message: errorData.message || 'Failed to delete contact'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting user contact:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete user contact',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

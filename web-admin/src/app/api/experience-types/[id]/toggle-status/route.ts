import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Get admin token from cookies
    const adminToken = request.cookies.get('admin_token')?.value;
    
    const response = await fetch(`${backendUrl}/api/v1/admin/experience-types/${params.id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to toggle experience type status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error toggling experience type status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle experience type status' },
      { status: 500 }
    );
  }
}
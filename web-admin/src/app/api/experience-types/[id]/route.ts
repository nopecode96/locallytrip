import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Get admin token from cookies
    const adminToken = request.cookies.get('admin_token')?.value;
    
    const response = await fetch(`${backendUrl}/admin/experience-types/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to update experience type');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating experience type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update experience type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Get admin token from cookies
    const adminToken = request.cookies.get('admin_token')?.value;
    
    const response = await fetch(`${backendUrl}/admin/experience-types/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete experience type');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting experience type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete experience type' },
      { status: 500 }
    );
  }
}
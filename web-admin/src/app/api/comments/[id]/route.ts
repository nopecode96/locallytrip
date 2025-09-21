import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin token required' },
        { status: 401 }
      );
    }

    const commentId = params.id;

    // Forward request to backend
    const response = await fetch(`${API_BASE_URL}/admin/comments/${commentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'Backend Error', message: errorData || 'Failed to fetch comment' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in comment fetch API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin token required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const commentId = params.id;

    // Forward request to backend
    const response = await fetch(`${API_BASE_URL}/admin/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'Backend Error', message: errorData || 'Failed to update comment' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in comment update API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin token required' },
        { status: 401 }
      );
    }

    const commentId = params.id;

    // Forward request to backend
    const response = await fetch(`${API_BASE_URL}/admin/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'Backend Error', message: errorData || 'Failed to delete comment' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in comment delete API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to process request' },
      { status: 500 }
    );
  }
}
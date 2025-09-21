import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Admin token required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Forward request to backend
    const response = await fetch(`${API_BASE_URL}/admin/comments?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'Backend Error', message: errorData || 'Failed to fetch comments' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in comments API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to process request' },
      { status: 500 }
    );
  }
}
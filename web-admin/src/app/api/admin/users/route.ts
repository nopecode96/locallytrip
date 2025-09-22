import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    console.log('=== ADMIN USERS API DEBUG ===');
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    console.log('Query string:', queryString);
    
    // Get admin token from cookies
    const adminToken = request.cookies.get('admin_token')?.value;
    console.log('Admin token exists:', !!adminToken);
    
    if (!adminToken) {
      console.log('No admin token found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log('Backend URL:', backendUrl);
    
    const fullUrl = `${backendUrl}/admin/users?${queryString}`;
    console.log('Full URL:', fullUrl);

    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success! Users count:', data.data?.users?.length || 0);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
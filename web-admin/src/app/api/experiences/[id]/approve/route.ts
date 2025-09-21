import { NextRequest, NextResponse } from 'next/server';
import { getAdminTokenFromRequest } from '@/utils/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experienceId = params.id;
    
    // Get admin token for authorization
    const adminToken = getAdminTokenFromRequest(request);
    if (!adminToken) {
      return NextResponse.json({
        success: false,
        message: 'Admin authentication required'
      }, { status: 401 });
    }
    
    // Forward to backend publish endpoint
    const backendUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/experiences/${experienceId}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: 'Failed to approve experience'
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data,
      message: 'Experience approved and published successfully'
    });

  } catch (error) {
    console.error('Error approving experience:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
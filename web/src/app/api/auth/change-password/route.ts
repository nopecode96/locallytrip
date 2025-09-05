import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword, token } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'Current password and new password are required'
      }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Authorization token required'
      }, { status: 401 });
    }

    const backendUrl = getServerBackendUrl();
    
    const response = await fetch(`${backendUrl}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to change password'
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

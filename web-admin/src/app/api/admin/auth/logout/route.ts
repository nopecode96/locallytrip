import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // For now, we'll handle logout purely on frontend by clearing localStorage
    // This is safer than potentially disrupting backend auth for traveller/host
    return NextResponse.json({
      success: true,
      message: 'Logout successful - token invalidated on client side'
    });

  } catch (error: any) {
    console.error('Admin logout API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error',
        message: 'An error occurred during logout',
        debug: error.message 
      },
      { status: 500 }
    );
  }
}

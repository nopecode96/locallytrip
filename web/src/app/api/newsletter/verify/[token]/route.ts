import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const { token } = params;
    const backendUrl = getServerBackendUrl();
    const response = await fetch(`${backendUrl}/newsletter/verify/${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Newsletter verify API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to verify newsletter subscription',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

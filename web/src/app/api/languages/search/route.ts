import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const backendUrl = getServerBackendUrl();
    const url = `${backendUrl}/languages/search?q=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching languages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search languages' },
      { status: 500 }
    );
  }
}

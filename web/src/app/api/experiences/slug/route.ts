import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(
  request: NextRequest,
  { params }: { params: { experienceSlug: string } }
) {
  const { experienceSlug } = params;

  if (!experienceSlug) {
    return NextResponse.json(
      { success: false, message: 'Experience slug is required' },
      { status: 400 }
    );
  }

  try {
    const backendUrl = getServerBackendUrl();
    const response = await fetch(
      `${backendUrl}/experiences/slug/${encodeURIComponent(experienceSlug)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Experience not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, message: 'Failed to fetch experience', error: errorMessage },
      { status: 500 }
    );
  }
}
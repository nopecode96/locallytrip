import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';
// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = getServerBackendUrl();

export async function GET(
  request: NextRequest,
  { params }: { params: { experienceId: string } }
) {
  try {
    const { experienceId } = params;
    
    const response = await fetch(`${backendUrl}/experiences/${experienceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, message: 'Experience not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to match frontend interface
    if (data.success && data.data) {
      const experience = data.data;
      
      // Transform host structure to match frontend interface
      if (experience.host && experience.host.name) {
        const fullName = experience.host.name;
        const nameParts = fullName.split(' ');
        experience.host = {
          ...experience.host,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          avatar: experience.host.avatarUrl || null, // Transform avatarUrl to avatar
        };
      }
      
      data.data = experience;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch experience',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

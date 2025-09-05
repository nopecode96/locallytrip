import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = getServerBackendUrl();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward all query parameters to backend
    const queryString = searchParams.toString();
    const url = `${backendUrl}/experiences${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to add hostName to experiences for frontend compatibility
    if (data.success && data.data && data.data.experiences) {
      data.data.experiences = data.data.experiences.map((experience: any) => {
        const transformedExperience = {
          ...experience,
          hostName: experience.host ? experience.host.name : 'Unknown Host'
        };

        // Transform host structure to match frontend interface
        if (experience.host && experience.host.name) {
          const fullName = experience.host.name;
          const nameParts = fullName.split(' ');
          transformedExperience.host = {
            ...experience.host,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            avatar: experience.host.avatarUrl || null, // Transform avatarUrl to avatar
          };
        }

        return transformedExperience;
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch experiences',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

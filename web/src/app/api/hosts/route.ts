import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    
    // Forward query parameters, but increase limit to get more data for filtering
    const originalLimit = searchParams.get('limit') || '20';
    const filteringLimit = Math.max(parseInt(originalLimit) * 3, 50); // Get more data to filter from
    
    searchParams.forEach((value, key) => {
      if (key === 'limit') {
        params.append(key, filteringLimit.toString());
      } else {
        params.append(key, value);
      }
    });

    // Call the backend API
    const backendUrl = getServerBackendUrl();
    const apiUrl = `${backendUrl}/hosts?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to match frontend interface and filter
    if (data.success && data.data) {
      const transformedHosts = data.data
        .map((host: any) => ({
          ...host,
          avatar: host.avatar || host.avatarUrl || null, // Transform avatarUrl to avatar
        }))
        // Filter: only hosts with avatar AND experiences
        .filter((host: any) => 
          host.avatar && // Must have avatar
          host.avatar !== null && 
          host.avatar !== '' &&
          (host.experienceCount > 0 || host.toursCount > 0) // Must have at least 1 experience
        )
        // Limit to original requested amount
        .slice(0, parseInt(originalLimit));
      
      return NextResponse.json({
        success: true,
        hosts: transformedHosts,
        source: 'backend'
      });
    }
    
    return NextResponse.json({
      success: true,
      hosts: data.data || data.hosts || data,
      source: 'backend'
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hosts from backend',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
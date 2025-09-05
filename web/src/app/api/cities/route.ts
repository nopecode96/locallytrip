import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';
    const popular = searchParams.get('popular') || 'true';
    
    // Call the backend API
    const backendUrl = getServerBackendUrl();
    let apiUrl = `${backendUrl}/cities?limit=${limit}&popular=${popular}`;
    
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform backend data to match frontend interface
    const transformedCities = Array.isArray(data.cities || data.data || data) ? 
      (data.cities || data.data || data).map((city: any) => ({
        id: city.id,
        name: city.name,
        slug: city.slug || city.name.toLowerCase().replace(/\s+/g, '-'),
        emoji: city.emoji || '🏙️',
        popular: city.popular || true,
        searchCount: city.searchCount || city.totalExperiences || 0,
        experienceCount: city.totalExperiences || city.experienceCount || 0,
        averagePrice: city.averagePrice || 0,
        country: city.country?.name || city.countryName || city.country || 'Unknown Country',
        image: city.image || `/images/cities/${city.name.toLowerCase()}.jpg`,
        description: city.description,
        totalExperiences: city.totalExperiences || 0,
        totalOrders: city.totalOrders || 0,
        popularCategories: city.popularCategories || []
      })) : [];
    
    return NextResponse.json({
      success: true,
      data: transformedCities,
      source: 'backend'
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch cities from backend',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

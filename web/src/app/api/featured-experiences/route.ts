import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const backendUrl = getServerBackendUrl();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '8';
    
    const url = `${backendUrl}/featured-experiences?limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Backend returned unsuccessful response',
        data: { experiences: [] }
      }, { status: 500 });
    }
    
    // Transform data to match frontend interface - wrap in experiences array
    const transformedData = {
      success: true,
      data: {
        experiences: data.data.map((experience: any) => ({
          id: experience.experienceId || experience.id,
          uuid: experience.experienceId,
          title: experience.title,
          description: experience.description,
          badge: experience.badge,
          imageUrl: experience.imageUrl,
          images: [experience.imageUrl], // Convert single image to array
          pricePerPackage: experience.price,
          packagePrice: experience.price, // Backend alias
          originalPrice: experience.originalPrice,
          duration: experience.duration,
          meetingPoint: experience.location,
          rating: experience.rating,
          totalReviews: experience.totalReviews,
          host: {
            ...experience.host,
            name: experience.host?.name || 'Unknown Host',
            avatarUrl: experience.host?.avatar,
            avatar: experience.host?.avatar, // Frontend expects both
          },
          category: experience.category,
          type: experience.type,
          displayOrder: experience.displayOrder,
          // Additional fields for compatibility
          hostName: experience.host?.name || 'Unknown Host',
          isFeatured: true, // Since these come from featured table
        }))
      },
      count: data.count
    };
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching featured experiences:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch featured experiences',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: { experiences: [] }
      },
      { status: 500 }
    );
  }
}
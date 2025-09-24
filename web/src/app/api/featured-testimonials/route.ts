import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '6';
    
    const backendUrl = getServerBackendUrl();
    const response = await fetch(`${backendUrl}/featured-testimonials?limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      
      return NextResponse.json({
        success: false,
        message: `Backend API error: ${response.status}`,
        data: []
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.success) {
      
      return NextResponse.json({
        success: false,
        message: data.message || 'Backend returned unsuccessful response',
        data: []
      }, { status: 500 });
    }

    // Transform the data to match frontend interface
    const transformedData = data.data.map((testimonial: any) => ({
      id: String(testimonial.id),
      title: testimonial.title,
      content: testimonial.content,
      rating: testimonial.rating,
      reviewer: {
        id: String(Math.random() * 1000), // Generate a temporary ID since backend doesn't provide reviewer id
        name: testimonial.reviewer.name,
        location: testimonial.reviewer.location,
        avatar: testimonial.reviewer.avatar || 'default-avatar.jpg' // Just pass the filename, SimpleImage will handle the path
      },
      experience: {
        id: '1', // Default experience ID since backend doesn't provide experience data
        title: 'Featured Experience', // Default title
        categoryId: '1' // Default category ID
      },
      displayOrder: testimonial.displayOrder,
      createdAt: testimonial.createdAt
    }));
    
    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
      pagination: data.pagination || { total: transformedData.length, hasMore: false }
    });
  } catch (error) {
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch testimonials from database',
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
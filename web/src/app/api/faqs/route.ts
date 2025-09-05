import { NextRequest, NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backendUrl = getServerBackendUrl();
    
    // Build query string from search params
    const queryString = searchParams.toString();
    const apiUrl = queryString ? `${backendUrl}/faqs?${queryString}` : `${backendUrl}/faqs`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    
        // Transform backend response format to match frontend expectations
    if (data.success && data.data) {
      // Transform FAQs to ensure id is string and fields match expectations
      const transformedFaqs = data.data.map((faq: any) => ({
        ...faq,
        id: String(faq.id), // Convert number id to string
      }));

      return NextResponse.json({
        success: true,
        faqs: transformedFaqs,
        pagination: data.pagination,
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch FAQs from backend',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
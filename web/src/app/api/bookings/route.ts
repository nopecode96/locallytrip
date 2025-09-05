import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();
    
    // Validate required fields
    if (!bookingData.category || !bookingData.experience || !bookingData.contactInfo || !bookingData.bookingDetails) {
      return NextResponse.json({
        success: false,
        message: 'Missing required booking information'
      }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Forward to backend booking controller
    const response = await fetch(`${backendUrl}/api/v1/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Booking creation failed');
    }

    return NextResponse.json(result);

  } catch (error) {
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while creating the booking',
      error: process.env.NODE_ENV === 'development' ? String(error) : 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const userId = searchParams.get('userId');
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    let apiUrl = `${backendUrl}/api/v1/bookings`;
    
    if (reference) {
      apiUrl += `/reference/${reference}`;
    } else if (userId) {
      apiUrl += `/user/${userId}`;
    }
    
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch bookings');
    }

    return NextResponse.json(result);

  } catch (error) {
    
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while fetching bookings'
    }, { status: 500 });
  }
}

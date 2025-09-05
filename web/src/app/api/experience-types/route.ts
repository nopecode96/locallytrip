import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${backendUrl}/experience-types`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch experience types');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching experience types:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch experience types' },
      { status: 500 }
    );
  }
}

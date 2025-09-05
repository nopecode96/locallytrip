import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${backendUrl}/host-categories`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch host categories');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching host categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch host categories' },
      { status: 500 }
    );
  }
}

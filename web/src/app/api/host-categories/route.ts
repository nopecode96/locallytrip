import { NextResponse } from 'next/server';
import { getServerBackendUrl } from '@/utils/serverBackend';

export async function GET() {
  try {
    const backendUrl = getServerBackendUrl();
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

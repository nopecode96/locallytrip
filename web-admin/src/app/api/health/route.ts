import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'admin',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || '8080',
    host: process.env.HOST || '0.0.0.0'
  });
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'locallytrip-admin',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || '8080'
  });
}

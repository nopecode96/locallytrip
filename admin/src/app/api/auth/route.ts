import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'password123';

export async function POST(req) {
  const { password } = await req.json();

  if (password === ADMIN_PASSWORD) {
    return NextResponse.json({ success: true, message: 'Login successful' });
  } else {
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  }
}

export async function GET(req) {
  // Here you can implement session management logic if needed
  return NextResponse.json({ success: true, message: 'Session is valid' });
}
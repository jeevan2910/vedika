import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== envUsername || password !== envPassword) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Set a simple mock session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: { username: envUsername }
    });

    // Mock cookie that expires in 1 day
    response.cookies.set('admin_session', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: false, // Accessible by client JS for simple UI state checks
      sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error during login' }, { status: 500 });
  }
}

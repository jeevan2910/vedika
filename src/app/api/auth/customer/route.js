import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, name } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Clean phone number (keep digits only)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number. Must be at least 10 digits.' }, { status: 400 });
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: cleanPhone }
    });

    if (!customer) {
      // Register new customer in database
      customer = await prisma.customer.create({
        data: {
          phone: cleanPhone,
          name: name || null
        }
      });
      console.log(`Registered new customer: ${cleanPhone}`);
    } else {
      console.log(`Customer logged in: ${cleanPhone}`);
    }

    // Set simple mock session cookie for customer
    const response = NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      customer
    });

    response.cookies.set('customer_session', JSON.stringify(customer), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false, // Accessible by client JS
      sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error('Customer auth error:', error);
    return NextResponse.json({ error: 'Internal server error during customer login' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number. Must be at least 10 digits.' }, { status: 400 });
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: cleanPhone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          phone: cleanPhone,
          name: name
        }
      });
      console.log(`Registered new customer via /api/users/register: ${cleanPhone}`);
    } else {
      // Update name if registered anonymously before
      customer = await prisma.customer.update({
        where: { phone: cleanPhone },
        data: { name: name }
      });
      console.log(`Updated customer via /api/users/register: ${cleanPhone}`);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Exclusive collection access granted successfully',
      customer
    }, { status: 200 });

    response.cookies.set('customer_session', JSON.stringify(customer), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error('Customer register error:', error);
    return NextResponse.json({ error: 'Internal server error during registration' }, { status: 500 });
  }
}

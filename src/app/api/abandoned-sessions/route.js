import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function simulateWhatsAppSend(phone, name, productTitle, productId) {
  const message = `Hi ${name || 'there'}, your dress "${productTitle}" is waiting! Look it up here: http://localhost:3000/product/${productId}`;
  
  console.log("\n======================================================================");
  console.log(`🤖 [AUTOMATION ENGINE] DISPATCHING RECOVERY WHATSAPP MESSAGE`);
  console.log(`📱 To Phone: +91 ${phone}`);
  console.log(`💬 Message: "${message}"`);
  console.log("🟢 Status: DELIVERED (Simulated via WhatsApp Business API Gateway)");
  console.log("======================================================================\n");
}

// Public endpoint to log browse abandonment events from customers
export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, name, productTitle, productId, productImage } = body;

    if (!phone || !productTitle || !productId) {
      return NextResponse.json({ error: 'Missing required tracking details' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');

    // Check if there is an existing unrecovered session for this phone
    let session = await prisma.abandonedSession.findFirst({
      where: { phone: cleanPhone, recovered: false }
    });

    if (session) {
      // Update with the latest product they stopped at
      session = await prisma.abandonedSession.update({
        where: { id: session.id },
        data: {
          productTitle,
          productId,
          productImage,
          createdAt: new Date()
        }
      });
      console.log(`Updated abandoned session for customer: ${cleanPhone} on ${productTitle}`);
    } else {
      // Create new session log
      session = await prisma.abandonedSession.create({
        data: {
          phone: cleanPhone,
          name: name || null,
          productTitle,
          productId,
          productImage
        }
      });
      console.log(`Logged new abandoned session for customer: ${cleanPhone} on ${productTitle}`);
    }

    // Trigger the simulated automation dispatch instantly
    await simulateWhatsAppSend(cleanPhone, name, productTitle, productId);

    // Auto-mark the session as recovered by the automated system
    session = await prisma.abandonedSession.update({
      where: { id: session.id },
      data: { recovered: true }
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Error logging abandoned session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Admin-only endpoint to get all abandoned sessions
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const abandoned = await prisma.abandonedSession.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ abandoned });
  } catch (error) {
    console.error('Error fetching abandoned sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch abandoned sessions' }, { status: 500 });
  }
}

// Admin-only endpoint to mark a session as recovered/notified
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { id, recovered } = body;

    if (!id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const updated = await prisma.abandonedSession.update({
      where: { id },
      data: { recovered: recovered === true }
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Error updating abandoned session:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

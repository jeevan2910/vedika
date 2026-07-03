import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount, isGift, giftMessage } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !totalAmount) {
      return NextResponse.json({ error: 'Missing required checkout fields' }, { status: 400 });
    }

    // items should be a JSON array of: [{ id, title, price, quantity, blouseStyle }]
    let parsedItems;
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch {
      return NextResponse.json({ error: 'Invalid items format' }, { status: 400 });
    }

    // Transaction to update stock and save order
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check and update product stock
      for (const item of parsedItems) {
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.id} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for "${product.title}". Only ${product.stock} left.`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: product.stock - item.quantity
          }
        });
      }

      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          items: JSON.stringify(parsedItems),
          totalAmount: parseFloat(totalAmount),
          isGift: isGift === true || isGift === 'true',
          giftMessage: giftMessage || null
        }
      });

      // 3. Mark abandoned sessions for this customer as recovered/completed
      const cleanPhone = customerPhone.replace(/\D/g, '');
      await tx.abandonedSession.updateMany({
        where: { phone: cleanPhone, recovered: false },
        data: { recovered: true }
      });

      return newOrder;
    });

    return NextResponse.json({ order: result, message: 'Order placed successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

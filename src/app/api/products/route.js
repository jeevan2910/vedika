export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fabric = searchParams.get('fabric');
    const occasion = searchParams.get('occasion');
    const color = searchParams.get('color');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where = {};

    if (fabric && fabric !== 'all') {
      where.fabric = fabric;
    }
    if (occasion && occasion !== 'all') {
      where.occasion = occasion;
    }
    if (color && color !== 'all') {
      where.color = color;
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, fabric, category, images, stock, color, occasion, featured } = body;

    if (!title || !description || !price || !fabric || !category || !images || !color || !occasion) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        fabric,
        category,
        images,
        stock: parseInt(stock) || 5,
        color,
        occasion,
        featured: featured === true || featured === 'true'
      }
    });

    return NextResponse.json({ product, message: 'Product created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

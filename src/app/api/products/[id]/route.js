export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { 
      title, description, price, fabric, category, images, stock, color, occasion, featured,
      mrp, discount, tags, design, borderType, blouseType, zari, colorFamily, sizes, isNew
    } = body;

    const currentProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: title !== undefined ? title : currentProduct.title,
        description: description !== undefined ? description : currentProduct.description,
        price: price !== undefined ? parseFloat(price) : currentProduct.price,
        mrp: mrp !== undefined ? (mrp ? parseFloat(mrp) : null) : currentProduct.mrp,
        discount: discount !== undefined ? (discount ? parseInt(discount) : null) : currentProduct.discount,
        fabric: fabric !== undefined ? fabric : currentProduct.fabric,
        category: category !== undefined ? category : currentProduct.category,
        images: images !== undefined ? images : currentProduct.images,
        stock: stock !== undefined ? parseInt(stock) : currentProduct.stock,
        color: color !== undefined ? color : currentProduct.color,
        occasion: occasion !== undefined ? occasion : currentProduct.occasion,
        featured: featured !== undefined ? (featured === true || featured === 'true') : currentProduct.featured,
        isNew: isNew !== undefined ? (isNew === true || isNew === 'true') : currentProduct.isNew,
        tags: tags !== undefined ? tags : currentProduct.tags,
        design: design !== undefined ? design : currentProduct.design,
        borderType: borderType !== undefined ? borderType : currentProduct.borderType,
        blouseType: blouseType !== undefined ? blouseType : currentProduct.blouseType,
        zari: zari !== undefined ? zari : currentProduct.zari,
        colorFamily: colorFamily !== undefined ? colorFamily : currentProduct.colorFamily,
        sizes: sizes !== undefined ? sizes : currentProduct.sizes
      }
    });

    return NextResponse.json({ product: updatedProduct, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (!session || session.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = await params;
    
    const currentProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

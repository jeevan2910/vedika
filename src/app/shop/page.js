import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }) {
  // Await searchParams as required in Next.js 15/16
  const params = await searchParams;
  const fabric = params.fabric || 'all';
  const occasion = params.occasion || 'all';
  const color = params.color || 'all';
  const category = params.category || 'all';

  const where = {};

  if (fabric !== 'all') {
    where.fabric = fabric;
  }
  if (occasion !== 'all') {
    where.occasion = occasion;
  }
  if (color !== 'all') {
    where.color = color;
  }
  if (category !== 'all') {
    where.category = category;
  }

  let products = [];
  try {
    products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching filtered products from database:', error);
  }

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)' }}>Gathering Collection from the Weavers...</div>}>
      <ShopClient initialProducts={products} />
    </Suspense>
  );
}

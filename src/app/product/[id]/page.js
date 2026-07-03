import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import ProductClient from './ProductClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  let product = null;
  let relatedProducts = [];
  try {
    product = await prisma.product.findUnique({ where: { id } });
    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: { fabric: product.fabric, id: { not: product.id } },
        take: 4
      });
      if (relatedProducts.length < 4) {
        const moreProducts = await prisma.product.findMany({
          where: { id: { not: product.id, notIn: relatedProducts.map(p => p.id) } },
          take: 4 - relatedProducts.length
        });
        relatedProducts = [...relatedProducts, ...moreProducts];
      }
    }
  } catch (error) {
    console.error('Error loading product:', error);
  }

  if (!product) notFound();

  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--accent)' }}>Loading saree details...</div>}>
      <ProductClient key={product.id} product={product} relatedProducts={relatedProducts} />
    </Suspense>
  );
}

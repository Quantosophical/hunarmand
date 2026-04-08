import { notFound } from 'next/navigation';
import prisma from "@/lib/prisma";
import ProductClient from '@/components/product/ProductClient';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { artisan: { include: { user: true } } }
  });

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}

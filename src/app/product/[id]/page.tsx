import { notFound } from 'next/navigation';
import prisma from "@/lib/prisma";
import ProductClient from '@/components/product/ProductClient';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: { artisan: { include: { user: true } } }
  });

  if (!product) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  return <ProductClient product={product} currentUserId={session?.user?.id} />;
}

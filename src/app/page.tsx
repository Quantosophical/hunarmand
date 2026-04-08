import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  const trendingProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { artisan: { include: { user: true } } }
  });

  return (
    <HomeClient trendingProducts={trendingProducts} />
  );
}

import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const trendingProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { artisan: { include: { user: true } } }
  });

  const session = await getServerSession(authOptions);
  let userWishlistObject = null;
  if (session) {
    userWishlistObject = await prisma.wishlist.findUnique({
      where: { userId: session.user.id },
      include: { items: true }
    });
  }
  const wishlistedProductIds = new Set(userWishlistObject?.items?.map(i => i.productId) || []);
  
  // Serialize Set to Array for Client Component
  const wishlistedArray = Array.from(wishlistedProductIds);

  return (
    <HomeClient trendingProducts={trendingProducts} wishlistedProductIds={wishlistedArray} />
  );
}

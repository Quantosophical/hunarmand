import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/ui/ProductCard";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              artisan: { include: { user: true } }
            }
          }
        }
      }
    }
  });

  const products = (wishlist?.items || []).map(item => item.product);

  return (
    <div className="bg-deep-black min-h-screen text-cream py-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-12">
          <h1 className="font-heading text-4xl lg:text-5xl font-light mb-2">My Wishlist</h1>
          <p className="font-sans text-sm tracking-wide text-text-muted">Masterpieces you have saved for the future.</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                initialIsWishlisted={true}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-border-gold/30 bg-surface-dark rounded-[1px]">
            <p className="font-heading italic text-2xl text-cream-dark mb-4">Your curation is empty.</p>
            <p className="font-sans text-sm text-text-muted">Explore the gallery and save your favorite masterworks.</p>
          </div>
        )}
      </div>
    </div>
  );
}

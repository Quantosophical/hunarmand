import Link from 'next/link';
import prisma from "@/lib/prisma";
import ProductCard from '@/components/ui/ProductCard';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BrowsePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const category = params?.category;
  const q = params?.query;
  const isGi = params?.gi === "true";

  const products = await prisma.product.findMany({
    where: {
      isActive: true, // Only show exhibited items
      ...(category ? { craftCategory: category } : {}),
      ...(q ? {
        title: {
          contains: q,
        }
      } : {}),
      ...(isGi ? { isGITagged: true } : {}),
    },
    include: { artisan: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }
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


  return (
    <div className="bg-deep-black min-h-screen text-cream pt-32 pb-24">
      {/* Header Area */}
      <div className="w-full relative py-20 mb-16 bg-surface-dark border-b border-border-gold/10 overflow-hidden flex items-center justify-center">
        {/* Subtle Radial Glow instead of SVG */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-radial-gradient from-accent/5 to-transparent blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-cream tracking-wide mb-6">BROWSE THE COLLECTION</h1>
          <div className="w-16 h-[1px] bg-accent/50 mx-auto" />
        </div>
      </div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-16">
        {/* Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-32 space-y-10">
            <div>
              <h3 className="font-accent text-accent tracking-[0.2em] text-sm mb-6 border-b border-border-gold pb-3 flex justify-between items-center group">
                CRAFT CATEGORIES
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-y-1 transition-transform"><path d="M6 9l6 6 6-6"/></svg>
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/browse" className={`text-sm font-sans tracking-wide transition-colors flex items-center gap-3 ${!category ? 'text-accent font-medium' : 'text-text-muted hover:text-cream'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${!category ? 'bg-accent' : 'bg-transparent border border-text-muted'}`} />
                    All Collections
                  </Link>
                </li>
                {['Pashmina', 'Walnut Wood Carving', 'Sozni Embroidery', 'Carpet Weaving', 'Papier-Mâché'].map(cat => (
                   <li key={cat}>
                     <Link href={`/browse?category=${encodeURIComponent(cat)}`} className={`text-sm font-sans tracking-wide transition-colors flex items-center gap-3 ${category === cat ? 'text-accent font-medium' : 'text-text-muted hover:text-cream'}`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${category === cat ? 'bg-accent' : 'bg-transparent border border-text-muted'}`} />
                       {cat}
                     </Link>
                   </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-accent text-accent tracking-[0.2em] text-sm mb-6 border-b border-border-gold pb-3 flex justify-between items-center group">
                AUTHENTICITY
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-y-1 transition-transform"><path d="M6 9l6 6 6-6"/></svg>
              </h3>
              <Link href={isGi ? "/browse" : "/browse?gi=true"} className="flex items-center gap-3 group">
                <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isGi ? 'bg-accent border-accent' : 'border-text-muted group-hover:border-cream'}`}>
                  {isGi && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--deep-black)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                </div>
                <span className={`text-sm font-sans tracking-wide ${isGi ? 'text-cream' : 'text-text-muted group-hover:text-cream'} transition-colors`}>GI Tagged Only</span>
              </Link>
            </div>

            {/* Active Filters Display */}
            {(category || isGi) && (
              <div className="pt-6">
                <p className="font-sans text-xs text-text-muted mb-3 uppercase tracking-widest">Active Filters</p>
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <Link href="/browse" className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-mid border border-border-gold rounded-full text-xs text-cream hover:bg-surface-warm transition-colors">
                      {category} <span className="text-accent">&times;</span>
                    </Link>
                  )}
                  {isGi && (
                    <Link href="/browse" className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-mid border border-border-gold rounded-full text-xs text-cream hover:bg-surface-warm transition-colors">
                      GI Tagged <span className="text-accent">&times;</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-4">
            <p className="font-sans text-text-muted text-sm tracking-wider uppercase">Showing {products.length} Masterpiece{products.length !== 1 ? 's' : ''}</p>
            <div className="font-sans text-sm tracking-wider text-text-muted flex items-center gap-2">
              <span>Sort by:</span>
              <span className="text-accent border-b border-accent pb-0.5 cursor-pointer">Newest Arrivals</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
              {products.length > 0 ? products.map((product: any, i: number) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-[30px] duration-700 ease-out fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={product} initialIsWishlisted={wishlistedProductIds.has(product.id)} />
                </div>
              )) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center border border-border-subtle bg-surface-mid text-center px-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1" className="mb-6 opacity-50">
                     <path d="M12 2L2 22h20L12 2z"/>
                  </svg>
                  <p className="font-heading italic text-2xl text-cream mb-4">No pieces found matching your search</p>
                  <p className="font-sans text-text-muted text-sm mb-8 tracking-wide">Adjust your filters to explore more of our collection.</p>
                  <Link href="/browse" className="border border-accent text-accent px-6 py-2.5 font-accent tracking-widest text-xs hover:bg-gradient-gold hover:text-primary transition-all duration-300">
                    CLEAR FILTERS
                  </Link>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

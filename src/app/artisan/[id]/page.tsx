
import { notFound } from 'next/navigation';
import prisma from "@/lib/prisma";
import ProductCard from '@/components/ui/ProductCard';

export default async function ArtisanProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const artisanProfile = await prisma.artisanProfile.findUnique({
    where: { id },
    include: { 
      user: true, 
      products: { 
        where: { isActive: true },
        include: { artisan: { include: { user: true } } }
      } 
    }
  });

  if (!artisanProfile) {
    notFound();
  }

  // Fallback to placeholder if no profile photo
  const profilePhoto = artisanProfile.profilePhoto || 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=1200&q=80';
  const isVerified = artisanProfile.verificationStatus === 'VERIFIED';
  
  return (
    <div className="bg-deep-black min-h-screen text-cream">
      {/* Hero Section */}
      <div className="w-full flex flex-col md:flex-row h-auto md:h-[60vh] min-h-[500px]">
        
        {/* Left 40% - Image */}
        <div className="w-full md:w-[40%] h-[50vh] md:h-full relative overflow-hidden">
          <img 
            src={profilePhoto} 
            alt={artisanProfile.user.name || "Artisan"} 
            className="object-cover w-full h-full grayscale-[30%] object-top" 
          />
          {/* Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(10,10,10,0.8)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-deep-black" />
        </div>

        {/* Right 60% - Info */}
        <div className="w-full md:w-[60%] h-full relative bg-deep-black flex flex-col justify-center px-6 md:px-16 py-12 md:py-0 overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h4 className="font-sans text-[0.65rem] tracking-widest text-accent font-medium uppercase mb-4">
              Master Artisan
            </h4>
            <h1 className="font-heading text-5xl md:text-7xl text-cream mb-4 leading-tight">
              {artisanProfile.user.name}
            </h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="font-sans text-sm tracking-wide text-text-muted">
                {artisanProfile.village}, {artisanProfile.district} • {artisanProfile.yearsExperience} Years Experience
              </span>
            </div>

            <p className="font-heading text-3xl md:text-4xl text-accent mb-8">
              {artisanProfile.craftType}
            </p>

            {isVerified && (
              <div className="flex items-center gap-3 mb-8 bg-surface-mid/30 border border-border-gold/10 inline-flex px-4 py-2 rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                <span className="font-sans text-xs tracking-widest text-cream uppercase">Verified by Hunarmand</span>
              </div>
            )}

            {artisanProfile.craftLineage && (
              <p className="font-sans italic text-lg text-cream-dark opacity-90 mb-10 leading-relaxed border-l-2 border-border-gold/30 pl-4">
                &quot;{artisanProfile.craftLineage}&quot;
              </p>
            )}

            {/* Stat Boxes */}
            <div className="flex gap-4 md:gap-8">
              <div className="bg-surface-mid/20 rounded-lg px-6 py-4 flex-1 text-center border border-border-gold/5">
                <p className="font-sans text-[0.6rem] tracking-widest text-text-muted uppercase mb-2">Total Sales</p>
                <p className="font-heading text-2xl text-accent">342</p>
              </div>
              <div className="bg-surface-mid/20 rounded-lg px-6 py-4 flex-1 text-center border border-border-gold/5">
                <p className="font-sans text-[0.6rem] tracking-widest text-text-muted uppercase mb-2">Rating</p>
                <p className="font-heading text-2xl text-accent">4.9/5</p>
              </div>
              <div className="bg-surface-mid/20 rounded-lg px-6 py-4 flex-1 text-center border border-border-gold/5">
                <p className="font-sans text-[0.6rem] tracking-widest text-text-muted uppercase mb-2">Member Since</p>
                <p className="font-heading text-2xl text-accent">{new Date(artisanProfile.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biography Area */}
      <div className="container mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-heading text-2xl md:text-3xl text-cream-dark leading-relaxed">
          {artisanProfile.bio || `Master ${artisanProfile.user.name} continues a centuries-old tradition from the heart of Kashmir, bringing timeless artistry into the modern world.`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="bg-rich-dark py-24 border-t border-border-subtle">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-accent text-[0.7rem] tracking-[0.3em] uppercase text-accent mb-4">The Collection</h2>
            <h3 className="font-heading italic text-4xl text-cream font-light">Masterpieces by {artisanProfile.user.name}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisanProfile.products.length > 0 ? artisanProfile.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            )) : (
              <p className="col-span-full py-12 text-center text-text-muted font-sans tracking-wide">
                No masterpieces listed currently.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

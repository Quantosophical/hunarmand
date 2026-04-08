'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

export default function ProductClient({ product }: { product: any }) {
  const images = JSON.parse(product.images || "[]");
  const mainImage = Array.isArray(images) && images.length > 0 ? images[0] : "";
  const [activeImage, setActiveImage] = useState(mainImage);
  const [activeTab, setActiveTab] = useState('craft');

  const artisanProfilePhoto = product.artisan.profilePhoto || 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="bg-deep-black min-h-screen text-cream pt-24 pb-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* L: Image Gallery (55%) */}
          <div className="w-full lg:w-[55%]">
            <div className="relative aspect-[4/5] bg-surface-dark mb-6 group overflow-hidden flex items-center justify-center">
              {activeImage ? (
                <img 
                  src={activeImage} 
                  alt={product.title} 
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                />
              ) : (
                <div className="w-full h-full bg-surface-warm opacity-10" />
              )}
              {product.isGITagged && (
                <div className="absolute top-6 left-6 bg-deep-black/90 backdrop-blur-md border border-accent/50 px-4 py-2">
                  <span className="font-accent text-[0.65rem] tracking-[0.2em] text-accent uppercase">GI Certified Authentic</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {Array.isArray(images) && images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-24 shrink-0 overflow-hidden transition-all duration-300 ${activeImage === img ? 'border-2 border-accent opacity-100' : 'border border-border-subtle opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* R: Product Info (45%) */}
          <div className="w-full lg:w-[45%] flex flex-col">
            <div className="mb-8">
              <p className="font-accent text-[0.7rem] tracking-[0.3em] text-accent uppercase mb-4">
                {product.craftCategory}
              </p>
              <h1 className="font-heading text-4xl lg:text-5xl font-light text-cream mb-4 leading-tight">
                {product.title}
              </h1>
              
              <Link href={`/artisan/${product.artisan.id}`} className="group flex items-center gap-2 inline-flex">
                <span className="font-sans text-sm text-text-muted group-hover:text-cream transition-colors">Crafted by {product.artisan.user.name}</span>
                {product.artisan.verificationStatus === 'VERIFIED' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-border-gold/30">
              <span className="font-heading italic text-4xl text-accent">₹{product.price.toLocaleString('en-IN')}</span>
              <div className="w-[1px] h-8 bg-border-gold/30" />
              <div className="flex flex-col">
                <span className="font-sans text-[0.65rem] text-text-muted uppercase tracking-widest mb-1">Availability</span>
                <span className={`font-sans text-sm ${product.stock > 0 ? 'text-cream' : 'text-error'}`}>
                  {product.stock > 0 ? `${product.stock} in atelier` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Authenticity Block */}
            <div className="border border-border-gold bg-surface-dark p-6 mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 w-32 h-32 transform translate-x-4 -translate-y-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="0.5"><circle cx="12" cy="12" r="10"/></svg>
              </div>
              
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-10 h-10 border border-border-gold flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="3"></rect><rect x="14" y="7" width="3" height="3"></rect><rect x="7" y="14" width="3" height="3"></rect><rect x="14" y="14" width="3" height="3"></rect></svg>
                </div>
                <div>
                  <h4 className="font-accent text-accent tracking-[0.1em] text-sm mb-1 uppercase">Certificate of Authenticity</h4>
                  <p className="font-heading italic text-cream-dark text-lg mb-2">{product.artisan.user.name} • {product.artisan.village}</p>
                  <p className="font-sans text-xs text-text-muted tracking-wide mb-4">Scan QR on delivery package to verify cryptographic provenance.</p>
                  <div className="flex flex-wrap gap-4 font-accent text-[0.6rem] tracking-widest text-cream uppercase">
                    <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-accent rounded-full"/> {product.craftCategory}</span>
                    {product.isGITagged && <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-accent rounded-full"/> GI Tag</span>}
                    <span className="flex items-center gap-1.5"><span className="w-1 h-1 bg-accent rounded-full"/> Handmade</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <AddToCartButton productId={product.id} className="w-full py-4 border border-accent bg-transparent hover:bg-accent/10 transition-colors font-accent tracking-widest text-accent text-sm" />
              <AddToCartButton productId={product.id} buyNow className="w-full py-4 bg-gradient-gold text-primary hover:brightness-110 transition-all font-accent tracking-widest font-bold text-sm" />
            </div>

            {/* Time to Make Indicator */}
            {product.timeToMake && (
              <div className="flex items-center gap-4 bg-surface-mid p-4 mb-10 border border-border-subtle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <span className="font-sans text-sm tracking-wide text-text-muted">This masterpiece takes <span className="text-cream">{product.timeToMake}</span> to craft by hand.</span>
              </div>
            )}

            {/* Custom Tabs */}
            <div className="mt-4">
              <div className="flex gap-8 border-b border-border-gold/30 mb-8 overflow-x-auto hide-scrollbar">
                {['craft', 'maker', 'shipping'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`font-heading text-lg pb-4 relative whitespace-nowrap transition-colors ${activeTab === tab ? 'text-cream italic' : 'text-text-muted hover:text-cream'}`}
                  >
                    {tab === 'craft' ? 'The Craft' : tab === 'maker' ? 'The Maker' : 'Shipping'}
                    {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />}
                  </button>
                ))}
              </div>

              <div className="font-sans text-text-muted font-light leading-relaxed">
                {activeTab === 'craft' && (
                  <div className="space-y-6">
                    <p>{product.description}</p>
                    {product.materials && (
                      <div className="mt-8">
                        <p className="font-accent text-[0.65rem] tracking-widest text-accent uppercase mb-2">Materials</p>
                        <p className="text-cream">{product.materials}</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'maker' && (
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-24 h-24 shrink-0 rounded-full overflow-hidden border border-border-gold p-1">
                      <img src={artisanProfilePhoto} alt={product.artisan.user.name} className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div>
                      <h4 className="font-heading text-2xl text-cream mb-2">{product.artisan.user.name}</h4>
                      <p className="text-sm tracking-wide mb-4">From {product.artisan.village}</p>
                      <Link href={`/artisan/${product.artisan.id}`} className="font-accent text-[0.65rem] tracking-widest text-accent uppercase border-b border-accent pb-1">
                        Discover the Atelier
                      </Link>
                    </div>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-4">
                    <p>Each piece is carefully packaged in our signature artisan boxes to ensure safe transit from Kashmir to your door.</p>
                    <p className="text-cream">{product.internationalShipping ? 'International delivery available (10-14 business days).' : 'Currently shipping within India only (5-7 business days).'}</p>
                    <p className="text-sm border border-border-gold/30 p-4 mt-6">
                      <strong className="block text-cream mb-1 font-normal">Complimentary Returns</strong>
                      For heritage crafts, we accept returns within 7 days of delivery, provided the cryptographic seal hasn&apos;t been tampered with.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

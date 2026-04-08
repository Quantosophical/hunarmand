import React from 'react';
import Link from 'next/link';
import { Heart, Lock } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    craftCategory: string;
    price: number;
    images: string;
    isGITagged: boolean;
    artisan: {
      id: string;
      user: {
        name: string | null;
      };
      verificationStatus: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  let mainImage = "";
  try {
    const images = JSON.parse(product.images);
    mainImage = Array.isArray(images) && images.length > 0 ? images[0] : "";
  } catch (e) {
    mainImage = product.images; // fallback
  }

  const isVerified = product.artisan.verificationStatus === 'VERIFIED';

  return (
    <div className="group relative bg-gradient-card border border-border-subtle rounded-[var(--radius-card)] overflow-hidden shadow-card transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[6px]">
      <Link href={`/product/${product.id}`} className="block relative aspect-4/3 overflow-hidden bg-surface-mid">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={product.title} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[600ms] ease-out" 
          />
        ) : (
          <div className="w-full h-full bg-surface-warm opacity-50" />
        )}
        
        {/* Dark overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* GI Tag */}
        {product.isGITagged && (
          <div className="absolute top-3 left-3 bg-deep-black/80 backdrop-blur-md border border-accent px-2 py-1 rounded-[1px] shadow-gold">
            <span className="font-accent text-[0.6rem] tracking-[0.1em] text-accent font-bold uppercase">GI Certified</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col h-full relative z-10">
        <p className="font-accent text-[0.65rem] tracking-[0.2em] text-accent uppercase mb-2">
          {product.craftCategory}
        </p>
        
        <Link href={`/product/${product.id}`} className="group-hover:text-accent transition-colors">
          <h3 className="font-heading text-xl text-text-primary line-clamp-1 mb-1">{product.title}</h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-4">
          <Link href={`/artisan/${product.artisan.id}`} className="hover:underline">
            <p className="font-sans text-[0.8rem] text-text-muted line-clamp-1">
              By {product.artisan.user.name || "Artisan"}
            </p>
          </Link>
          {isVerified && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 11.08V12C21.9988 14.1564 21.3001 16.2547 20.0093 17.9818C18.7185 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13632 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 4L12 14.01L9 11.01" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        
        <div className="mt-auto flex justify-between items-end">
          <span className="font-heading italic text-[1.25rem] text-accent">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>
        
        {/* Wishlist Icon */}
        <button className="absolute right-5 bottom-5 text-text-muted hover:text-accent transition-colors z-20" aria-label="Add to wishlist">
          <Heart className="w-5 h-5 hover:fill-accent transition-all duration-300 active:scale-95" />
        </button>
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-center gap-1.5 pt-3 border-t border-border-subtle">
          <Lock className="w-[10px] h-[10px] text-text-muted" />
          <span className="font-sans text-[0.65rem] text-text-muted uppercase tracking-wider">Verified Authentic</span>
        </div>
      </div>
    </div>
  );
}

'use client';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ProductCard from '@/components/ui/ProductCard';
import ArabesqueDivider from '@/components/ui/ArabesqueDivider';
import ChinarBackground from '@/components/ui/ChinarBackground';

const HeroCanvas3D = dynamic(() => import('@/components/ui/HeroCanvas3D'), { ssr: false });

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

function StatItem({ number, label }: { number: number | string, label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-heading text-5xl md:text-7xl text-[#C9A84C] mb-4"
      >
        {number}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-sans text-sm tracking-widest text-[#D4C4A8] uppercase"
      >
        {label}
      </motion.div>
    </div>
  );
}

export default function HomeClient({ trendingProducts, wishlistedProductIds = [] }: { trendingProducts: any[], wishlistedProductIds?: string[] }) {
  return (
    <main className="flex-1 overflow-hidden selection:bg-accent/30" style={{ background: 'linear-gradient(180deg, #2A2218 0%, #1A1612 50%, #0A0A0A 100%)' }}>

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[100svh] flex items-center">
        {/* Layer 1: Background Gradient - Vintage Royal Beige */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,_#3D3020_0%,_#2A2218_55%,_#1A1612_100%)] z-0" />

        {/* Layer 2: Faded Kashmiri Chinar Tree Background */}
        <ChinarBackground />

        {/* Layer 3: 3D Canvas */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 z-0 opacity-30 md:opacity-80 mix-blend-screen">
          <HeroCanvas3D />
        </div>

        {/* Layer 4: Content */}
        <div className="container mx-auto px-6 relative z-20 w-full">
          <motion.div 
            className="max-w-2xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUp} className="mb-6 inline-block border border-[#C9A84C]/30 px-3 py-1 bg-[#1A1612]/50 backdrop-blur-sm">
              <span className="font-sans text-[0.6rem] text-[#C9A84C] tracking-[0.3em] uppercase">
                Handcrafted in Kashmir
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-light text-[#F5F0E8] leading-[1.1] mb-6" style={{ textShadow: '0 0 40px rgba(201, 168, 76, 0.3)' }}>
              Where Every Thread<br />
              <span className="italic text-[#C9A84C]">Tells a Story</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="font-sans font-light text-lg text-[#D4C4A8] mb-10 max-w-md leading-relaxed">
              381,505 artisans. Centuries of heritage. Finally, a direct path to the world.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6">
              <Link href="/browse" className="relative overflow-hidden group px-8 py-4 bg-gradient-gold flex items-center justify-center">
                <span className="relative z-10 font-accent text-[#0A0A0A] font-bold tracking-[0.2em] text-sm group-hover:scale-105 transition-transform">EXPLORE CRAFTS</span>
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </Link>
              <Link href="/join-as-artisan" className="px-8 py-4 border border-[#D4C4A8] hover:border-[#C9A84C] hover:text-[#C9A84C] font-accent text-[#F5F0E8] tracking-[0.2em] text-sm text-center transition-all duration-300">
                JOIN AS ARTISAN
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent animate-pulse" />
          <span className="font-sans text-[0.5rem] text-[#C9A84C] tracking-[0.4em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        </div>
      </section>

      <ArabesqueDivider />

      {/* 2. FEATURED CRAFT CATEGORIES */}
      <section className="py-24 px-6 relative z-10 bg-[#241E18] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDBMNDAgMjBMMjAgNDBMMCAyMEwyMCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')]">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-accent text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-4">Explore by Craft</h2>
            <div className="w-20 h-[1px] bg-[#C9A84C] mb-6" />
            <p className="font-heading italic text-[#F5F0E8] text-2xl md:text-3xl font-light">Eight centuries of Kashmiri mastery</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Pashmina', count: '1,204 Artisans', icon: <path d="M4 12Q8 4 12 12T20 12" /> },
              { name: 'Walnut Wood', count: '840 Artisans', icon: <path d="M12 2L18 8V18C18 20 12 22 12 22C12 22 6 20 6 18V8L12 2Z" /> },
              { name: 'Papier-Mache', count: '650 Artisans', icon: <rect x="4" y="8" width="16" height="12" rx="2" /> },
              { name: 'Sozni Embroidery', count: '2,100 Artisans', icon: <path d="M12 4V20M8 8V16M16 8V16" /> },
              { name: 'Carpet Weaving', count: '5,000 Artisans', icon: <path d="M4 4H20M4 8H20M4 12H20M4 16H20M4 20H20" /> },
              { name: 'Copperware', count: '320 Artisans', icon: <path d="M8 4H16L18 10C18 15 12 20 12 20C12 20 6 15 6 10L8 4Z" /> },
              { name: 'Crewel Work', count: '1,400 Artisans', icon: <circle cx="12" cy="12" r="8" /> },
              { name: 'Tilla Work', count: '900 Artisans', icon: <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" /> }
            ].map((craft, i) => (
              <Link key={craft.name} href={`/browse?category=${encodeURIComponent(craft.name)}`} className="group block h-full">
                <div className="h-full bg-gradient-card border border-[rgba(201,168,76,0.08)] rounded-[var(--radius-card)] p-6 transition-all duration-400 hover:border-[#C9A84C]/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(201,168,76,0.15)] flex flex-col items-center text-center relative overflow-hidden">

                  <div className="w-16 h-16 mb-6 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#C9A84C] rounded-full blur-[20px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {craft.icon}
                    </svg>
                  </div>

                  <h3 className="font-heading text-xl md:text-2xl text-[#F5F0E8] mb-2 group-hover:text-[#C9A84C] transition-colors">{craft.name}</h3>
                  <p className="font-sans text-xs tracking-wider text-[#C9A84C]/60 mb-6">{craft.count}</p>

                  <div className="mt-auto opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <span className="font-sans text-xs tracking-widest text-[#F5F0E8] uppercase">Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ArabesqueDivider />

      {/* 3. TRENDING PRODUCTS */}
      {trendingProducts && trendingProducts.length > 0 && (
        <section className="py-24 px-6 bg-[#1A1612] relative">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <h2 className="font-accent text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-4">Curated Selection</h2>
                <h3 className="font-heading italic text-[#F5F0E8] text-3xl md:text-4xl font-light">New Arrivals</h3>
              </div>
              <Link href="/browse" className="mt-6 md:mt-0 font-sans text-sm tracking-widest text-[#C9A84C] uppercase hover:text-[#F5F0E8] transition-colors border-b border-[#C9A84C] pb-1">
                View Entire Collection
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} initialIsWishlisted={wishlistedProductIds.includes(product.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. "WHY HUNARMAND" SECTION */}
      <section className="py-32 px-6 bg-[#241E18] border-y border-[rgba(201,168,76,0.08)] relative overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            <div className="text-center px-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <h3 className="font-heading text-2xl text-[#F5F0E8] italic mb-4">Verified by Hand</h3>
              <p className="font-sans text-[#B8A890] font-light leading-relaxed">Every artisan is physically verified by our team in Kashmir. Real people, real heritage.</p>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[rgba(201,168,76,0.3)] to-transparent opacity-50" />
            </div>

            <div className="text-center px-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-8">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
              <h3 className="font-heading text-2xl text-[#F5F0E8] italic mb-4">Direct from Maker</h3>
              <p className="font-sans text-[#B8A890] font-light leading-relaxed">No middlemen. The payment reaches the artisan directly, empowering communities.</p>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[rgba(201,168,76,0.3)] to-transparent opacity-50" />
            </div>

            <div className="text-center px-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-8">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M8 13h2"/>
                <path d="M8 17h2"/>
                <path d="M14 13h2"/>
                <path d="M14 17h2"/>
              </svg>
              <h3 className="font-heading text-2xl text-[#F5F0E8] italic mb-4">Certified Authentic</h3>
              <p className="font-sans text-[#B8A890] font-light leading-relaxed">Every piece comes with a cryptographic Certificate of Authenticity tracing its provenance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section className="py-32 px-6 bg-[#1A1612] border-b border-[rgba(201,168,76,0.08)]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem number="381K" label="Artisans on Platform" />
            <StatItem number="60+" label="Craft Categories" />
            <StatItem number="₹0" label="Middlemen Involved" />
            <StatItem number="100%" label="Directly from Maker" />
          </div>
        </div>
      </section>

      {/* 6. FOUNDERS SECTION */}
      <section className="py-32 px-6 bg-[#2A2218] relative overflow-hidden">
        <div className="absolute inset-0 bg-chinar-pattern opacity-[0.03] mix-blend-screen pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-accent text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-4">The Visionaries</h2>
            <div className="w-20 h-[1px] bg-[#C9A84C] mx-auto mb-6" />
            <h3 className="font-heading italic text-[#F5F0E8] text-3xl md:text-4xl font-light mb-6">Built for Kashmir, by Kashmir.</h3>
            <p className="font-sans text-[#D4C4A8] max-w-2xl mx-auto leading-relaxed">
              Hunarmand was forged with a singular mission: to resurrect the dignity of the artisan and eliminate the exploitative middlemen that have plagued our heritage for generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            {/* Sahil */}
            <div className="flex flex-col items-center text-center p-8 bg-[#1A1612] border border-[rgba(201,168,76,0.1)] rounded-[var(--radius-card)] hover:border-[#C9A84C]/40 transition-colors group">
              <div className="w-24 h-24 rounded-full bg-[#2A2218] border-2 border-[#C9A84C]/30 flex items-center justify-center mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <span className="font-heading text-4xl text-[#C9A84C]">S</span>
              </div>
              <h4 className="font-heading text-2xl text-[#F5F0E8] mb-1">Sahil Mehraj</h4>
              <p className="font-accent tracking-[0.2em] text-[#C9A84C] text-[0.65rem] uppercase mb-4">Co-Founder</p>
              <div className="w-12 h-[1px] bg-[#C9A84C]/30 mb-4" />
              <p className="font-sans text-sm text-[#B8A890] leading-relaxed">
                The technical master behind the platform, architecting the digital infrastructure and codebase that brings centuries-old craftsmanship to the modern world.
              </p>
            </div>

            {/* Kafeel */}
            <div className="flex flex-col items-center text-center p-8 bg-[#1A1612] border border-[rgba(201,168,76,0.1)] rounded-[var(--radius-card)] hover:border-[#C9A84C]/40 transition-colors group">
              <div className="w-24 h-24 rounded-full bg-[#2A2218] border-2 border-[#C9A84C]/30 flex items-center justify-center mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <span className="font-heading text-4xl text-[#C9A84C]">A</span>
              </div>
              <h4 className="font-heading text-2xl text-[#F5F0E8] mb-1">Abdul Kafeel</h4>
              <p className="font-accent tracking-[0.2em] text-[#C9A84C] text-[0.65rem] uppercase mb-4">Co-Founder</p>
              <div className="w-12 h-[1px] bg-[#C9A84C]/30 mb-4" />
              <p className="font-sans text-sm text-[#B8A890] leading-relaxed">
                The business brain driving operations, growth, and the broader vision—while still occasionally vibecoding to keep the digital momentum alive.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

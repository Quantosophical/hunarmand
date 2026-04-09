import React from 'react';
import ArabesqueDivider from '@/components/ui/ArabesqueDivider';

export default function HowItWorksPage() {
  return (
    <main className="flex-1 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #1A1612 50%, #2A2218 100%)' }}>
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[60svh] flex flex-col justify-center items-center pt-32 pb-20 px-6 text-center">
        <div className="absolute inset-0 bg-radial-gradient from-accent/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="mb-6 inline-block border border-accent/30 px-4 py-1.5 bg-deep-black/50 backdrop-blur-sm z-10">
          <span className="font-accent text-[0.6rem] text-accent tracking-[0.4em] uppercase">
            The Process
          </span>
        </div>

        <h1 className="font-heading text-5xl md:text-7xl text-cream leading-[1.1] mb-6 z-10">
          Transparency by <span className="italic text-accent">Design</span>
        </h1>

        <p className="font-sans font-light text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl px-4 z-10 mb-12">
          Understanding the lifecycle of a masterpiece from the loom in a high-altitude village directly to your living room.
        </p>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-4 z-20">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent animate-pulse" />
        </div>
      </section>

      <ArabesqueDivider />

      {/* 2. THE STEPS */}
      <section className="py-24 px-6 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDBMNDAgMjBMMjAgNDBMMCAyMEwyMCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')]">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-32">
            
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="order-2 md:order-1 flex justify-center">
                <div className="w-56 h-56 rounded-full border border-border-gold/30 flex items-center justify-center p-2 bg-surface-dark relative shadow-[0_0_50px_rgba(201,168,76,0.05)] overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 rounded-full animate-pulse" />
                  <img src="/images/verification.png" alt="Verification" className="w-full h-full object-cover rounded-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1000ms] scale-105 group-hover:scale-100 relative z-10" />
                </div>
              </div>
              <div className="order-1 md:order-2">
                 <h2 className="font-accent text-accent tracking-[0.3em] uppercase text-xs mb-4">Phase I</h2>
                 <h3 className="font-heading text-4xl text-cream mb-6">Physical Verification</h3>
                 <p className="font-sans font-light text-text-muted leading-relaxed text-lg">
                   Every artisan on Hunarmand is physically verified by our ground team in Kashmir. We validate their heritage, check their Aadhar credentials, and document their workshop. No aggregators, no factories. Only genuine creators are granted a Guild Dashboard.
                 </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="text-right">
                 <h2 className="font-accent text-accent tracking-[0.3em] uppercase text-xs mb-4">Phase II</h2>
                 <h3 className="font-heading text-4xl text-cream mb-6">The Open Atelier</h3>
                 <p className="font-sans font-light text-text-muted leading-relaxed text-lg">
                   Artisans list their completed masterpieces or accept bespoke commissions. You browse a curated gallery of authentic crafts spanning Pashmina, Woodwork, and Crewel. You see exactly who made the piece, their history, and the time it took to create.
                 </p>
              </div>
              <div className="flex justify-center">
                <div className="w-56 h-56 rounded-full border border-border-gold/30 flex items-center justify-center p-2 bg-surface-dark relative shadow-[0_0_50px_rgba(201,168,76,0.05)] overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 rounded-full animate-pulse blur-xl" />
                  <img src="/images/atelier.png" alt="The Open Atelier" className="w-full h-full object-cover rounded-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1000ms] scale-105 group-hover:scale-100 relative z-10" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
              <div className="order-2 md:order-1 flex justify-center">
                <div className="w-56 h-56 rounded-full border border-border-gold/30 flex items-center justify-center p-2 bg-surface-dark relative shadow-[0_0_50px_rgba(201,168,76,0.05)] overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 rounded-full animate-pulse" />
                  <img src="/images/patronage.png" alt="Direct Patronage" className="w-full h-full object-cover rounded-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1000ms] scale-105 group-hover:scale-100 relative z-10" />
                </div>
              </div>
              <div className="order-1 md:order-2">
                 <h2 className="font-accent text-accent tracking-[0.3em] uppercase text-xs mb-4">Phase III</h2>
                 <h3 className="font-heading text-4xl text-cream mb-6">Direct Patronage</h3>
                 <p className="font-sans font-light text-text-muted leading-relaxed text-lg">
                   When you purchase an artifact, your payment goes directly into an escrow tied to the artisan's verified bank account. We take zero commission on the sale. The artisan ships the product directly to you from Kashmir, accompanied by a cryptographic GI tag (Geographical Indication) proving absolute authenticity.
                 </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <ArabesqueDivider />
      
      {/* 3. CTA */}
      <section className="py-32 px-6 relative bg-deep-black text-center">
        <h2 className="font-heading italic text-4xl lg:text-5xl text-cream mb-8">Ready to explore the heritage?</h2>
        <a href="/browse" className="inline-block relative overflow-hidden group px-10 py-5 bg-gradient-gold">
          <span className="relative z-10 font-accent text-deep-black font-bold tracking-[0.2em] text-sm group-hover:scale-105 transition-transform">
            ENTER THE GALLERY
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </a>
      </section>

    </main>
  );
}

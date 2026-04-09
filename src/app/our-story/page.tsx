import React from 'react';
import ArabesqueDivider from '@/components/ui/ArabesqueDivider';
import ChinarBackground from '@/components/ui/ChinarBackground';

export default function OurStoryPage() {
  return (
    <main className="flex-1 overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #1A1612 50%, #2A2218 100%)' }}>
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90svh] flex items-center pt-20">
        <ChinarBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-transparent to-[#1A1612] z-0" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="mb-8 inline-block border border-accent/30 px-4 py-1.5 bg-deep-black/50 backdrop-blur-sm">
            <span className="font-accent text-[0.6rem] text-accent tracking-[0.4em] uppercase">
              The Legacy
            </span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-cream leading-[1.1] mb-8 drop-shadow-2xl">
            Eight Centuries of <br />
            <span className="italic text-accent">Mastery</span>
          </h1>

          <p className="font-sans font-light text-lg md:text-xl text-text-muted leading-relaxed mx-auto max-w-2xl px-4">
            Forged in the valleys of Kashmir, whispered from generation to generation. Hunarmand is the bridge between ancient artisanship and the modern world.
          </p>
        </div>
      </section>

      <ArabesqueDivider />

      {/* 2. THE ORIGIN */}
      <section className="py-32 px-6 relative bg-[#1A1612] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDBMNDAgMjBMMjAgNDBMMCAyMEwyMCAwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div className="relative aspect-[3/4] lg:aspect-[4/5] bg-surface-dark border border-border-gold/20 rounded-t-[50%] p-4 overflow-hidden group">
              <div className="absolute inset-0 bg-radial-gradient from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <img 
                src="/images/zain_original.jpg" 
                alt="Sultan Zain-ul-Abidin" 
                className="w-full h-full object-cover rounded-t-[50%] grayscale-[30%] group-hover:grayscale-0 transition-all duration-[1000ms] scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1A1612] to-transparent" />
            </div>

            <div className="lg:pl-10">
              <h2 className="font-accent text-accent tracking-[0.3em] uppercase text-xs mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent" />
                The Dawn of Craft
              </h2>
              <h3 className="font-heading text-4xl lg:text-6xl text-cream mb-8 leading-tight">
                Sultan <span className="italic text-accent">Zain-ul-Abidin</span>
              </h3>
              <div className="space-y-6 list-none font-sans font-light text-text-muted text-lg leading-relaxed">
                <p>
                  In the 15th century, the visionary ruler Sultan Zain-ul-Abidin invited masters from Persia and Central Asia to the Kashmir valley. They sowed the seeds of carpet weaving, papier-mâché, and exquisite wood carving.
                </p>
                <p>
                  Kashmir transformed into a living atelier. The geographical isolation of the valley meant that these crafts evolved in an echo chamber of perfection, absorbing the stunning natural beauty of the Chinar leaves, the Dal lake, and the snow-capped peaks into their motifs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE 381K */}
      <section className="py-40 px-6 relative bg-deep-black overflow-hidden">
        {/* Giant background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none opacity-5 flex overflow-hidden whitespace-nowrap z-0">
          <span className="font-heading text-[30vw] text-cream">381,505</span>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="font-heading text-5xl lg:text-7xl text-cream mb-10">
            A Population of <span className="italic text-accent">Creators</span>
          </h2>
          <p className="font-sans font-light text-xl text-text-muted leading-relaxed mb-16">
            Today, there are exactly 381,505 registered artisans in Kashmir. They do not work in factories; they work in their homes. The craft is not an industry for them; it is an inheritance. A grandfather passing the Loom of life to his granddaughter.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-b border-border-gold/20 py-12">
            {[
              { count: '135,000+', label: 'Pashmina Weavers' },
              { count: '65,000+', label: 'Sozni Embroiderers' },
              { count: '45,000+', label: 'Carpet Makers' },
              { count: '136,505+', label: 'Other Guilds' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-heading text-3xl text-accent mb-2">{stat.count}</p>
                <p className="font-sans text-[0.65rem] tracking-[0.2em] text-text-muted uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ArabesqueDivider />

      {/* 4. THE MISSION */}
      <section className="py-32 px-6 relative bg-[#1A1612]">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="font-accent text-accent tracking-[0.3em] uppercase text-xs mb-8">
            Our Purpose
          </h2>
          <blockquote className="font-heading italic text-3xl md:text-5xl text-cream leading-snug mb-12">
            &ldquo;To remove the glass wall between the artisan's hands and the patron's heart.&rdquo;
          </blockquote>
          <p className="font-sans font-light text-lg text-text-muted max-w-3xl mx-auto leading-relaxed">
            For decades, middlemen have stood between these creators and the world, diluting both the authenticity of the craft and the livelihood of the artisan. Hunarmand was built to break that chain. We physically verify every artisan, certify every piece with a cryptographic GI tag, and direct 100% of the value directly to the maker.
          </p>
        </div>
      </section>

    </main>
  );
}

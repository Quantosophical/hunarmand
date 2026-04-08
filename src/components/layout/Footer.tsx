import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-deep-black text-cream relative mt-auto overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="chinar" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0C50 0 45 15 20 25C35 25 45 15 50 0ZM50 100C50 100 45 85 20 75C35 75 45 85 50 100ZM0 50C0 50 15 45 25 20C25 35 15 45 0 50ZM100 50C100 50 85 45 75 20C75 35 85 45 100 50Z" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chinar)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20">
          <div className="md:col-span-1 relative">
            <h3 className="font-accent text-3xl font-bold tracking-[0.2em] text-accent mb-2">HUNARMAND</h3>
            <p className="font-heading italic text-xl text-cream-dark mb-6">
              Makers of Heritage.
            </p>
            <div className="absolute -top-16 -left-4 text-[8rem] font-sans text-accent opacity-10 pointer-events-none select-none">
              حنرمند
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-accent tracking-widest text-sm mb-6 text-accent">THE CRAFTS</h4>
            <ul className="space-y-4 text-sm font-sans tracking-wide text-text-muted">
              <li><Link href="/browse?category=Pashmina" className="hover:text-accent transition-colors">Pashmina</Link></li>
              <li><Link href="/browse?category=Walnut Wood Carving" className="hover:text-accent transition-colors">Walnut Wood</Link></li>
              <li><Link href="/browse?category=Sozni Embroidery" className="hover:text-accent transition-colors">Sozni Embroidery</Link></li>
              <li><Link href="/browse" className="hover:text-accent transition-colors">All Collections</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-accent tracking-widest text-sm mb-6 text-accent">THE MAISON</h4>
            <ul className="space-y-4 text-sm font-sans tracking-wide text-text-muted">
              <li><Link href="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
              <li><Link href="/how-it-works" className="hover:text-accent transition-colors">Provenance</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">Client Services</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="font-accent tracking-widest text-sm mb-6 text-accent">FOR ARTISANS</h4>
            <ul className="space-y-4 text-sm font-sans tracking-wide text-text-muted">
              <li><Link href="/join-as-artisan" className="hover:text-accent transition-colors">Join the Guild</Link></li>
              <li><Link href="/login" className="hover:text-accent transition-colors">Artisan Portal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20">
          <div className="w-full h-[1px] bg-border-gold opacity-30" />
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs font-sans tracking-widest text-text-muted">
            <p>&copy; {new Date().getFullYear()} HUNARMAND. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-cream transition-colors">PRIVACY POLICY</Link>
              <Link href="/terms" className="hover:text-cream transition-colors">TERMS OF SERVICE</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

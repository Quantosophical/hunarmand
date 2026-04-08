'use client';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function CertClient({ order, product, artisan, provenanceHash }: { order: any, product: any, artisan: any, provenanceHash?: string }) {
  const handlePrint = () => {
    window.print();
  };

  const hash = provenanceHash || Buffer.from(order.id).toString('hex');

  return (
    <div className="bg-deep-black min-h-screen text-cream flex flex-col items-center py-20 px-6">
      {/* Download Button outside the cert */}
      <div className="max-w-3xl w-full flex justify-end mb-8 print:hidden">
        <button 
          onClick={handlePrint}
          className="border border-border-gold/50 rounded-sm px-6 py-2.5 font-sans text-xs tracking-widget text-accent uppercase hover:bg-gradient-gold hover:text-primary transition-all flex items-center gap-2 shadow-lg"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download Cryptographic Provenance
        </button>
      </div>

      <div className="max-w-3xl w-full bg-surface-dark border-[1px] border-border-gold/30 rounded-lg p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] print:shadow-none print:[@page:margin:0]">
        
        <div className="relative z-10 text-center">
          <div className="mb-14">
            <h1 className="font-heading text-xl text-accent mb-2">Hunarmand Certified</h1>
            <p className="font-sans text-text-muted tracking-widest text-xs uppercase">Cryptographic Provenance Record</p>
          </div>

          <div className="space-y-6 mb-20">
            <p className="font-sans text-xs tracking-widest text-text-muted uppercase">This document certifies the authenticity of</p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-cream px-8 border-y border-border-gold/20 py-8 mx-auto inline-block">
              {product.title}
            </h2>
            <p className="font-sans text-xs tracking-widest text-text-muted uppercase pt-4">an original, handcrafted creation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left border-t border-b border-border-gold/20 py-10 mb-16">
            
            <div className="px-2">
              <p className="font-sans text-[0.6rem] uppercase tracking-widest text-text-muted mb-2">Master Artisan</p>
              <p className="font-heading text-xl text-cream mb-1">{artisan.user.name}</p>
              <p className="font-sans text-xs text-accent italic">{artisan.village}</p>
            </div>
            
            <div className="px-2">
              <p className="font-sans text-[0.6rem] uppercase tracking-widest text-text-muted mb-2">Craft Category</p>
              <p className="font-heading text-xl text-cream mb-1">{product.craftCategory}</p>
              {product.isGITagged && <p className="font-sans text-xs text-accent italic">GI Tagged</p>}
            </div>

            <div className="px-2">
              <p className="font-sans text-[0.6rem] uppercase tracking-widest text-text-muted mb-2">Date Sealed</p>
              <p className="font-heading text-xl text-cream mb-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="px-2">
              <p className="font-sans text-[0.6rem] uppercase tracking-widest text-text-muted mb-2">Provenance Hash</p>
              <div className="bg-deep-black/50 rounded-md p-2 w-full truncate border border-border-gold/10">
                <p className="font-mono text-xs text-text-muted/80 break-all" title={`0x${hash}`}>
                  0x{hash.slice(0, 16)}...
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 px-8 py-8 bg-surface-mid/30 rounded-xl">
            <div className="text-center w-full max-w-xs">
              <p className="font-signature text-3xl text-accent opacity-80 mb-2">{artisan.user.name}</p>
              <p className="font-sans text-[0.6rem] uppercase tracking-widest text-text-muted border-t border-border-gold/20 pt-2 mx-8">Artisan Signature</p>
            </div>

            <div className="shrink-0 p-4 bg-cream rounded-xl shadow-xl">
              <QRCodeSVG value={`https://hunarmand.app/verify/${order.id}`} size={90} fgColor="#0A0A0A" bgColor="transparent" />
            </div>

            <div className="text-center w-full max-w-xs">
               <div className="font-heading text-xl text-red-900/80 mb-2 mt-4 tracking-widest">SEALED</div>
               <p className="font-sans text-[0.6rem] uppercase tracking-widest text-text-muted border-t border-border-gold/20 pt-2 mx-8">Hunarmand Guild</p>
            </div>
          </div>
          
          <div className="mt-16 text-center max-w-lg mx-auto">
             <p className="font-sans text-xs text-text-muted leading-relaxed">This artifact is mathematically secured on the Hunarmand network to guarantee its authenticity. Treat this certificate as proof of acquisition.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 print:hidden -translate-y-4">
        <Link href="/browse" className="font-sans text-xs tracking-widest text-accent border-b border-accent/30 pb-1 hover:text-cream hover:border-cream transition-colors">
          RETURN TO GALLERY
        </Link>
      </div>
    </div>
  );
}

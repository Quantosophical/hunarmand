"use client";

import { Video, ShieldCheck, Zap } from "lucide-react";

export default function LoomCamTimeline({ product }: { product: any }) {
  const loomVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Placeholder for an actual time-lapse video

  return (
    <div className="mt-16 pt-16 border-t border-border-gold/20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Immutable Proof of Work</span>
          </div>
          <h2 className="font-heading italic text-3xl md:text-4xl text-cream">The Loom-Cam Time-Lapse</h2>
          <p className="font-sans text-text-muted mt-2 max-w-lg">Watch the exact moment your heirloom was brought to life. Our Loom-Cam technology captures the artisanal journey from raw thread to finalized masterpiece.</p>
        </div>
        
        {/* NFC Hint */}
        <div className="bg-surface-dark border border-border-gold/30 p-4 rounded-md max-w-sm flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-accent shrink-0" />
          <div>
            <h4 className="font-heading text-sm text-cream mb-1">NFC Tap-to-Story</h4>
            <p className="font-sans text-[0.65rem] text-text-muted leading-tight">Your physical package contains an embedded NFC chip. Tap it with your smartphone upon delivery to unlock this Soulbound Certificate indefinitely.</p>
          </div>
        </div>
      </div>

      {/* Video Player Segment */}
      <div className="relative w-full aspect-video bg-deep-black rounded-lg overflow-hidden border border-border-gold shadow-[0_20px_50px_rgba(201,168,76,0.1)] group">
        <video 
          src={loomVideoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
        />
        
        {/* Overlay Data Overlay */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-border-gold/30 flex items-center gap-2 w-max">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             <span className="font-mono text-[0.6rem] text-cream uppercase tracking-widest">Live Capture • Srinagar</span>
           </div>
           
           <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-border-gold/30 flex items-center gap-2 w-max">
             <Video className="w-3 h-3 text-accent" />
             <span className="font-mono text-[0.6rem] text-cream uppercase tracking-widest">Loom Hash: 0x8F92...B31A</span>
           </div>
        </div>
      </div>

    </div>
  );
}

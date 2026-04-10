"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";

interface CostBreakdownProps {
  price: number;
}

export default function CostBreakdownWidget({ price }: CostBreakdownProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay animation for a smooth effect after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Standard Direct-to-Artisan Protocol ratios
  const artisanShare = price * 0.85; // 85% goes to Artisan
  const materialShare = price * 0.10; // 10% Raw Material / Bank
  const platformShare = price * 0.05; // 5% Platform Fees

  return (
    <div className="bg-gradient-to-b from-[#1A1612] to-[#0A0A0A] border border-border-gold/20 rounded-[var(--radius-card)] p-6 my-8 shadow-[0_10px_30px_rgba(201,168,76,0.05)] text-cream font-sans">
      
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-heading text-xl text-cream-dark tracking-wide mb-1">Direct-to-Artisan Economics</h3>
          <p className="text-xs text-text-muted">Biometrically triggered payouts via smart contract.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 px-2.5 py-1 rounded-sm text-accent">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-accent text-[0.55rem] tracking-widest uppercase">Aadhaar Linked</span>
        </div>
      </div>

      {/* Progress Bar container */}
      <div className="w-full h-3 bg-surface-dark rounded-full overflow-hidden flex mb-6 border border-border-gold/10">
        <div 
          className="h-full bg-gradient-gold shadow-[0_0_10px_rgba(201,168,76,0.5)] transition-all duration-1000 ease-out"
          style={{ width: isLoaded ? "85%" : "0%" }}
        />
        <div 
          className="h-full bg-surface-warm transition-all duration-1000 delay-300 ease-out border-l border-r border-[#1A1612]"
          style={{ width: isLoaded ? "10%" : "0%" }}
        />
        <div 
          className="h-full bg-border-subtle transition-all duration-1000 delay-500 ease-out"
          style={{ width: isLoaded ? "5%" : "0%" }}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
            <span className="text-xs text-text-muted">Maker Share (85%)</span>
          </div>
          <span className="font-heading tracking-wide text-lg text-cream">₹{artisanShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-surface-warm" />
            <span className="text-xs text-text-muted">Material (10%)</span>
          </div>
          <span className="font-heading tracking-wide text-lg text-cream">₹{materialShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-border-subtle" />
            <span className="text-xs text-text-muted">Platform (5%)</span>
          </div>
          <span className="font-heading tracking-wide text-lg text-cream">₹{platformShare.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
      
    </div>
  );
}

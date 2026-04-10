"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { BadgeCheck, Play, Award } from "lucide-react";

interface ArtisanData {
  id: string;
  user: { name: string | null };
  village: string;
  profilePhoto?: string | null;
  signatureVideoUrl?: string | null;
  behchanId?: string | null;
  pehchanId?: string | null;
  isPehchanVerified?: boolean;
  yearsExperience?: number;
  awards?: string[];
}

export function PehchanBadge({ artisan }: { artisan: ArtisanData }) {
  if (!artisan.isPehchanVerified) return null;

  return (
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-br from-[#C9A84C]/5 to-transparent border border-border-gold/30 rounded-md">
      <div className="flex items-center gap-2">
        <BadgeCheck className="w-5 h-5 text-accent" />
        <span className="font-heading italic text-cream tracking-wide">Government of India Verified Master</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block font-accent text-[0.6rem] tracking-widest text-text-muted uppercase mb-1">Pehchan ID</span>
          <span className="font-sans text-sm text-cream font-mono">{artisan.pehchanId}</span>
        </div>
        <div>
          <span className="block font-accent text-[0.6rem] tracking-widest text-text-muted uppercase mb-1">Experience</span>
          <span className="font-sans text-sm text-cream">{artisan.yearsExperience} Years</span>
        </div>
      </div>

      {artisan.awards && artisan.awards.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border-gold/10">
          <span className="block font-accent text-[0.6rem] tracking-widest text-text-muted uppercase mb-1">Honors</span>
          <div className="flex flex-col gap-1">
            {artisan.awards.map((award, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Award className="w-3 h-3 text-accent" />
                <span className="font-sans text-xs text-cream">{award}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArtisanProfileBlock({ artisan }: { artisan: ArtisanData }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const photo = artisan.profilePhoto || 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=400&q=80';
  const sigVideo = artisan.signatureVideoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'; // Placeholder or actual string

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile + Video Block */}
        <div 
          className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border-2 border-border-gold p-1 group cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Base Photo */}
          <img 
            src={photo} 
            alt={artisan.user.name || "Artisan"} 
            className={`absolute inset-0 w-full h-full object-cover rounded-full grayscale transition-all duration-700 ${isPlaying ? 'opacity-0 scale-110' : 'opacity-100 group-hover:grayscale-0'}`} 
          />
          
          {/* Signature Video on Hover */}
          {artisan.signatureVideoUrl && (
             <video 
               ref={videoRef}
               src={artisan.signatureVideoUrl}
               muted
               loop
               playsInline
               className={`absolute inset-0 w-full h-full object-cover rounded-full transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
             />
          )}

          {/* Indicator */}
          {!isPlaying && artisan.signatureVideoUrl && (
             <div className="absolute bottom-2 right-2 bg-deep-black/80 rounded-full p-1.5 border border-border-gold/50 backdrop-blur-sm z-10">
               <Play className="w-3 h-3 text-accent fill-accent" />
             </div>
          )}
        </div>

        {/* Bio text */}
        <div className="flex-1 w-full">
          <h4 className="font-heading text-3xl text-cream mb-2">{artisan.user.name}</h4>
          <p className="font-sans tracking-wide text-text-muted mb-4 uppercase text-xs">Based in {artisan.village}</p>
          
          <PehchanBadge artisan={artisan} />

          <div className="mt-6 flex justify-start">
             <Link href={`/artisan/${artisan.id}`} className="font-accent text-[0.65rem] tracking-widest text-accent uppercase border-b border-accent pb-1 hover:text-cream transition-colors">
               Discover the Full Atelier
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

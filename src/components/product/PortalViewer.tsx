"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { X, Maximize } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function PanoramaSphere() {
  // Mock 360 degree workshop view using an equirectangular image
  const texture = useTexture("https://images.unsplash.com/photo-1544365558-35aa4afcf11f?q=80&w=2000&auto=format&fit=crop");
  
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function PortalViewer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 mb-4">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full relative overflow-hidden group px-6 py-4 bg-gradient-to-r from-[#1A1612] to-[#2A2218] border border-border-gold shadow-[0_5px_20px_rgba(201,168,76,0.15)] flex items-center justify-between"
      >
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full border border-accent flex items-center justify-center animate-pulse">
            <Maximize className="w-4 h-4 text-accent" />
          </div>
          <span className="font-heading italic text-xl text-cream tracking-wide">Portal to Kashmir</span>
        </div>
        <span className="font-accent tracking-[0.2em] text-[0.6rem] uppercase text-accent group-hover:text-cream transition-colors relative z-10">
          Step Inside &rarr;
        </span>
        
        {/* Glow Hover */}
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>

      {/* Immersive Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-deep-black flex flex-col animate-in fade-in duration-500">
          
          {/* Header */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div>
              <p className="font-accent tracking-[0.2em] text-[0.65rem] text-accent uppercase mb-1">Live from Srinagar</p>
              <h2 className="font-heading italic text-2xl text-cream">The Master's Atelier</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-3 bg-black/50 border border-border-gold/30 rounded-full hover:bg-black/80 hover:border-accent transition-all backdrop-blur-md"
            >
              <X className="w-6 h-6 text-cream" />
            </button>
          </div>

          {/* WebXR Canvas */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
              <Suspense fallback={
                <Html center>
                   <div className="flex flex-col items-center gap-4 bg-deep-black/80 p-6 rounded-xl backdrop-blur-md border border-border-gold/30">
                     <Spinner size="lg" className="text-accent" />
                     <span className="font-accent tracking-widest text-[0.7rem] uppercase text-cream">Loading Spatial Data</span>
                   </div>
                </Html>
              }>
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={false} 
                  enableDamping 
                  dampingFactor={0.05} 
                  autoRotate 
                  autoRotateSpeed={0.5} 
                />
                <PanoramaSphere />
              </Suspense>
            </Canvas>
          </div>

          {/* Footer Guide */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-3 border border-border-gold/20 rounded-full pointer-events-none text-center">
            <span className="font-sans text-sm tracking-wide text-cream">Drag to explore the room where this masterpiece was woven.</span>
          </div>

        </div>
      )}
    </div>
  );
}

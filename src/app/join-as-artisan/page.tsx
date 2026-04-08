"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "next-auth/react";

export default function JoinAsArtisanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    craftType: "Pashmina", village: "", district: "",
    yearsExperience: "0", craftLineage: "", bio: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           name: formData.name, email: formData.email, password: formData.password, role: "ARTISAN",
           artisanProfile: {
             craftType: formData.craftType,
             village: formData.village,
             district: formData.district,
             yearsExperience: formData.yearsExperience,
             craftLineage: formData.craftLineage,
             bio: formData.bio
           }
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit application");

      const signInRes = await signIn("credentials", { redirect: false, email: formData.email, password: formData.password });
      if (signInRes?.error) setError("Applied successfully but failed to auto-login.");
      else {
         router.push("/dashboard");
         router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen bg-deep-black relative z-10 w-full overflow-x-hidden">
      
      {/* Left fixed image for wide screens */}
      <div className="w-full lg:w-[40%] h-[30vh] lg:h-screen lg:sticky lg:top-0 relative overflow-hidden bg-primary shrink-0 hidden md:block">
        <img 
          src="https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=1200&q=80" 
          alt="Artisan Weaving" 
          className="object-cover w-full h-full grayscale-[50%] hover:scale-105 transition-transform duration-[20s]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-black pointer-events-none lg:block hidden" />
        <div className="absolute inset-x-0 bottom-0 p-12 lg:p-16 pointer-events-none">
          <p className="font-heading italic text-3xl lg:text-5xl text-cream-dark mb-4">Preserve the Legacy.</p>
          <p className="font-sans text-xs tracking-[0.2em] text-text-muted uppercase leading-relaxed max-w-sm">Join the guild to bring your authentic creations to patrons around the world.</p>
        </div>
      </div>

      {/* Right scrollable form */}
      <div className="w-full lg:w-[60%] flex flex-col px-6 md:px-12 lg:px-24 py-16 lg:py-24">
        <div className="max-w-2xl w-full mx-auto relative z-10">
          
          <div className="mb-16">
            <p className="font-accent text-[0.65rem] tracking-[0.3em] text-accent uppercase mb-4">Artisan Origin</p>
            <h1 className="font-heading text-4xl lg:text-5xl text-cream font-light mb-4">Guild Registration</h1>
            <p className="font-sans text-sm tracking-wide text-text-muted leading-relaxed">Present your credentials to the administration. Upon verification, your atelier will be opened to the public.</p>
          </div>
          
          {error && (
            <div className="mb-8 p-4 border border-error/50 bg-error/10 text-error font-sans text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            
            <div className="space-y-6 relative">
              <div className="absolute -left-12 top-2 h-full border-l border-border-gold/20 hidden md:block" />
              <h2 className="font-heading text-2xl text-cream-dark italic mb-8 flex items-center gap-4">
                 <span className="w-8 h-[1px] bg-accent inline-block md:hidden"/>
                 Identity
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                    className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                    className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/30"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Password</label>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                    minLength={6}
                    className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/30"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 relative pt-4">
              <div className="absolute -left-12 top-4 h-full border-l border-border-gold/20 hidden md:block" />
              <h2 className="font-heading text-2xl text-cream-dark italic mb-8 flex items-center gap-4">
                 <span className="w-8 h-[1px] bg-accent inline-block md:hidden"/>
                 Craft & Lineage
              </h2>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                   <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Primary Expertise</label>
                   <select 
                     className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none appearance-none"
                     value={formData.craftType} onChange={e => setFormData({...formData, craftType: e.target.value})}
                   >
                      <option value="Pashmina">Pashmina</option>
                      <option value="Walnut Wood Carving">Walnut Wood Carving</option>
                      <option value="Sozni Embroidery">Sozni Embroidery</option>
                      <option value="Papier-Mâché">Papier-Mâché</option>
                      <option value="Namdha">Namdha</option>
                      <option value="Copperware">Copperware</option>
                      <option value="Kashmiri Carpet">Kashmiri Carpet</option>
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Village / Locality</label>
                      <input type="text" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} required 
                        className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">District</label>
                      <input type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} required 
                        className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Years of Experience</label>
                      <input type="number" min="0" value={formData.yearsExperience} onChange={e => setFormData({...formData, yearsExperience: e.target.value})} required 
                        className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Lineage (e.g. 3rd Generation)</label>
                      <input type="text" value={formData.craftLineage} onChange={e => setFormData({...formData, craftLineage: e.target.value})} 
                        placeholder="Optional"
                        className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/30"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase">Short Biography</label>
                   <textarea 
                     className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none resize-none min-h-[100px] placeholder:text-text-muted/30"
                     maxLength={500}
                     placeholder="Tell the patrons your story..."
                     value={formData.bio}
                     onChange={e => setFormData({...formData, bio: e.target.value})}
                     required
                   />
                </div>
              </div>
            </div>

            <div className="pt-8 bg-surface-dark p-6 border border-border-gold/30">
               <p className="font-sans text-xs tracking-wide text-text-muted mb-6 leading-relaxed">
                 <span className="text-accent uppercase mr-2 tracking-widest text-[0.6rem]">Note:</span>
                 Upon registration, the guild administration will require KYC details and proof of workmanship to authenticate your atelier.
               </p>
               <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-gold text-primary font-accent tracking-widest text-sm py-4 hover:brightness-110 transition-all font-bold flex justify-center items-center"
                >
                  {loading ? <Spinner size="sm" /> : "SUBMIT APPLICATION"}
                </button>
            </div>
            
          </form>

          <p className="text-center font-sans text-sm text-text-muted mt-12">
            Already registered? <Link href="/login" className="text-accent hover:text-cream transition-colors border-b border-accent pb-[1px]">Access your Atelier</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

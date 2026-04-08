"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ name, email, password, role: "BUYER" }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
         setError("Failed to auto-login. Please login manually.");
      } else {
         window.location.href = "/account";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-screen bg-deep-black overflow-hidden relative z-10">
      
      {/* Left 50% - Image */}
      <div className="w-full md:w-[50%] h-[30vh] md:h-full relative overflow-hidden bg-primary shrink-0 hidden md:block">
        <img 
          src="https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=1200&q=80" 
          alt="Artisan Crafting" 
          className="object-cover w-full h-full grayscale-[50%] hover:scale-105 transition-transform duration-[20s]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-deep-black/30 to-deep-black/90 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-12 pointer-events-none">
          <p className="font-heading italic text-3xl text-cream-dark mb-2">Become a Patron.</p>
          <p className="font-sans text-xs tracking-widest text-text-muted uppercase">Support centuries of heritage</p>
        </div>
      </div>

      {/* Right 50% - Form */}
      <div className="w-full md:w-[50%] h-full relative flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-0 overflow-y-auto">
        <div className="max-w-md w-full mx-auto relative z-10">
          
          <div className="mb-12">
            <h1 className="font-heading text-4xl text-cream font-light mb-3">Create Account</h1>
            <p className="font-sans text-sm tracking-wide text-text-muted">Join the guild to acquire authentic masterpieces.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 border border-error/50 bg-error/10 text-error font-sans text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block font-accent text-[0.65rem] tracking-[0.2em] text-accent uppercase">Full Name</label>
              <input 
                id="name" 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/50"
                placeholder="Name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block font-accent text-[0.65rem] tracking-[0.2em] text-accent uppercase">Email Address</label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/50"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block font-accent text-[0.65rem] tracking-[0.2em] text-accent uppercase">Password</label>
              <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={6}
                className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/50"
                placeholder="••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-gold text-primary font-accent tracking-widest text-sm py-4 mt-8 hover:brightness-110 transition-all font-bold flex justify-center items-center"
            >
              {loading ? <Spinner size="sm" /> : "SIGN UP"}
            </button>
          </form>

          <p className="text-center font-sans text-sm text-text-muted mt-10">
            Already have an account? <Link href="/login" className="text-accent hover:text-cream transition-colors border-b border-accent pb-[1px]">Sign in</Link>
          </p>
          
          <div className="mt-12 pt-8 border-t border-border-gold/20 text-center">
             <Link href="/join-as-artisan" className="font-accent text-[0.65rem] tracking-[0.2em] uppercase text-text-muted hover:text-accent transition-colors">
               Are you an Artisan? Apply Here
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error("Failed to send request");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-deep-black min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,_#3D3020_0%,_#2A2218_55%,_#1A1612_100%)] z-0" />
      <div className="absolute inset-0 bg-chinar-pattern opacity-5 mix-blend-screen pointer-events-none z-0" />

      <div className="max-w-md w-full bg-surface-dark border border-border-gold shadow-[0_10px_40px_rgba(201,168,76,0.1)] p-10 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-heading text-3xl font-bold text-cream tracking-widest uppercase inline-block mb-4">
            Hunar<span className="text-accent">mand</span>
          </Link>
          <h2 className="font-heading text-2xl text-cream-dark italic">Retrieve Access</h2>
          <p className="font-sans text-xs tracking-widest uppercase text-text-muted mt-2">Enter your registry email</p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <p className="font-sans text-cream mb-4">If an account exists, a reset link has been dispatched to your email.</p>
            <Link href="/login" className="text-accent font-accent text-xs tracking-widest uppercase hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-error/10 border border-error/50 text-error text-sm font-sans tracking-wide">
                {error}
              </div>
            )}
            <div>
              <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-4 py-3 outline-none transition-colors"
                placeholder="master@hunarmand.com" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-gold text-primary font-accent tracking-[0.2em] text-[0.7rem] uppercase py-4 font-bold hover:brightness-110 transition-all flex justify-center items-center h-12"
            >
              {loading ? <Spinner size="sm" className="text-primary" /> : "Request Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

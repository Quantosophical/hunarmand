"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-6">
        <p className="font-sans text-error mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-accent font-accent text-xs tracking-widest uppercase hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <p className="font-sans text-cream mb-4">Your password has been successfully updated.</p>
        <p className="font-sans text-xs text-text-muted">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-error/10 border border-error/50 text-error text-sm font-sans tracking-wide">
          {error}
        </div>
      )}
      <div>
        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-2">New Password</label>
        <input 
          type="password" 
          required 
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-4 py-3 outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-2">Confirm New Password</label>
        <input 
          type="password" 
          required 
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-4 py-3 outline-none transition-colors"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gradient-gold text-primary font-accent tracking-[0.2em] text-[0.7rem] uppercase py-4 font-bold hover:brightness-110 transition-all flex justify-center items-center h-12"
      >
        {loading ? <Spinner size="sm" className="text-primary" /> : "Update Password"}
      </button>
    </form>
  );
}

export default function ResetPassword() {
  return (
    <div className="bg-deep-black min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,_#3D3020_0%,_#2A2218_55%,_#1A1612_100%)] z-0" />
      <div className="absolute inset-0 bg-chinar-pattern opacity-5 mix-blend-screen pointer-events-none z-0" />

      <div className="max-w-md w-full bg-surface-dark border border-border-gold shadow-[0_10px_40px_rgba(201,168,76,0.1)] p-10 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="font-heading text-3xl font-bold text-cream tracking-widest uppercase inline-block mb-4">
            Hunar<span className="text-accent">mand</span>
          </Link>
          <h2 className="font-heading text-2xl text-cream-dark italic">Secure Vault</h2>
          <p className="font-sans text-xs tracking-widest uppercase text-text-muted mt-2">Set your new credentials</p>
        </div>

        <Suspense fallback={<div className="flex justify-center"><Spinner size="md" className="text-accent"/></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

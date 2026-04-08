"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Please verify your details.");
      setLoading(false);
    } else {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        
        if (sessionData && sessionData.user && sessionData.user.role === 'ARTISAN') {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/account";
        }
      } catch (err) {
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-screen bg-deep-black overflow-hidden relative z-10">
      
      {/* Left 50% - Image */}
      <div className="w-full md:w-[50%] h-[30vh] md:h-full relative overflow-hidden bg-primary shrink-0 hidden md:block">
        <img 
          src="https://images.unsplash.com/photo-1626301625906-8d591b79f8dd?auto=format&fit=crop&w=1200&q=80" 
          alt="Kashmiri Chinar" 
          className="object-cover w-full h-full grayscale-[40%] hover:scale-105 transition-transform duration-[20s]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-black/90 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 p-12 pointer-events-none">
          <p className="font-heading italic text-3xl text-cream-dark mb-2">Heritage preserved.</p>
          <p className="font-sans text-xs tracking-widest text-text-muted uppercase">Enter the Guild of Artisans</p>
        </div>
      </div>

      {/* Right 50% - Form */}
      <div className="w-full md:w-[50%] h-full relative flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-0 overflow-y-auto">
        <div className="max-w-md w-full mx-auto relative z-10">
          
          <div className="mb-12">
            <h1 className="font-heading text-4xl text-cream font-light mb-3">Welcome Back</h1>
            <p className="font-sans text-sm tracking-wide text-text-muted">Enter your credentials to access your atelier.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 border border-error/50 bg-error/10 text-error font-sans text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block font-accent text-[0.65rem] tracking-[0.2em] text-accent uppercase">Password</label>
                <Link href="#" className="font-sans text-xs text-text-muted hover:text-cream transition-colors">Forgot?</Link>
              </div>
              <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full bg-surface-dark border-b border-border-gold/50 focus:border-accent text-cream font-sans px-0 py-3 transition-colors outline-none placeholder:text-text-muted/50"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-gold text-primary font-accent tracking-widest text-sm py-4 mt-8 hover:brightness-110 transition-all font-bold flex justify-center items-center"
            >
              {loading ? <Spinner size="sm" /> : "SIGN IN"}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-gold/30"></div></div>
            <div className="relative flex justify-center"><span className="px-4 bg-deep-black font-accent text-[0.6rem] tracking-[0.2em] text-text-muted uppercase">Or Continue With</span></div>
          </div>

          <button 
            type="button" 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full border border-border-gold/50 text-cream font-sans text-sm py-3.5 hover:bg-surface-mid transition-colors flex justify-center items-center gap-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Google
          </button>

          <p className="text-center font-sans text-sm text-text-muted mt-10">
            Don&apos;t have an account? <Link href="/register" className="text-accent hover:text-cream transition-colors border-b border-accent pb-[1px]">Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-deep-black h-screen"><Spinner size="lg" /></div>}>
      <LoginContent />
    </Suspense>
  )
}

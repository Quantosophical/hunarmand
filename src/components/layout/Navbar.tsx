'use client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/lib/store/useCart';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const { items, fetchCart } = useCart();
  
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (status === 'authenticated') {
       fetchCart();
    }
  }, [status, fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-out border-b ${
        scrolled 
          ? 'bg-[#0A0A0A]/95 backdrop-blur-[20px] border-accent/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]' 
          : 'bg-[#0A0A0A]/60 backdrop-blur-md border-transparent hover:bg-[#0A0A0A]/80 hover:border-accent/15 hover:backdrop-blur-[20px]'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="group flex flex-col items-center">
            <span className="font-accent text-2xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-gold group-hover:animate-gold-shimmer">
              HUNARMAND
            </span>
            <span className="font-sans text-[0.6rem] text-text-muted mt-0.5 tracking-widest">
              حنرمند
            </span>
          </Link>
          <nav className="hidden md:flex gap-8">
            {['Shop', 'Our Story', 'How it Works'].map((item) => (
              <Link key={item} href={item === 'Shop' ? '/browse' : `/${item.toLowerCase().replace(/ /g, '-')}`} className="group relative text-sm font-sans font-medium text-cream tracking-[0.1em] hover:text-accent transition-colors">
                {item}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-accent transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative text-cream hover:text-accent transition-colors" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-accent text-primary text-[10px] font-bold rounded-full">
              {cartItemsCount}
            </span>
          </Link>
          {status === 'loading' ? (
            <div className="hidden md:block w-16 h-4 bg-surface-mid animate-pulse rounded" />
          ) : session ? (
            <>
              <Link href={session.user.role === 'ARTISAN' ? '/dashboard' : '/account'} className="hidden md:block text-sm font-sans font-medium text-cream hover:text-accent transition-colors">
                {session.user.role === 'ARTISAN' ? 'My Atelier' : 'My Account'}
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="hidden md:inline-flex px-4 py-2 text-text-muted hover:text-error text-xs font-sans tracking-widest uppercase transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block text-sm font-sans font-medium text-cream hover:text-accent transition-colors">
                Log in
              </Link>
              <Link href="/join-as-artisan" className="hidden md:inline-flex px-6 py-2.5 border border-accent text-accent font-accent text-sm tracking-widest hover:bg-gradient-gold hover:text-primary transition-all duration-300">
                Become an Artisan
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

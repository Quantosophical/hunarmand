'use client';
import Link from 'next/link';
import { ShoppingBag, ChevronDown, LayoutDashboard, PlusCircle, IndianRupee, Settings, LogOut, ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/lib/store/useCart';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
            <span className="font-sans text-[0.6rem] text-transparent bg-clip-text bg-gradient-gold group-hover:animate-gold-shimmer mt-0.5 tracking-widest font-medium">
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
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link 
                href={session.user.role === 'ARTISAN' ? '/dashboard' : '/account'} 
                className="hidden md:flex items-center gap-2 text-sm font-sans font-medium text-cream hover:text-accent transition-colors py-2"
              >
                <span>{session.user.role === 'ARTISAN' ? 'My Atelier' : 'My Account'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-1 w-64 bg-[#0A0A0A]/95 backdrop-blur-xl border border-accent/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 rounded-sm"
                  >
                    <div className="p-4 border-b border-accent/10 bg-accent/5">
                      <p className="text-xs font-sans tracking-widest text-accent uppercase mb-1">Signed in as</p>
                      <p className="text-sm font-heading text-cream truncate">{session.user.name}</p>
                    </div>

                    <div className="py-2">
                      {(session.user.role === 'ARTISAN' ? [
                        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
                        { label: 'Add Masterpiece', icon: PlusCircle, href: '/dashboard' },
                        { label: 'My Collection', icon: ShoppingBasket, href: '/dashboard' },
                        { label: 'Earnings', icon: IndianRupee, href: '/dashboard' },
                      ] : [
                        { label: 'My Orders', icon: ShoppingBasket, href: '/account' },
                        { label: 'Wishlist', icon: ShoppingBag, href: '/account' },
                        { label: 'Account Settings', icon: Settings, href: '/account' },
                      ]).map((item) => (
                        <Link 
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-sans text-text-muted hover:text-accent hover:bg-accent/5 transition-all group"
                        >
                          <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="tracking-wide">{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-accent/10 pt-1 pb-1">
                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-text-muted hover:text-error hover:bg-error/5 transition-all group"
                      >
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span className="tracking-wide uppercase text-[10px] font-bold">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

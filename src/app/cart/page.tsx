"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      fetch("/api/cart").then(r => r.json()).then(data => {
        setCart(data);
        setLoading(false);
      });
    }
  }, [status, router, session]);

  const handleRemove = async (itemId: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId })
      });
      if (res.ok) {
        setCart((prev: any) => ({
          ...prev,
          items: prev.items.filter((item: any) => item.id !== itemId)
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center py-24 bg-deep-black min-h-screen"><Spinner size="lg" /></div>;

  const totalAmount = cart?.items?.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) || 0;

  return (
    <div className="bg-deep-black min-h-screen text-cream py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-14 text-center md:text-left">
          <p className="font-sans text-xs tracking-widest text-text-muted uppercase mb-3">Your Selection</p>
          <h1 className="text-4xl lg:text-5xl font-heading text-cream">Acquisition Cart</h1>
        </div>

        {cart?.items?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-6">
                  {cart.items.map((item: any) => {
                    const images = JSON.parse(item.product.images || "[]");
                    const mainImage = Array.isArray(images) && images.length > 0 ? images[0] : "";
                    
                    return (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-8 p-6 bg-surface-dark border border-border-gold/10 rounded-xl hover:shadow-xl transition-shadow">
                          <div className="w-full sm:w-32 aspect-[4/3] bg-surface-mid rounded-md shrink-0 overflow-hidden border border-border-gold/5">
                            {mainImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={mainImage} className="object-cover w-full h-full grayscale-[10%]" alt={item.product.title} />
                            ) : (
                                <div className="w-full h-full bg-deep-black" />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-heading text-2xl text-cream line-clamp-2 mb-2">{item.product.title}</h3>
                              <p className="font-sans text-xs text-text-muted mb-4 uppercase tracking-widest">Master {item.product.artisan.user.name}</p>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-4 mt-6 sm:mt-0">
                              <p className="font-heading text-2xl text-accent">₹{item.product.price.toLocaleString('en-IN')}</p>
                              <div className="flex items-center gap-4">
                                <div className="text-[0.65rem] font-sans tracking-widest uppercase text-text-muted border border-border-gold/20 rounded-md px-3 py-1.5">Qty: {item.quantity}</div>
                                <button onClick={() => handleRemove(item.id)} className="text-[0.65rem] font-sans tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors">Remove</button>
                              </div>
                            </div>
                          </div>
                      </div>
                    )
                  })}
              </div>
              <div className="bg-surface-dark rounded-xl border border-border-gold/10 p-10 h-fit shadow-[0_20px_50px_rgba(0,0,0,0.5)] sticky top-32">
                  <h3 className="font-heading text-xl mb-8 text-cream border-b border-border-gold/10 pb-4">Order Summary</h3>
                  <div className="flex justify-between mb-4 font-sans text-sm tracking-wide">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="text-cream">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between mb-8 pb-8 border-b border-border-gold/10 font-sans text-sm tracking-wide">
                    <span className="text-text-muted">Provenance & Shipping</span>
                    <span className="text-accent">Calculated securely</span>
                  </div>
                  <div className="flex justify-between mb-10 text-2xl font-heading text-cream">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <Link href="/checkout" className="w-full block text-center bg-gradient-gold text-primary rounded-md font-sans tracking-widest text-[0.65rem] uppercase py-4 font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all">
                    Proceed to Checkout
                  </Link>
              </div>
            </div>
        ) : (
            <div className="text-center py-32 rounded-xl border border-dashed border-border-gold/20 bg-surface-dark/50">
              <p className="font-heading text-3xl text-cream mb-4">Your collection is empty</p>
              <p className="font-sans text-sm tracking-wide text-text-muted mb-10 max-w-md mx-auto leading-relaxed">Explore our gallery of authentic Kashmiri crafts manually woven and carved by legacy artisans.</p>
              <Link href="/browse" className="border-b border-accent/40 text-accent font-sans text-xs tracking-widest uppercase hover:text-cream hover:border-cream transition-colors pb-1">
                  Explore the Gallery
              </Link>
            </div>
        )}
      </div>
    </div>
  )
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "", street: "", city: "", state: "", pincode: "", phone: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate saving address and order creation in DB
    try {
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const { orderId, razorpayOrderId, amount, currency, keyId } = await orderRes.json();

      // Trigger Real Razorpay logic
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const res = await loadScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Hunarmand",
        description: "Artifact Transaction",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId
              })
            });
            
            if (verifyRes.ok) {
              router.push(`/verify/${orderId}`);
            } else {
              alert("Payment verification failed.");
            }
          } catch (e) {
            console.error(e);
            alert("Verification error.");
          }
        },
        prefill: {
          name: address.name,
          email: session?.user?.email,
          contact: address.phone
        },
        theme: {
          color: "#C9A84C"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
      setLoading(false);
    }
  };

  if (status !== "authenticated") return null;

  return (
    <div className="bg-deep-black min-h-screen text-cream py-16">
      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <h1 className="text-4xl lg:text-5xl font-heading mb-10 text-cream text-center">Secure Acquisition</h1>
        
        <div className="bg-surface-dark border border-border-gold/20 rounded-xl p-8 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-xl font-heading mb-8 text-cream border-b border-border-gold/20 pb-4">Destination Address</h2>
          
          <form onSubmit={handleCheckout} className="space-y-6">
             <div className="space-y-2">
                <label className="block font-sans text-[0.6rem] tracking-widest text-text-muted uppercase">Full Name</label>
                <input required value={address.name} onChange={e => setAddress({...address, name: e.target.value})} className="w-full bg-surface-mid/30 border border-border-gold/10 rounded-md focus:border-accent text-cream font-sans px-4 py-3 transition-colors outline-none placeholder:text-text-muted/30 hover:border-border-gold/30" />
             </div>
             
             <div className="space-y-2">
                <label className="block font-sans text-[0.6rem] tracking-widest text-text-muted uppercase">Street Address</label>
                <input required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} className="w-full bg-surface-mid/30 border border-border-gold/10 rounded-md focus:border-accent text-cream font-sans px-4 py-3 transition-colors outline-none placeholder:text-text-muted/30 hover:border-border-gold/30" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="block font-sans text-[0.6rem] tracking-widest text-text-muted uppercase">City</label>
                  <input required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-surface-mid/30 border border-border-gold/10 rounded-md focus:border-accent text-cream font-sans px-4 py-3 transition-colors outline-none placeholder:text-text-muted/30 hover:border-border-gold/30" />
               </div>
               <div className="space-y-2">
                  <label className="block font-sans text-[0.6rem] tracking-widest text-text-muted uppercase">State / Province</label>
                  <input required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full bg-surface-mid/30 border border-border-gold/10 rounded-md focus:border-accent text-cream font-sans px-4 py-3 transition-colors outline-none placeholder:text-text-muted/30 hover:border-border-gold/30" />
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="block font-sans text-[0.6rem] tracking-widest text-text-muted uppercase">Postal Code</label>
                  <input required value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full bg-surface-mid/30 border border-border-gold/10 rounded-md focus:border-accent text-cream font-sans px-4 py-3 transition-colors outline-none placeholder:text-text-muted/30 hover:border-border-gold/30" />
               </div>
               <div className="space-y-2">
                  <label className="block font-sans text-[0.6rem] tracking-widest text-text-muted uppercase">Phone Number</label>
                  <input required type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full bg-surface-mid/30 border border-border-gold/10 rounded-md focus:border-accent text-cream font-sans px-4 py-3 transition-colors outline-none placeholder:text-text-muted/30 hover:border-border-gold/30" />
               </div>
             </div>

             <div className="pt-8 mt-12 bg-deep-black/50 p-6 rounded-xl border border-border-gold/10">
                <button type="submit" className="w-full bg-gradient-gold text-primary rounded-md font-sans tracking-widest text-sm uppercase py-4 font-bold hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 transition-all flex justify-center items-center" disabled={loading}>
                   {loading ? <Spinner size="md" className="text-primary" /> : "PAY SECURELY VIA RAZORPAY"}
                </button>
                <p className="text-center font-sans text-xs tracking-wide text-text-muted mt-6">
                  Payments are securely processed directly by Razorpay. We do not store your credentials.
                </p>
             </div>
          </form>
        </div>
      </div>
    </div>
  )
}

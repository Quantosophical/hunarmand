"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function ClientFulfillOrderButton({ orderItemId }: { orderItemId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/fulfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderItemId, trackingNumber })
      });

      if (!res.ok) throw new Error("Failed to fulfill");
      
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error marking as shipped.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-transparent border border-accent text-accent font-accent text-[0.65rem] tracking-[0.2em] uppercase px-4 py-2 hover:bg-accent hover:text-deep-black transition-all"
      >
        Fulfill
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-2 w-full">
            <h2 className="text-2xl font-heading font-light italic text-cream mb-6 border-b border-border-gold/30 pb-4">Fulfill Order</h2>
            <p className="font-sans text-sm text-text-muted mb-6">Enter the tracking number provided by the courier to notify the buyer that their masterpiece is on its way.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-accent text-[0.6rem] tracking-[0.2em] text-accent uppercase mb-1">Tracking Number / Courier Note</label>
                    <input 
                      required 
                      value={trackingNumber} 
                      onChange={e => setTrackingNumber(e.target.value)} 
                      placeholder="e.g. DTDC-88123049"
                      className="w-full bg-deep-black border border-border-gold/30 focus:border-accent text-cream font-sans px-3 py-2 outline-none" 
                    />
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-gradient-gold text-primary font-accent tracking-widest text-sm uppercase py-4 mt-6 font-bold hover:brightness-110 transition-all flex justify-center items-center">
                    {loading ? <Spinner size="sm" className="text-primary"/> : "Mark as Shipped"}
                </button>
            </form>
        </div>
      </Modal>
    </>
  );
}

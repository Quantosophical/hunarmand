"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function ClientRequestPayoutButton({ availableBalance, hasPending }: { availableBalance: number, hasPending: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayout = async () => {
    if (availableBalance <= 0) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/payout", {
        method: "POST"
      });

      if (!res.ok) {
        throw new Error("Failed to request payout");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error requesting payout.");
    } finally {
      setLoading(false);
    }
  };

  if (hasPending) {
    return (
      <button disabled className="w-full bg-surface-mid text-text-muted font-accent text-xs tracking-[0.2em] uppercase px-4 py-3 font-bold cursor-not-allowed">
        Payout Request Pending
      </button>
    );
  }

  return (
    <button 
      onClick={handlePayout}
      disabled={availableBalance <= 0 || loading}
      className={`w-full font-accent text-xs tracking-[0.2em] uppercase px-4 py-3 font-bold transition-all flex items-center justify-center gap-2 ${
        availableBalance > 0 
          ? "bg-transparent border border-accent text-accent hover:bg-accent hover:text-primary" 
          : "bg-surface-mid text-text-muted opacity-50 cursor-not-allowed"
      }`}
    >
      {loading ? <Spinner size="sm" /> : "Request Payout"}
    </button>
  );
}

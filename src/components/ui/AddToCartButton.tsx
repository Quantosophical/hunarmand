"use client";

import { useState } from "react";
import { Button } from "./button";
import { Spinner } from "./spinner";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  buyNow?: boolean;
  className?: string;
}

export function AddToCartButton({ productId, buyNow = false, className }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      
      if (res.status === 401) {
        alert("Please login to add items to your cart");
        router.push("/login");
        return;
      }
      
      if (!res.ok) throw new Error("Failed to add");
      
      if (buyNow) {
        router.push("/cart");
      } else {
        alert("Added to cart!");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAction} 
      className={`flex items-center justify-center ${className || "w-full py-4 bg-primary text-foreground"}`}
      disabled={loading}
    >
      {loading ? <Spinner size="sm" /> : (buyNow ? "Buy Now" : "Add to Cart")}
    </button>
  );
}

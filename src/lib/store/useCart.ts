import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = {
  id: string; // The cart item ID
  productId: string;
  quantity: number;
  product: any;
};

type CartState = {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/cart');
          if (res.ok) {
            const data = await res.json();
            set({ items: data.items || [] });
          } else {
             // If 401 unauthorized, just empty it.
            set({ items: [] });
          }
        } catch (error) {
          console.error("Failed to fetch cart", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId: string, quantity = 1) => {
        try {
          const res = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
          });
          if (res.ok) {
            await get().fetchCart();
            return true;
          }
        } catch (error) {
          console.error("Failed to add to cart", error);
        }
        return false;
      },

      removeFromCart: async (itemId: string) => {
        try {
          const res = await fetch('/api/cart', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId })
          });
          if (res.ok) {
            await get().fetchCart();
            return true;
          }
        } catch (error) {
          console.error("Failed to remove from cart", error);
        }
        return false;
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        try {
          const res = await fetch('/api/cart', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId, quantity })
          });
          if (res.ok) {
            await get().fetchCart();
            return true;
          }
        } catch (error) {
          console.error("Failed to update cart quantity", error);
        }
        return false;
      }
    }),
    {
      name: 'hunarmand-cart-storage',
      partialize: (state) => ({ items: state.items }), // Persist only items
    }
  )
);

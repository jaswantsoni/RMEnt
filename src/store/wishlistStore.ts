import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/api';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (state.items.find((item) => item.id === product.id)) {
            return state;
          }
          return { items: [...state.items, product] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      toggleItem: (product) => {
        const { items, addItem, removeItem } = get();
        if (items.find((item) => item.id === product.id)) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      },
      isInWishlist: (productId) => get().items.some((item) => item.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

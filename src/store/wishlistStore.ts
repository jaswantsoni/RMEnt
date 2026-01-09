import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { customerApi } from '@/services/customerApi';
import type { Product } from '@/types/api';

interface WishlistState {
  items: Product[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  toggleItem: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchWishlist: async () => {
        set({ loading: true });
        try {
          const response = await customerApi.getWishlist();
          if (response.success) {
            set({ items: response.data.map((item: any) => item.product) });
          }
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (product) => {
        // Check if already in wishlist
        if (get().items.find(item => item.id === product.id)) {
          console.log('Product already in wishlist');
          return;
        }
        try {
          const response = await customerApi.addToWishlist(product.id);
          console.log('Add to wishlist response:', response);
          if (response.success) {
            set((state) => ({ items: [...state.items, product] }));
          }
        } catch (error) {
          console.error('Failed to add to wishlist:', error);
          throw error;
        }
      },

      removeItem: async (productId) => {
        try {
          const wishlistItem = get().items.find(item => item.id === productId);
          if (wishlistItem) {
            const response = await customerApi.removeFromWishlist(wishlistItem.id);
            if (response.success) {
              set((state) => ({ items: state.items.filter(item => item.id !== productId) }));
            }
          }
        } catch (error) {
          console.error('Failed to remove from wishlist:', error);
        }
      },

      toggleItem: async (product) => {
        const { items, addItem, removeItem } = get();
        if (items.find((item) => item.id === product.id)) {
          await removeItem(product.id);
        } else {
          await addItem(product);
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

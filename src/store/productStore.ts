import { create } from 'zustand';
import type { Product } from '@/types/api';

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  getProductBySlug: (slug: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  setProducts: (products) => set({ products }),
  getProductBySlug: (slug) => {
    const product = get().products.find(p => p.slug === slug);
    if (!product && get().products.length === 0) {
      // Try to load from localStorage if store is empty
      const stored = localStorage.getItem('azzaro_products');
      if (stored) {
        try {
          const products = JSON.parse(stored);
          if (Array.isArray(products)) {
            set({ products });
            return products.find(p => p.slug === slug);
          }
        } catch (e) {}
      }
    }
    return product;
  },
}));
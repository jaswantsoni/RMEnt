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
  getProductBySlug: (slug) => get().products.find(p => p.slug === slug),
}));
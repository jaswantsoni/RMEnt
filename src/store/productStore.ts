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
    const products = get().products;
    
    // First try to find by slug
    let product = products.find(p => p.slug === slug);
    
    // If not found, try to find by SKU in variants
    if (!product) {
      product = products.find(p => 
        p.variants?.some(v => v.sku === slug)
      );
    }
    
    // If not found, try to find by main product SKU
    if (!product) {
      product = products.find(p => p.sku === slug);
    }
    
    // If still not found and store is empty, try localStorage
    if (!product && products.length === 0) {
      const stored = localStorage.getItem('azzaro_products');
      if (stored) {
        try {
          const storedProducts = JSON.parse(stored);
          if (Array.isArray(storedProducts)) {
            set({ products: storedProducts });
            // Try slug first, then variant SKU, then product SKU
            return storedProducts.find(p => p.slug === slug) || 
                   storedProducts.find(p => p.variants?.some(v => v.sku === slug)) ||
                   storedProducts.find(p => p.sku === slug);
          }
        } catch (e) {}
      }
    }
    
    return product;
  },
}));
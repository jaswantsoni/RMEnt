import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UploadedProduct {
  id: string;
  productName: string;
  modelNumber: string;
  length: string;
  width: string;
  height: string;
  referenceCode: string;
  weight: string;
  imageUrl?: string;
  createdAt: string;
}

interface ProductStore {
  products: UploadedProduct[];
  addProducts: (products: Omit<UploadedProduct, 'id' | 'createdAt'>[]) => void;
  updateProduct: (id: string, updates: Partial<UploadedProduct>) => void;
  deleteProduct: (id: string) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      addProducts: (newProducts) =>
        set((state) => ({
          products: [
            ...state.products,
            ...newProducts.map((p) => ({
              ...p,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            })),
          ],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      clearProducts: () => set({ products: [] }),
    }),
    {
      name: 'product-storage',
    }
  )
);

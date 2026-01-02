// import { ShopifyProductAdapter } from './shopifyAdapter';
import { ZohoProductAdapter } from './zohoAdapter';
import type { Product } from '@/types/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export class ShopifyApiService {
  static async fetchProducts(limit: number = 50, page: number = 1, sortBy?: string, sortOrder?: string, category?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(category && { category })
      });
      
      const response = await fetch(`${BACKEND_URL}/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.products || [];
      
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }

  static async fetchProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const product = await response.json();
      return product || null;
      
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }

  static async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.products || [];
      
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  }
}
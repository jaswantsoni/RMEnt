import { ShopifyProductAdapter } from './shopifyAdapter';
import type { Product } from '@/types/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export class ShopifyApiService {
  static async fetchProducts(limit: number = 10, page: number = 1, sortBy?: string, sortOrder?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder })
      });
      
      const response = await fetch(`${BACKEND_URL}/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const shopifyData = await response.json();
      return ShopifyProductAdapter.transformProducts(shopifyData);
      
    } catch (error) {
      console.error('Failed to fetch Shopify products:', error);
      return [];
    }
  }

  static async fetchProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const shopifyData = await response.json();
      
      if (shopifyData.success && shopifyData.data) {
        return ShopifyProductAdapter.transformProduct(shopifyData.data);
      }
      
      return null;
      
    } catch (error) {
      console.error('Failed to fetch Shopify product:', error);
      return null;
    }
  }

  static async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products?limit=${limit}&search=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const shopifyData = await response.json();
      return ShopifyProductAdapter.transformProducts(shopifyData);
      
    } catch (error) {
      console.error('Failed to search Shopify products:', error);
      return [];
    }
  }
}
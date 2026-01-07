// import { ShopifyProductAdapter } from './shopifyAdapter';
import { ZohoProductAdapter } from './zohoAdapter';
import type { Product } from '@/types/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export class ShopifyApiService {
  static async fetchProducts(
    limit: number = 20, 
    page: number = 1, 
    sortBy?: string, 
    sortOrder?: string, 
    filters?: {
      category_id?: string;
      subcategory_id?: string;
      min_price?: number;
      max_price?: number;
      search?: string;
      brand?: string;
      in_stock?: boolean;
    }
  ): Promise<Product[]> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(sortBy && { sort_by: sortBy }),
        ...(sortOrder && { sort_order: sortOrder }),
        ...(filters?.category_id && { category_id: filters.category_id }),
        ...(filters?.subcategory_id && { subcategory_id: filters.subcategory_id }),
        ...(filters?.min_price && { min_price: filters.min_price.toString() }),
        ...(filters?.max_price && { max_price: filters.max_price.toString() }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.brand && { brand: filters.brand }),
        ...(filters?.in_stock !== undefined && { in_stock: filters.in_stock.toString() })
      });
      
      const response = await fetch(`${BACKEND_URL}/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const products = data.data || data.products || [];
      
      // Store categories if available
      if (data.categories) {
        localStorage.setItem('azzaro_categories', JSON.stringify(data.categories));
      }
      
      // Transform products to match our interface
      return products.map((apiProduct: any) => ({
        id: apiProduct.item_id,
        name: apiProduct.name,
        slug: apiProduct.item_id,
        description: apiProduct.enhanced_description || apiProduct.description || '',
        shortDescription: apiProduct.description || '',
        price: apiProduct.rate * 100,
        compareAtPrice: apiProduct.sales_rate !== apiProduct.rate ? apiProduct.sales_rate * 100 : undefined,
        currency: 'USD',
        images: apiProduct.image_url ? [{ id: '1', url: apiProduct.image_url, alt: apiProduct.name, position: 0 }] : [],
        category: {
          id: apiProduct.productCategory?.id || '1',
          name: apiProduct.productCategory?.name || apiProduct.category || 'Uncategorized',
          slug: apiProduct.productCategory?.slug || (apiProduct.productCategory?.name || apiProduct.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-'),
          description: apiProduct.productCategory?.description || '',
          image: apiProduct.productCategory?.image_url || '',
          productCount: 0
        },
        subcategory: apiProduct.productSubcategory ? {
          id: apiProduct.productSubcategory.id,
          name: apiProduct.productSubcategory.name,
          slug: apiProduct.productSubcategory.slug,
          description: apiProduct.productSubcategory.description
        } : undefined,
        categoryId: apiProduct.productCategory?.id || '1',
        variants: [],
        tags: apiProduct.zoho_data?.tags || [],
        specifications: apiProduct.specifications ? Object.entries(apiProduct.specifications).map(([name, value]) => ({ name, value: String(value) })) : [],
        inStock: apiProduct.available_stock > 0,
        stockQuantity: apiProduct.available_stock,
        rating: 5,
        reviewCount: 0,
        featured: false,
        createdAt: apiProduct.created_at,
        updatedAt: apiProduct.updated_at,
        sku: apiProduct.sku,
        rate: apiProduct.rate,
        item_id: apiProduct.item_id,
        image_url: apiProduct.image_url
      }));
      
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
import type { Product } from '@/types/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function transformProduct(p: any): Product {
  return {
    id: p.item_id || p.id,
    name: p.name,
    slug: p.item_id || p.id,
    description: p.enhanced_description || p.description || '',
    shortDescription: p.description || '',
    price: (p.rate || 0) * 100,
    compareAtPrice: p.sales_rate && p.sales_rate !== p.rate ? p.sales_rate * 100 : undefined,
    currency: 'INR',
    images: p.image_url
      ? [{ id: '1', url: p.image_url, alt: p.name, position: 0 }]
      : [],
    category: {
      id: p.productCategory?.id || '',
      name: p.productCategory?.name || p.category || 'Uncategorized',
      slug: p.productCategory?.slug || (p.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-'),
      description: p.productCategory?.description || '',
      image: p.productCategory?.image_url || '',
      productCount: 0,
    },
    subcategory: p.productSubcategory
      ? {
          id: p.productSubcategory.id,
          name: p.productSubcategory.name,
          slug: p.productSubcategory.slug,
          description: p.productSubcategory.description,
        }
      : undefined,
    categoryId: p.productCategory?.id || '',
    variants: p.variants || [],
    tags: [],
    specifications: p.specifications
      ? Object.entries(p.specifications).map(([name, value]) => ({ name, value: String(value) }))
      : [],
    inStock: (p.stock_on_hand || p.available_stock || 0) > 0,
    stockQuantity: p.stock_on_hand || p.available_stock || 0,
    rating: 5,
    reviewCount: 0,
    featured: false,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    sku: p.sku,
    rate: p.rate,
    item_id: p.item_id,
    image_url: p.image_url,
  };
}

export class ProductApiService {
  static async fetchProducts(
    limit = 20,
    page = 1,
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
        ...(filters?.in_stock !== undefined && { in_stock: filters.in_stock.toString() }),
      });

      const res = await fetch(`${BACKEND_URL}/api/products?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const products = data.data || data.products || [];

      if (data.categories) {
        localStorage.setItem('ekart24_categories', JSON.stringify(data.categories));
      }

      return products.map(transformProduct);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      return [];
    }
  }

  static async fetchProduct(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const p = await res.json();
      return transformProduct(p);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      return null;
    }
  }

  static async searchProducts(query: string, limit = 20): Promise<Product[]> {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.products || []).map(transformProduct);
    } catch (err) {
      console.error('Failed to search products:', err);
      return [];
    }
  }
}

// Keep backward-compat alias so existing imports don't break immediately
export { ProductApiService as ShopifyApiService };

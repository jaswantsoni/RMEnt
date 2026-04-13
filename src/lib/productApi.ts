import type { Product } from '@/types/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Categories cache — populated from API response
let _categoriesCache: any[] = [];

function findCategoryFromCache(product: any) {
  if (!_categoriesCache.length) {
    try {
      const stored = localStorage.getItem('ekart24_categories');
      if (stored) _categoriesCache = JSON.parse(stored);
    } catch {}
  }

  // Try productCategory relation first (populated by backend join)
  if (product.productCategory) {
    return {
      id: product.productCategory.id,
      name: product.productCategory.name,
      slug: product.productCategory.slug,
      description: product.productCategory.description || '',
      image: product.productCategory.image_url || '',
      productCount: 0,
    };
  }

  // Fall back to category_id lookup in cache
  if (product.category_id) {
    const cat = _categoriesCache.find((c: any) => c.id === product.category_id);
    if (cat) return { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image_url || '', productCount: 0 };
  }

  // Fall back to category name string match
  if (product.category) {
    const cat = _categoriesCache.find((c: any) =>
      c.name?.toLowerCase() === product.category?.toLowerCase() ||
      c.slug?.toLowerCase() === product.category?.toLowerCase()
    );
    if (cat) return { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image_url || '', productCount: 0 };
  }

  return {
    id: '',
    name: product.category || 'Uncategorized',
    slug: (product.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-'),
    description: '',
    image: '',
    productCount: 0,
  };
}

function findSubcategoryFromCache(product: any) {
  if (product.productSubcategory) {
    return {
      id: product.productSubcategory.id,
      name: product.productSubcategory.name,
      slug: product.productSubcategory.slug,
      description: product.productSubcategory.description,
    };
  }
  if (product.subcategory_id && _categoriesCache.length) {
    for (const cat of _categoriesCache) {
      const sub = cat.subcategories?.find((s: any) => s.id === product.subcategory_id);
      if (sub) return { id: sub.id, name: sub.name, slug: sub.slug, description: sub.description };
    }
  }
  return undefined;
}

export function transformProduct(p: any): Product {
  // rate     = MRP / original price (shown as strikethrough)
  // sales_rate = selling / discounted price (shown as main price)
  // If no sales_rate, rate is the selling price
  const sellingPrice = p.sales_rate && p.sales_rate < p.rate ? p.sales_rate : p.rate || 0;
  const originalPrice = p.sales_rate && p.sales_rate < p.rate ? p.rate : undefined;

  return {
    id: p.item_id || p.id,
    name: p.name,
    slug: p.item_id || p.id,
    description: p.enhanced_description || p.description || '',
    shortDescription: p.description || '',
    // Store raw ₹ values — no *100 multiplication
    price: sellingPrice,
    compareAtPrice: originalPrice,
    currency: 'INR',
    images: (() => {
      // Use images array if available (multi-image support)
      const imgs: any[] = (p.images as any[]) || [];
      if (imgs.length > 0) {
        return imgs
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((img, i) => ({ id: String(i), url: img.url, alt: p.name, position: i }));
      }
      // Fall back to single image_url
      return p.image_url ? [{ id: '1', url: p.image_url, alt: p.name, position: 0 }] : [];
    })(),
    category: findCategoryFromCache(p),
    subcategory: findSubcategoryFromCache(p),
    categoryId: p.productCategory?.id || p.category_id || '',
    variants: p.variants || [],
    tags: p.tags || [],
    specifications: p.specifications
      ? Object.entries(p.specifications).map(([name, value]) => ({ name, value: String(value) }))
      : [],
    inStock: (p.stock_on_hand || p.available_stock || 0) > 0,
    stockQuantity: p.stock_on_hand || p.available_stock || 0,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    featured: p.featured || false,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    sku: p.sku,
    rate: sellingPrice,
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

      // Cache categories from response for category lookup
      if (data.categories?.length) {
        _categoriesCache = data.categories;
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
      const data = await res.json();
      const p = data.data || data;
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

export { ProductApiService as ShopifyApiService };

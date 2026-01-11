import type { Product } from '@/types/api';

const SHOPIFY_API_BASE = 'http://localhost:3001/api';

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  status: string;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  images: ShopifyImage[];
  image: ShopifyImage | null;
}

export interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string | null;
  grams: number;
  image_id: number | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export interface ShopifyOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
  admin_graphql_api_id: string;
}

class ShopifyService {
  async getProducts(limit = 10, page = 1): Promise<{ success: boolean; data: ShopifyProduct[]; count: number }> {
    const response = await fetch(`${SHOPIFY_API_BASE}/products?limit=${limit}&page=${page}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return response.json();
  }

  async getProduct(id: string): Promise<{ success: boolean; data: ShopifyProduct }> {
    const response = await fetch(`${SHOPIFY_API_BASE}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return response.json();
  }

  // Convert Shopify product to your frontend Product type
  convertToProduct(shopifyProduct: ShopifyProduct): Product {
    return {
      id: shopifyProduct.id.toString(),
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      description: shopifyProduct.body_html,
      shortDescription: shopifyProduct.body_html.substring(0, 200) + '...',
      price: parseFloat(shopifyProduct.variants[0]?.price || '0'),
      compareAtPrice: shopifyProduct.variants[0]?.compare_at_price 
        ? parseFloat(shopifyProduct.variants[0].compare_at_price) 
        : undefined,
      currency: 'USD',
      images: shopifyProduct.images.map(img => ({
        id: img.id.toString(),
        url: img.src,
        alt: img.alt || shopifyProduct.title,
        position: img.position
      })),
      category: {
        id: '1',
        name: shopifyProduct.product_type || 'General',
        slug: shopifyProduct.product_type?.toLowerCase().replace(/\s+/g, '-') || 'general',
        description: '',
        image: '',
        productCount: 0
      },
      categoryId: '1',
      sku: shopifyProduct.variants[0]?.sku || '',
      tags: shopifyProduct.tags.split(',').map(tag => tag.trim()),
      variants: shopifyProduct.variants.map(variant => ({
        id: variant.id.toString(),
        title: variant.title,
        name: variant.title,
        price: parseFloat(variant.price),
        compareAtPrice: variant.compare_at_price ? parseFloat(variant.compare_at_price) : undefined,
        sku: variant.sku || '',
        inventory: variant.inventory_quantity,
        inStock: variant.inventory_quantity > 0
      })),
      specifications: [],
      inStock: (shopifyProduct.variants[0]?.inventory_quantity || 0) > 0,
      stockQuantity: shopifyProduct.variants[0]?.inventory_quantity || 0,
      rating: 4.5,
      reviewCount: 0,
      featured: false,
      createdAt: shopifyProduct.created_at,
      updatedAt: shopifyProduct.updated_at
    };
  }
}

export const shopifyService = new ShopifyService();
export default shopifyService;
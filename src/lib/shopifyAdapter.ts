import type { Product, Category } from '@/types/api';

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  status: string;
  tags: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  published_scope: string;
  admin_graphql_api_id: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  image: ShopifyImage;
  options: ShopifyOption[];
}

interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  option1: string;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  fulfillment_service: string;
  grams: number;
  inventory_management: string;
  requires_shipping: boolean;
  sku: string | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  admin_graphql_api_id: string;
  image_id: number | null;
}

interface ShopifyImage {
  id: number;
  alt: string | null;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

interface ShopifyOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

interface ShopifyApiResponse {
  success: boolean;
  data: ShopifyProduct[];
  count: number;
}

export class ShopifyProductAdapter {
  private static getCategoryFromType(productType: string, tags: string): Category {
    // Map Shopify product_type or tags to categories
    const categoryMap: Record<string, Category> = {
      'lighting': { id: '3', name: 'Lighting', slug: 'lighting', description: 'Illuminate your space', image: '', productCount: 0 },
      'chandelier': { id: '3', name: 'Lighting', slug: 'lighting', description: 'Illuminate your space', image: '', productCount: 0 },
      'lamp': { id: '3', name: 'Lighting', slug: 'lighting', description: 'Illuminate your space', image: '', productCount: 0 },
      'sconce': { id: '3', name: 'Lighting', slug: 'lighting', description: 'Illuminate your space', image: '', productCount: 0 },
      'bath': { id: '1', name: 'Bath Fittings', slug: 'bath-fittings', description: 'Premium bathroom luxury', image: '', productCount: 0 },
      'hardware': { id: '2', name: 'Hardware', slug: 'hardware', description: 'Quality hardware solutions', image: '', productCount: 0 },
      'fan': { id: '4', name: 'Fans', slug: 'fans', description: 'Premium comfort meets style', image: '', productCount: 0 },
      'decor': { id: '5', name: 'Home Decor', slug: 'home-decor', description: 'Elevate your living space', image: '', productCount: 0 },
      'furniture': { id: '6', name: 'Furniture', slug: 'furniture', description: 'Timeless furniture pieces', image: '', productCount: 0 },
      'carpet': { id: '7', name: 'Carpet & Rugs', slug: 'carpet-rugs', description: 'Luxurious floor coverings', image: '', productCount: 0 },
      'rug': { id: '7', name: 'Carpet & Rugs', slug: 'carpet-rugs', description: 'Luxurious floor coverings', image: '', productCount: 0 },
      'perfume': { id: '8', name: 'Perfume', slug: 'perfume', description: 'Signature fragrances', image: '', productCount: 0 }
    };

    const searchText = `${productType} ${tags}`.toLowerCase();
    
    for (const [key, category] of Object.entries(categoryMap)) {
      if (searchText.includes(key)) {
        return category;
      }
    }

    // Default category
    return { id: '5', name: 'Home Decor', slug: 'home-decor', description: 'Elevate your living space', image: '', productCount: 0 };
  }

  static transformProduct(shopifyProduct: ShopifyProduct): Product {
    const category = this.getCategoryFromType(shopifyProduct.product_type, shopifyProduct.tags);
    const mainVariant = shopifyProduct.variants[0];
    
    return {
      id: shopifyProduct.id.toString(),
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      description: shopifyProduct.body_html.replace(/<[^>]*>/g, ''), // Strip HTML
      shortDescription: shopifyProduct.body_html.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
      price: parseFloat(mainVariant.price) * 100, // Convert USD to cents
      currency: 'USD',
      images: shopifyProduct.images.map(img => ({
        id: img.id.toString(),
        url: img.src,
        alt: img.alt || shopifyProduct.title,
        position: img.position
      })),
      category,
      categoryId: category.id,
      variants: shopifyProduct.variants.map(variant => ({
        id: variant.id.toString(),
        name: variant.title,
        title: variant.title,
        price: parseFloat(variant.price) * 100,
        sku: variant.sku || '',
        inventory: variant.inventory_quantity
      })),
      tags: shopifyProduct.tags ? shopifyProduct.tags.split(',').map(tag => tag.trim()) : [],
      specifications: [],
      inStock: mainVariant.inventory_quantity > 0,
      stockQuantity: mainVariant.inventory_quantity,
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static transformProducts(shopifyResponse: ShopifyApiResponse): Product[] {
    if (!shopifyResponse.success || !shopifyResponse.data) {
      return [];
    }

    return shopifyResponse.data.map(product => this.transformProduct(product));
  }
}
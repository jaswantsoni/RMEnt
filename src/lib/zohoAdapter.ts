import type { Product, Category } from '@/types/api';

interface ZohoInventoryItem {
  item_id: string;
  name: string;
  description?: string;
  rate?: string;
  sku?: string;
  item_type?: string;
  unit?: string;
  available_stock?: string;
  image_url?: string;
  is_featured_item?: boolean;
  created_time?: string;
  last_modified_time?: string;
  status?: string;
  brand?: string;
  manufacturer?: string;
  tax_percentage?: number;
  purchase_rate?: string;
  category_id?: string;
}

interface ZohoApiResponse {
  success: boolean;
  data: ZohoInventoryItem[];
  count: number;
}

export class ZohoProductAdapter {
  private static getCategoryFromType(itemType: string, description: string): Category {
    // Map Zoho item type or description to categories
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

    const searchText = `${itemType} ${description}`.toLowerCase();
    
    for (const [key, category] of Object.entries(categoryMap)) {
      if (searchText.includes(key)) {
        return category;
      }
    }

    // Default category
    return { id: '5', name: 'Home Decor', slug: 'home-decor', description: 'Elevate your living space', image: '', productCount: 0 };
  }

  static transformProduct(zohoItem: ZohoInventoryItem): Product {
    const category = this.getCategoryFromType(zohoItem.item_type || '', zohoItem.description || '');
    
    return {
      id: zohoItem.item_id,
      name: zohoItem.name,
      slug: zohoItem.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: zohoItem.description || '',
      shortDescription: (zohoItem.description || '').substring(0, 100) + '...',
      price: parseFloat(zohoItem.rate || '0') * 100, // Convert to cents
      currency: 'USD',
      images: zohoItem.image_url ? [{
        id: '1',
        url: zohoItem.image_url,
        alt: zohoItem.name,
        position: 0
      }] : [{
        id: '1',
        url: '/placeholder.svg',
        alt: zohoItem.name,
        position: 0
      }],
      category,
      categoryId: category.id,
      variants: [{
        id: zohoItem.item_id,
        title: 'Default',
        price: parseFloat(zohoItem.rate || '0') * 100,
        sku: zohoItem.sku || '',
        inventory: parseInt(zohoItem.available_stock || '0')
      }],
      tags: zohoItem.item_type ? [zohoItem.item_type] : [],
      specifications: [
        { name: 'SKU', value: zohoItem.sku || 'N/A' },
        { name: 'Unit', value: zohoItem.unit || 'pcs' },
        { name: 'Item Type', value: zohoItem.item_type || 'Product' }
      ],
      inStock: parseInt(zohoItem.available_stock || '0') > 0,
      stockQuantity: parseInt(zohoItem.available_stock || '0'),
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      featured: zohoItem.is_featured_item || false,
      createdAt: zohoItem.created_time || new Date().toISOString(),
      updatedAt: zohoItem.last_modified_time || new Date().toISOString()
    };
  }

  static transformProducts(zohoResponse: ZohoApiResponse): Product[] {
    if (!zohoResponse.success || !zohoResponse.data) {
      return [];
    }

    return zohoResponse.data.map(item => this.transformProduct(item));
  }
}
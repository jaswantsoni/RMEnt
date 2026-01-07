const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    description: string | null;
  }[];
}

export class CategoryApiService {
  static async fetchCategories(): Promise<ApiCategory[]> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
      
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }
}
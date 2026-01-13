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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${BACKEND_URL}/api/categories`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories fetched successfully:', data.data?.length || 0);
      return data.data || [];
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Category fetch timeout after 10s');
      } else {
        console.error('Failed to fetch categories:', error);
      }
      return [];
    }
  }
}
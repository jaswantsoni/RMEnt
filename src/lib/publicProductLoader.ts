export interface PublicProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  [key: string]: any; // Allow additional Excel columns
}

let cachedProducts: PublicProduct[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function loadPublicProducts(): Promise<PublicProduct[]> {
  // Return cached products if still fresh
  if (cachedProducts.length > 0 && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedProducts;
  }

  // Fallback to localStorage first (most reliable)
  const stored = localStorage.getItem('azzaro-products');
  if (stored) {
    try {
      cachedProducts = JSON.parse(stored);
      lastFetchTime = Date.now();
      console.log(`Loaded ${cachedProducts.length} products from localStorage`);
      return cachedProducts;
    } catch (e) {
      console.error('Failed to parse stored products:', e);
    }
  }
  
  return [];
}
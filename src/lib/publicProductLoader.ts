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

  try {
    // Use direct Google Drive share link (publicly accessible)
    const response = await fetch(
      `https://drive.google.com/uc?export=download&id=1UbrOmcZj8KOftlTWw-GoszTJPCwvwtIC`,
      { mode: 'cors' }
    );
    
    if (response.ok) {
      const products = await response.json();
      cachedProducts = Array.isArray(products) ? products : [];
      lastFetchTime = Date.now();
      console.log(`Loaded ${cachedProducts.length} products from Drive`);
      return cachedProducts;
    }
  } catch (error) {
    console.error('Failed to load from Drive:', error);
    // Fallback to localStorage if available
    const stored = localStorage.getItem('azzaro-products');
    if (stored) {
      try {
        cachedProducts = JSON.parse(stored);
        return cachedProducts;
      } catch (e) {
        console.error('Failed to parse stored products:', e);
      }
    }
  }
  
  return [];
}
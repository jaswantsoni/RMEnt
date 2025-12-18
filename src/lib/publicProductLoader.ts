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
    // Use Google Drive API with API key (no OAuth required)
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/1UbrOmcZj8KOftlTWw-GoszTJPCwvwtIC?alt=media&key=AIzaSyCN06FG4ZDM1wwjvq5276_6or5EaBDhPG4`
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
  }
  
  return [];
}
// Product data loader
export function loadProductsFromStorage(): any[] {
  try {
    const data = localStorage.getItem('azzaro_products_data');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load products from storage:', error);
    return [];
  }
}

export function saveProductsToStorage(products: any[]): void {
  try {
    localStorage.setItem('azzaro_products_data', JSON.stringify(products));
  } catch (error) {
    console.error('Failed to save products to storage:', error);
  }
}

export async function loadProductsFromJSON(url: string): Promise<any[]> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Failed to load products from JSON:', error);
    return [];
  }
}
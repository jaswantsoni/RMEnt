// Category mapping for Azzaro products
export const CATEGORY_MAP = {
  'Bath Fittings': { id: '1', slug: 'bath-fittings' },
  'Hardware': { id: '2', slug: 'hardware' },
  'Lighting': { id: '3', slug: 'lighting' },
  'Fans': { id: '4', slug: 'fans' },
  'Home Decor': { id: '5', slug: 'home-decor' },
  'Furniture': { id: '6', slug: 'furniture' },
  'Carpet & Rugs': { id: '7', slug: 'carpet-rugs' },
  'Perfume': { id: '8', slug: 'perfume' },
};

export function getCategoryInfo(categoryName: string) {
  const category = CATEGORY_MAP[categoryName as keyof typeof CATEGORY_MAP];
  return category || { id: '9', slug: 'general' };
}
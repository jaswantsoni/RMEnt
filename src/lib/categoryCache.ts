import { CategoryApiService, type ApiCategory } from './categoryApi';

const CACHE_KEY = 'azzaro_categories_cache';
const CACHE_EXPIRY_KEY = 'azzaro_categories_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface CachedCategory {
  id: string;
  name: string;
  href: string;
  image: string;
  subcategories: {
    id: string;
    name: string;
    href: string;
    image: string;
  }[];
}

export class CategoryCache {
  static isExpired(): boolean {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    return !expiry || Date.now() > parseInt(expiry);
  }

  static get(): CachedCategory[] | null {
    if (this.isExpired()) return null;
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  }

  static set(categories: CachedCategory[]): void {
    localStorage.setItem(CACHE_KEY, JSON.stringify(categories));
    localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
  }

  static async getCategories(): Promise<CachedCategory[]> {
    const cached = this.get();
    if (cached) return cached;

    const fetchedCategories = await CategoryApiService.fetchCategories();
    const transformedCategories = fetchedCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      href: `/collections/${cat.slug}`,
      image: cat.image_url,
      subcategories: cat.subcategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        href: `/collections/${sub.slug}`,
        image: sub.image_url
      }))
    }));

    this.set(transformedCategories);
    return transformedCategories;
  }
}
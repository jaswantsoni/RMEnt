import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/api';

import { useProductStore } from '@/store/productStore';
import { set } from 'date-fns';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
    setSearching(true);
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?page=1&limit=50&search=${encodeURIComponent(searchQuery)}`
      );
      
      if (response.ok) {
        const result = await response.json();
        const products = result.data || [];
        
        // Transform API products to match Product interface
        const transformedProducts = products.map((apiProduct: any) => ({
          id: apiProduct.item_id,
          name: apiProduct.name,
          slug: apiProduct.item_id,
          item_id: apiProduct.item_id,
          price: apiProduct.rate,
          images: apiProduct.image_url ? [{ id: '1', url: apiProduct.image_url, alt: apiProduct.name, position: 0 }] : [],
          category: {
            id: apiProduct.category_id || '1',
            name: apiProduct.category_name || 'Uncategorized',
            slug: (apiProduct.category_name || 'uncategorized').toLowerCase().replace(/\s+/g, '-'),
            description: '', image: '', productCount: 0
          },
          subcategory: apiProduct.subcategory_name ? {
            id: apiProduct.subcategory_id || '1',
            name: apiProduct.subcategory_name,
            slug: apiProduct.subcategory_name.toLowerCase().replace(/\s+/g, '-'),
            description: ''
          } : undefined,
          description: apiProduct.description || '',
          inStock: apiProduct.available_stock > 0,
          rating: 5,
          reviewCount: 0,
          sku: apiProduct.sku
        }));
        
        setResults(transformedProducts);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

const clearSearch = () => {
  console.log('Clear search called');
    setQuery('');
    setResults([]);
    setSearchParams({});
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Search Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-8">
              Search <span className="text-gradient-gold">Products</span>
            </h1>
            <form onSubmit={handleSearch} className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
              <Input
                type="text"
                placeholder="Search by name, category, SKU, or brand..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-24 text-lg bg-card border-border/50 focus:border-primary rounded-xl"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-foreground/40 hover:text-foreground/60"
                >
                  <X className="h-5 w-5 pr-2" />
                </button>
              )}
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 bg-primary hover:bg-primary/90"
              >
                Search
              </Button>
            </form>
          </motion.div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : searching && results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <SearchIcon className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-3">No results found</h2>
              <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                We couldn't find any products matching "{query}". Try different keywords or browse our collections.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/collections">Browse Collections</Link>
              </Button>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-8">
                <p className="text-foreground/60">
                  Found <span className="text-foreground font-medium">{results.length}</span> results for "{query}"
                </p>
                <Button variant="outline" className="border-border/50">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-foreground/60 text-lg">
                Search our collection
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

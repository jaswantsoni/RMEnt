import { ShopifyApiService } from '@/lib/shopifyApi';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import type { Product } from '@/types/api';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await ShopifyApiService.fetchProducts(50);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    setSearching(true);
    try {
      const searchResults = await ShopifyApiService.searchProducts(searchQuery);
      setProducts(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen pt-18 bg-background">
      <Header />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">
            Our <span className="text-gradient-gold">Products</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of premium lighting, furniture, and home decor items.
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2 max-w-md mx-auto mb-8">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Showing {products.length} products
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found.</p>
                <Button onClick={loadProducts} className="mt-4">
                  Reload Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
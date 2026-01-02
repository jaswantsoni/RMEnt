import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Loader2 } from 'lucide-react';
import { ShopifyApiService } from '@/lib/shopifyApi';
import { useProductStore } from '@/store/productStore';
import type { Product } from '@/types/api';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { setProducts: setStoreProducts } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isScrollLoading, setIsScrollLoading] = useState(false);

  const loadProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
    if (isScrollLoading && !reset) return; // Prevent multiple scroll requests
    
    try {
      if (pageNum === 1) setLoading(true);
      else {
        setLoadingMore(true);
        setIsScrollLoading(true);
      }
      
      const fetchedProducts = await ShopifyApiService.fetchProducts(20, pageNum, sortBy, sortOrder);
      
      if (fetchedProducts.length === 0 || fetchedProducts.length < 20) {
        setHasMore(false);
      }
      
      if (fetchedProducts.length === 0) {
        return;
      }
      
      setProducts(prev => {
        const newProducts = reset ? fetchedProducts : [...prev, ...fetchedProducts];
        
        // Remove duplicates based on product ID
        const uniqueProducts = newProducts.filter((product, index, self) => 
          index === self.findIndex(p => p.id === product.id)
        );
        
        setStoreProducts(uniqueProducts);
        return uniqueProducts;
      });
      
      // Extract unique categories
      setCategories(prev => {
        setProducts(current => {
          const uniqueCategories = [...new Set(current.map(p => p.category.name).filter(Boolean))];
          return current;
        });
        return [...new Set(products.map(p => p.category.name).filter(Boolean))];
      });
      
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setIsScrollLoading(false);
    }
  }, [setStoreProducts, sortBy, sortOrder, isScrollLoading]);

  // Infinite scroll with throttling
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (!loadingMore && !isScrollLoading && hasMore) {
          setPage(prev => prev + 1);
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 500); // Throttle to 500ms
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [loadingMore, isScrollLoading, hasMore]);

  // Throttle function
  function throttle(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    return function (...args: any[]) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  useEffect(() => {
    loadProducts(1, true);
  }, [sortBy, sortOrder]);

  useEffect(() => {
    if (page > 1) {
      loadProducts(page);
    }
  }, [page, loadProducts]);

  // Set filtered products to products (no frontend filtering since backend handles sorting)
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products from Shopify...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-semibold mb-4">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of {products.length} premium products
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [newSortBy, newSortOrder] = value.split('-');
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
            setPage(1);
            setHasMore(true);
            loadProducts(1, true);
          }}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="title-asc">Name A-Z</SelectItem>
              <SelectItem value="title-desc">Name Z-A</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(20)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            {loadingMore && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {[...Array(20)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
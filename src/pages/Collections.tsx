import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, LayoutGrid, ChevronDown, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import type { Product, Category } from '@/types/api';
import { ShopifyApiService } from '@/lib/shopifyApi';
import { useProductStore } from '@/store/productStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';



export default function Collections() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: storeProducts, setProducts: setStoreProducts } = useProductStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [preloaded, setPreloaded] = useState(false);

  const currentCategory = categories.find((c) => c.slug === category);
  console.log("products in store:", storeProducts);
  const loadProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
    console.log('Loading products for page:', pageNum);
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      
      const fetchedProducts = await ShopifyApiService.fetchProducts(20, pageNum, sortBy, sortOrder);
      
      if (fetchedProducts.length === 0) {
        setHasMore(false);
        return;
      }
      
      const newAllProducts = reset ? fetchedProducts : [...allProducts, ...fetchedProducts];
      setAllProducts(newAllProducts);
      setStoreProducts(newAllProducts);
      console.log('Fetched products:', fetchedProducts);
      
      // Generate categories with actual product counts
      const categoryMap = new Map<string, Category>();
      newAllProducts.forEach(product => {
        const cat = product.category;
        if (categoryMap.has(cat.slug)) {
          categoryMap.get(cat.slug)!.productCount++;
        } else {
          categoryMap.set(cat.slug, { ...cat, productCount: 1 });
        }
      });
      setCategories(Array.from(categoryMap.values()));
      
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [allProducts, setStoreProducts, sortBy, sortOrder]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (!loadingMore && hasMore) {
          setPage(prev => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  // Load products with pagination
  useEffect(() => {
    const loadInitialProducts = async () => {
      if (storeProducts.length > 0) {
        setAllProducts(storeProducts);
        setPreloaded(true);
        
        // Generate categories
        const categoryMap = new Map<string, Category>();
        storeProducts.forEach((product: Product) => {
          if (product.category) {
            const cat = product.category;
            if (!categoryMap.has(cat.slug)) {
              categoryMap.set(cat.slug, { ...cat, productCount: 0 });
            }
          }
        });
        setCategories(Array.from(categoryMap.values()));
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/products?page=1&limit=50`);
        const data = await response.json();
        
        console.log('API Response:', data); // Debug log
        
        const products = data.data || []; // Use data.data since API returns {success, data, pagination}
        setAllProducts(products);
        setStoreProducts(products);
        setPreloaded(true);
        
        console.log('Loaded products:', products); // Debug log
        
        // Generate categories
        const categoryMap = new Map<string, Category>();
        products.forEach((product: Product) => {
          if (product.category) {
            const cat = product.category;
            if (!categoryMap.has(cat.slug)) {
              categoryMap.set(cat.slug, { 
                id: cat.id, 
                name: cat.name, 
                slug: cat.slug, 
                description: cat.description,
                image: cat.image,
                productCount: 0 
              });
            }
          }
        });
        setCategories(Array.from(categoryMap.values()));
        
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialProducts();
  }, []);

  useEffect(() => {
    if (page > 1) {
      loadProducts(page);
    }
  }, [page, loadProducts]);

  // Filter products
  useEffect(() => {
    if (!Array.isArray(allProducts)) return;
    
    let filtered = [...allProducts];

    if (category) {
      filtered = filtered.filter((p: Product) => {
        return p.category?.slug === category;
      });
    }

    setProducts(filtered);
  }, [category, priceRange, sortBy, allProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price / 100); // Convert cents back to dollars
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-card/30 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/collections" className="hover:text-primary transition-colors">
                Collections
              </Link>
              {currentCategory && (
                <>
                  <span>/</span>
                  <span className="text-foreground">{currentCategory.name}</span>
                </>
              )}
            </nav>
            <h1 className="text-4xl md:text-5xl font-display font-semibold">
              {currentCategory ? (
                <>
                  <span className="text-gradient-gold">{currentCategory.name}</span>
                </>
              ) : (
                <>
                  All <span className="text-gradient-gold">Collections</span>
                </>
              )}
            </h1>
            {currentCategory && (
              <p className="text-muted-foreground mt-4 max-w-2xl">
                {currentCategory.description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <p className="text-muted-foreground">
              Showing {products.length} products
            </p>
            <div className="flex items-center gap-4">
              {/* Filter Button - Mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Categories */}
                    <div>
                      <h4 className="font-medium mb-4">Categories</h4>
                      <div className="space-y-3">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            to={`/collections/${cat.slug}`}
                            className={`block text-sm transition-colors ${
                              category === cat.slug
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium mb-4">Price Range</h4>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={100000}
                        step={1000}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setPage(1);
                setHasMore(true);
                loadProducts(1, true);
              }}>
                <SelectTrigger className="w-[180px]">
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

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center border border-border rounded-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className={gridCols === 3 ? 'bg-secondary' : ''}
                  onClick={() => setGridCols(3)}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={gridCols === 4 ? 'bg-secondary' : ''}
                  onClick={() => setGridCols(4)}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-4">Categories</h4>
                  <div className="space-y-3">
                    <Link
                      to="/collections"
                      className={`block text-sm transition-colors ${
                        !category
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All Products
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/collections/${cat.slug}`}
                        className={`block text-sm transition-colors ${
                          category === cat.slug
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-4">Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={100000}
                    step={1000}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(20)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-6 ${
                      gridCols === 3
                        ? 'sm:grid-cols-2 lg:grid-cols-3'
                        : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    }`}
                  >
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

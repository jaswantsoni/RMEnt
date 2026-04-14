import { useState, useEffect, useCallback, useRef } from 'react';
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
import type { Product, Category, Subcategory } from '@/types/api';
import { ShopifyApiService } from '@/lib/shopifyApi';
import { useProductStore } from '@/store/productStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';



export default function Collections() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProducts, setProducts: setAllProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [preloaded, setPreloaded] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const loadingRef = useRef(false);
  const lastCallRef = useRef(0);

  const currentCategory = categories.find((c) => c.slug === category) || 
    categories.find(cat => cat.subcategories?.some(sub => sub.slug === category))?.subcategories?.find(sub => sub.slug === category);
  console.log("products in store:", allProducts.length);
  console.log("filtered products:", filteredProducts.length);
  console.log("loading:", loading);
  console.log("category param:", category);
  console.log("current category found:", currentCategory);
  const loadProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
    // Prevent duplicate calls within 1 second
    const now = Date.now();
    if (now - lastCallRef.current < 1000) return;
    lastCallRef.current = now;
    
    // Prevent concurrent calls
    if (loadingRef.current) return;
    loadingRef.current = true;
    
    console.log('Loading products for page:', pageNum);
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);
      
      // Find category/subcategory ID for filtering
      let categoryId: string | undefined;
      let subcategoryId: string | undefined;
      
      console.log('Current category param:', category);
      console.log('Available categories:', categories.map(c => ({ id: c.id, slug: c.slug, name: c.name })));
      
      if (category) {
        // Check if it's a main category
        const mainCategory = categories.find(cat => cat.slug === category);
        if (mainCategory) {
          categoryId = mainCategory.id;
          console.log('Found main category:', { id: categoryId, name: mainCategory.name });
        } else {
          // Check if it's a subcategory
          for (const cat of categories) {
            const subcat = cat.subcategories?.find(sub => sub.slug === category);
            if (subcat) {
              subcategoryId = subcat.id;
              console.log('Found subcategory:', { id: subcategoryId, name: subcat.name, parentCategory: cat.name });
              break;
            }
          }
        }
      }
      
      const filters = {
        ...(categoryId && { category_id: categoryId }),
        ...(subcategoryId && { subcategory_id: subcategoryId }),
        ...(priceRange[0] > 0 && { min_price: priceRange[0] }),
        ...(priceRange[1] < 100000 && { max_price: priceRange[1] })
      };
      
      console.log('Applied filters:', filters);
      
      const fetchedProducts = await ShopifyApiService.fetchProducts(20, pageNum, sortBy, sortOrder, filters);
      
      // Set hasMore based on fetched products count
      if (fetchedProducts.length < 20) {
        setHasMore(false);
      }
      
      // Clear existing products when resetting to avoid mixing
      if (reset) {
        // Products already cleared in useEffect, just proceed
      }
      
      const newProducts = reset ? fetchedProducts : [...allProducts, ...fetchedProducts];
      setAllProducts(newProducts);
      
      // Load categories from localStorage if available, or fetch from API
      if (categories.length === 0) {
        const storedCategories = localStorage.getItem('ekart24_categories');
        if (storedCategories) {
          try {
            const parsedCategories = JSON.parse(storedCategories);
            setCategories(parsedCategories);
          } catch (e) {
            console.error('Error parsing stored categories:', e);
          }
        } else {
          // Fetch categories from API if not in localStorage
          try {
            const { CategoryApiService } = await import('@/lib/categoryApi');
            const fetchedCategories = await CategoryApiService.fetchCategories();
            // Transform ApiCategory to Category format
            const transformedCategories = fetchedCategories.map(cat => ({
              ...cat,
              image: cat.image_url || '',
              productCount: 0,
              subcategories: cat.subcategories.map(sub => ({
                ...sub,
                description: sub.description || sub.name || '',
                image: sub.image_url || ''
              }))
            }));
            setCategories(transformedCategories);
            localStorage.setItem('ekart24_categories', JSON.stringify(transformedCategories));
          } catch (error) {
            console.error('Failed to load categories:', error);
          }
        }
      }
      
      console.log('Fetched products:', fetchedProducts);
      
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false;
    }
  }, [allProducts, sortBy, sortOrder, category, categories, priceRange]);

  // Throttled infinite scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (loading || loadingMore || loadingRef.current) return;
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
          if (!loadingMore && hasMore && page > 0) {
            setPage(prev => prev + 1);
          }
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [loading, loadingMore, hasMore, page]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { CategoryApiService } = await import('@/lib/categoryApi');
        const fetchedCategories = await CategoryApiService.fetchCategories();
        // Transform ApiCategory to Category format
        const transformedCategories = fetchedCategories.map(cat => ({
          ...cat,
          image: cat.image_url || '',
          productCount: 0,
          subcategories: cat.subcategories.map(sub => ({
            ...sub,
            description: sub.description || sub.name || '',
            image: sub.image_url || ''
          }))
        }));
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Load initial products and reload when filters change
  useEffect(() => {
    if (loadingRef.current) return;
    
    // Only proceed if categories are loaded (or no category filter needed)
    if (category && categories.length === 0) {
      console.log('Waiting for categories to load before filtering...');
      return;
    }
    
    // Clear products immediately when category changes
    setAllProducts([]);
    setFilteredProducts([]);
    
    setPage(1);
    setHasMore(true);
    loadProducts(1, true);
  }, [category, priceRange, categories.length]);

  useEffect(() => {
    if (page > 1 && !loadingRef.current) {
      loadProducts(page);
    }
  }, [page]);

  // Set filtered products to all products since filtering is server-side
  useEffect(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

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
      <section className="pt-12 lg:pt-16 pb-16 bg-card/30 border-b border-border">
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
          <div className="sticky top-0 bg-background z-10 pb-4 mb-4 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* <p className="text-muted-foreground">
              Showing {filteredProducts.length} products
            </p> */}
            <div className="flex items-center gap-4">
              {/* Filter Button - Mobile */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
                          <div key={cat.id}>
                            <Link
                              to={`/collections/${cat.slug}`}
                              onClick={() => setIsFilterOpen(false)}
                              className={`block text-sm font-medium transition-colors ${
                                category === cat.slug
                                  ? 'text-primary'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {cat.name}
                            </Link>
                            {cat.subcategories && cat.subcategories.length > 0 && (
                              <div className="ml-4 mt-2 space-y-2">
                                {cat.subcategories.map((subcat: Subcategory) => (
                                  <Link
                                    key={subcat.id}
                                    to={`/collections/${subcat.slug}`}
                                    onClick={() => setIsFilterOpen(false)}
                                    className={`block text-xs transition-colors ${
                                      category === subcat.slug
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    {subcat.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
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
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-12 lg:top-16 self-start max-h-[calc(100vh-12rem)] overflow-y-auto">
              <div className="space-y-8 pr-4">
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
                      <div key={cat.id} className="relative">
                        <div
                          onMouseEnter={() => setExpandedCategory(cat.id)}
                          onMouseLeave={() => setExpandedCategory(null)}
                          onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                        >
                          <Link
                            to={`/collections/${cat.slug}`}
                            className={`block text-sm font-medium transition-colors ${
                              category === cat.slug
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {cat.name}
                          </Link>
                          {(expandedCategory === cat.id || category === cat.slug) && cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="ml-4 mt-2 space-y-2">
                              {cat.subcategories.map((subcat: Subcategory) => (
                                <Link
                                  key={subcat.id}
                                  to={`/collections/${subcat.slug}`}
                                  className={`block text-xs transition-colors ${
                                    category === subcat.slug
                                      ? 'text-primary'
                                      : 'text-muted-foreground hover:text-foreground'
                                  }`}
                                >
                                  {subcat.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                {/* <div>
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
                </div> */}
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {loading && allProducts.length === 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(20)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
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
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} index={0} />
                    ))}
                  </div>
                  
                  {/* Loading more indicator */}
                  {loadingMore && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
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

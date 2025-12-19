import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid3X3, LayoutGrid, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
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
import { useProductStore } from '@/store/productStore';

const categories: Category[] = [
  { id: '1', name: 'Bath Fittings', slug: 'bath-fittings', description: 'Premium bathroom luxury', image: '', productCount: 0 },
  { id: '2', name: 'Hardware', slug: 'hardware', description: 'Quality hardware solutions', image: '', productCount: 0 },
  { id: '3', name: 'Lighting', slug: 'lighting', description: 'Illuminate your space', image: '', productCount: 0 },
  { id: '4', name: 'Fans', slug: 'fans', description: 'Premium comfort & style', image: '', productCount: 0 },
  { id: '5', name: 'Home Decor', slug: 'home-decor', description: 'Elevate your living space', image: '', productCount: 0 },
  { id: '6', name: 'Furniture', slug: 'furniture', description: 'Timeless furniture pieces', image: '', productCount: 0 },
  { id: '7', name: 'Carpet & Rugs', slug: 'carpet-rugs', description: 'Luxurious floor coverings', image: '', productCount: 0 },
  { id: '8', name: 'Perfume', slug: 'perfume', description: 'Signature fragrances', image: '', productCount: 0 },
];

export default function Collections() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: storeProducts } = useProductStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');

  const currentCategory = categories.find((c) => c.slug === category);

  useEffect(() => {
    let filtered = [...storeProducts];

    if (category) {
      filtered = filtered.filter((p) => p.category?.slug === category);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setProducts(filtered);
  }, [category, priceRange, sortBy, storeProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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
                            {cat.name} ({cat.productCount})
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
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
              <div className="sticky top-28 space-y-8">
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
                        {cat.name} ({cat.productCount})
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
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, Truck, Shield, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/types/api';
import { cn } from '@/lib/utils';

// Mock product data
const mockProduct: Product = {
  id: '1',
  name: 'Aurora Crystal Chandelier',
  slug: 'aurora-crystal-chandelier',
  description: `The Aurora Crystal Chandelier is a masterpiece of modern lighting design. Featuring hand-cut crystal elements that catch and refract light beautifully, this chandelier creates a stunning visual display in any room.

Each crystal is meticulously selected and polished to ensure maximum brilliance and clarity. The gold-finished frame provides an elegant contrast to the clear crystals, making this piece a true statement of luxury.

Perfect for dining rooms, foyers, or grand living spaces, the Aurora brings a touch of opulence to your home while providing warm, ambient lighting.`,
  shortDescription: 'Elegant hand-cut crystal chandelier with gold finish',
  price: 45999,
  compareAtPrice: 59999,
  currency: 'INR',
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=1200', alt: 'Crystal Chandelier', position: 0 },
    { id: '2', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200', alt: 'Chandelier Detail', position: 1 },
    { id: '3', url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200', alt: 'Chandelier Room', position: 2 },
  ],
  category: { id: '1', name: 'Lighting', slug: 'lighting', description: '', image: '', productCount: 0 },
  categoryId: '1',
  variants: [
    { id: 'v1', name: 'Small (60cm)', sku: 'AUR-S', price: 45999, inStock: true, stockQuantity: 10, options: [{ name: 'Size', value: 'Small' }] },
    { id: 'v2', name: 'Medium (80cm)', sku: 'AUR-M', price: 59999, inStock: true, stockQuantity: 5, options: [{ name: 'Size', value: 'Medium' }] },
    { id: 'v3', name: 'Large (100cm)', sku: 'AUR-L', price: 79999, inStock: false, stockQuantity: 0, options: [{ name: 'Size', value: 'Large' }] },
  ],
  tags: ['luxury', 'crystal', 'chandelier'],
  specifications: [
    { name: 'Material', value: 'Crystal, Gold-plated Steel' },
    { name: 'Dimensions', value: '60cm x 60cm x 45cm' },
    { name: 'Weight', value: '12 kg' },
    { name: 'Bulb Type', value: 'E14, Max 40W x 8' },
    { name: 'Color Temperature', value: 'Warm White (3000K)' },
    { name: 'Installation', value: 'Ceiling Mounted' },
  ],
  inStock: true,
  stockQuantity: 15,
  rating: 4.8,
  reviewCount: 124,
  featured: true,
  createdAt: '',
  updatedAt: '',
};

const relatedProducts: Product[] = [
  {
    id: '2',
    name: 'Noir Industrial Pendant',
    slug: 'noir-industrial-pendant',
    description: 'Industrial style pendant light',
    shortDescription: 'Industrial pendant',
    price: 12999,
    currency: 'INR',
    images: [{ id: '2', url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800', alt: 'Pendant Light', position: 0 }],
    category: { id: '1', name: 'Lighting', slug: 'lighting', description: '', image: '', productCount: 0 },
    categoryId: '1',
    variants: [],
    tags: ['industrial'],
    specifications: [],
    inStock: true,
    stockQuantity: 32,
    rating: 4.6,
    reviewCount: 89,
    featured: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '5',
    name: 'Eclipse Wall Sconce',
    slug: 'eclipse-wall-sconce',
    description: 'Minimalist wall sconce',
    shortDescription: 'Minimalist sconce',
    price: 6999,
    currency: 'INR',
    images: [{ id: '5', url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800', alt: 'Wall Sconce', position: 0 }],
    category: { id: '1', name: 'Lighting', slug: 'lighting', description: '', image: '', productCount: 0 },
    categoryId: '1',
    variants: [],
    tags: ['minimalist'],
    specifications: [],
    inStock: true,
    stockQuantity: 25,
    rating: 4.7,
    reviewCount: 45,
    featured: false,
    createdAt: '',
    updatedAt: '',
  },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const { getProductBySlug } = useProductStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // Get product from store or fallback to mock
  const product = getProductBySlug(slug || '') || mockProduct;
  
  useEffect(() => {
    if (product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentPrice = selectedVariant?.price || product.price;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/collections/${product.category?.slug}`} className="hover:text-primary transition-colors">
              {product.category?.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div 
                ref={mainImageRef}
                className="aspect-square overflow-hidden rounded-sm bg-card cursor-zoom-in"
                onMouseMove={handleImageMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => { setIsZooming(false); setZoomPosition({ x: 50, y: 50 }); }}
              >
                <img
                  src={product.images[selectedImage]?.url}
                  alt={product.images[selectedImage]?.alt}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out"
                  style={{
                    transform: isZooming ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors',
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <Link
                  to={`/collections/${product.category?.slug}`}
                  className="text-sm text-primary uppercase tracking-wider hover:underline"
                >
                  {product.category?.name}
                </Link>
                <h1 className="text-3xl md:text-4xl font-display font-semibold mt-2">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      )}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-semibold text-gradient-gold">
                  {formatPrice(currentPrice)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-sm font-medium">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground">{product.shortDescription}</p>

              {/* Variants */}
              {product.variants.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.inStock}
                        className={cn(
                          'px-4 py-2 border rounded-sm transition-colors',
                          selectedVariant?.id === variant.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50',
                          !variant.inStock && 'opacity-50 cursor-not-allowed line-through'
                        )}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-medium mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedVariant?.stockQuantity || product.stockQuantity} in stock
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => addItem(product, selectedVariant, quantity)}
                  disabled={!selectedVariant?.inStock && !product.inStock}
                >
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">2 Year Warranty</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Easy Returns</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="container mx-auto px-4 lg:px-8 py-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-8">
              <div className="prose prose-invert max-w-none">
                {product.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="py-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.name}
                    className="flex justify-between py-3 border-b border-border"
                  >
                    <span className="text-muted-foreground">{spec.name}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-8">
              <p className="text-muted-foreground">
                Reviews will be loaded from the API.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        {/* Related Products */}
        <section className="container mx-auto px-4 lg:px-8 py-16 border-t border-border">
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-8">
            You May Also <span className="text-gradient-gold">Like</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

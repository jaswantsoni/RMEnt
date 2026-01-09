import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, Truck, Shield, RefreshCw, Star, ChevronRight, Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/types/api';
import { cn } from '@/lib/utils';



export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist, fetchWishlist } = useWishlistStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const mainImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${slug}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const apiProduct = result.data;
            // Transform API response to match Product interface
            const transformedProduct = {
              id: apiProduct.item_id,
              name: apiProduct.name,
              slug: apiProduct.item_id,
              description: apiProduct.description || apiProduct.enhanced_description || '',
              shortDescription: apiProduct.description || '',
              price: apiProduct.rate * 100, // Convert to cents
              compareAtPrice: apiProduct.sales_rate !== apiProduct.rate ? apiProduct.sales_rate * 100 : undefined,
              currency: 'USD',
              images: apiProduct.image_url ? [{ id: '1', url: apiProduct.image_url, alt: apiProduct.name, position: 0 }] : [],
              category: {
                id: apiProduct.productCategory?.id || apiProduct.category_id || '1',
                name: apiProduct.productCategory?.name || apiProduct.category || 'Uncategorized',
                slug: apiProduct.productCategory?.slug || (apiProduct.productCategory?.name || apiProduct.category || 'uncategorized').toLowerCase().replace(/\s+/g, '-'),
                description: apiProduct.productCategory?.description || '',
                image: apiProduct.productCategory?.image_url || '',
                productCount: 0
              },
              subcategory: apiProduct.productSubcategory ? {
                id: apiProduct.productSubcategory.id,
                name: apiProduct.productSubcategory.name,
                slug: apiProduct.productSubcategory.slug,
                description: apiProduct.productSubcategory.description
              } : undefined,
              categoryId: '1',
              variants: [],
              tags: apiProduct.zoho_data?.tags || [],
              specifications: apiProduct.specifications ? Object.entries(apiProduct.specifications).map(([name, value]) => ({ name, value: String(value) })) : [],
              inStock: apiProduct.stock_on_hand > 0,
              stockQuantity: apiProduct.stock_on_hand,
              rating: 5,
              reviewCount: 0,
              featured: false,
              createdAt: apiProduct.created_at,
              updatedAt: apiProduct.updated_at,
              sku: apiProduct.sku,
              rate: apiProduct.rate,
              item_id: apiProduct.item_id,
              image_url: apiProduct.image_url,
            };
            setProduct(transformedProduct);
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [slug]);
  
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
    console.log('Selected variant set to:', product);
  }, [product]);

  // Load related products based on category and name matches
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product?.category?.slug) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products?limit=20`);
        if (response.ok) {
          const result = await response.json();
          const products = result.data || [];
          
          // Filter by category and name similarity, exclude current product
          const related = products
            .filter((p: any) => p.item_id !== product.id)
            .filter((p: any) => {
              const sameCategory = p.category_name === product.category?.name;
              const nameWords = product.name.toLowerCase().split(' ');
              const productNameWords = p.name.toLowerCase().split(' ');
              const hasCommonWords = nameWords.some(word => productNameWords.includes(word));
              return sameCategory || hasCommonWords;
            })
            .slice(0, 4);
            
          setRelatedProducts(related.map((apiProduct: any) => ({
            id: apiProduct.item_id,
            name: apiProduct.name,
            slug: apiProduct.item_id,
            price: apiProduct.rate * 100,
            item_id: apiProduct.item_id,
            images: apiProduct.image_url ? [{ id: '1', url: apiProduct.image_url, alt: apiProduct.name, position: 0 }] : [],
            category: {
              id: apiProduct.category_id || '1',
              name: apiProduct.category_name || 'Uncategorized',
              slug: (apiProduct.category_name || 'uncategorized').toLowerCase().replace(/\s+/g, '-'),
              description: '', image: '', productCount: 0
            },
            inStock: apiProduct.available_stock > 0,
            rating: 5,
            reviewCount: 0
          })));
        }
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
    };
    
    loadRelatedProducts();
  }, [product]);

  // Load related products based on category
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product?.category?.slug) return;
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products?category=${product.category.slug}&limit=4`);
        if (response.ok) {
          const result = await response.json();
          const products = result.data || [];
          // Filter out current product and limit to 4
          const related = products.filter((p: any) => p.item_id !== product.id).slice(0, 4);
          setRelatedProducts(related.map((apiProduct: any) => ({
            id: apiProduct.item_id,
            name: apiProduct.name,
            slug: apiProduct.item_id,
            item_id: apiProduct.item_id,
            price: apiProduct.rate * 100,
            images: apiProduct.image_url ? [{ id: '1', url: apiProduct.image_url, alt: apiProduct.name, position: 0 }] : [],
            category: product.category,
            inStock: apiProduct.available_stock > 0,
            rating: 5,
            reviewCount: 0
          })));
        }
      } catch (error) {
        console.error('Failed to load related products:', error);
      }
    };
    
    loadRelatedProducts();
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price / 100);
  };

  const formatSpecValue = (value: string) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) ? numValue.toFixed(2) : value;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <img 
                src="https://i.gifer.com/ZKZg.gif" 
                alt="Loading..." 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Product not found</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-12 lg:pt-24">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/collections" className="hover:text-primary transition-colors">Collections</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/collections/${product.subcategory?.slug || product.category?.slug}`} className="hover:text-primary transition-colors">
              {product.subcategory?.name || product.category?.name}
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
                onMouseMove={(e) => {
                  if (!mainImageRef.current) return;
                  const rect = mainImageRef.current.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPosition({ x, y });
                }}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => { setIsZooming(false); setZoomPosition({ x: 50, y: 50 }); }}
              >
                <img
                  src={product.images?.[selectedImage]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-contain bg-white transition-transform duration-300 ease-out"
                  style={{
                    transform: isZooming ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images?.map((image, index) => (
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
                      alt={product.name}
                      className="w-full h-full object-contain bg-white"
                    />
                  </button>
                )) || []}
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
                  to={`/collections/${product.subcategory?.slug || product.category?.slug}`}
                  className="text-sm text-primary uppercase tracking-wider hover:underline"
                >
                  {product.subcategory?.name || product.category?.name}
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

              {/* Key Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Specifications</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {product.specifications.slice(0, 3).map((spec) => (
                      <div key={spec.name} className="flex gap-2">
                        <span className="font-medium">{spec.name}:</span>
                        <span>{formatSpecValue(spec.value)}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const tabsSection = document.querySelector('[data-tabs-root]');
                      if (tabsSection) {
                        setActiveTab('specifications');
                        tabsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    More
                  </button>
                </div>
              )}

              <p className="text-muted-foreground">{product.shortDescription}</p>

              {/* Variants */}
              {product.variants?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variants?.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.inventory === 0}
                        className={cn(
                          'px-4 py-2 border rounded-sm transition-colors',
                          selectedVariant?.id === variant.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50',
                          !variant.inventory && 'opacity-50 cursor-not-allowed line-through'
                        )}
                      >
                        {variant.title}
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
                    {selectedVariant?.inventory || product.stockQuantity} in stock
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={async () => {
                    if (isAddingToCart) return;
                    setIsAddingToCart(true);
                    try {
                      await addItem(product, selectedVariant, quantity);
                    } catch (error) {
                      console.error('Error adding to cart:', error);
                    } finally {
                      setIsAddingToCart(false);
                    }
                  }}
                  disabled={!selectedVariant?.inventory && !product.inStock}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12"
                  onClick={async () => {
                    if (isAddingToWishlist) return;
                    setIsAddingToWishlist(true);
                    try {
                      await toggleItem(product);
                    } catch (error) {
                      console.error('Error adding to wishlist:', error);
                    } finally {
                      setIsAddingToWishlist(false);
                    }
                  }}
                >
                  {isAddingToWishlist ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current text-primary' : ''}`} />
                  )}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Free Shipping Over $1000</p>
                </div>
                {/* <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">2 Year Warranty</p>
                </div> */}
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-tabs-root>
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-4"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                data-value="specifications"
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
                {product.description && product.description.trim() ? (
                  product.description.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground">* This product contains no description</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="py-8">
              <div className="gap-4 max-w-[60%]">
                {product.specifications?.map((spec) => (
                  <div
                    key={spec.name}
                    className="grid grid-flow-row grid-cols-2 justify-start gap-5"
                  >
                    <span className="text-muted-foreground font-extrabold">{spec.name}</span>
                    <span className="font-medium">{formatSpecValue(spec.value)}</span>
                  </div>
                )) || <p className="text-muted-foreground">No specifications available.</p>}
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
            {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

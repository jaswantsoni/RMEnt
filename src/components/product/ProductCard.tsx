import { useState, useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/api';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = memo(function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, cart } = useCartStore();
  const { toggleItem, isInWishlist, fetchWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const inCart = cart?.items?.some(item => item.productId === product.id || item.product?.id === product.id);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);
  
  console.log('Rendering ProductCard for:', product);
  // Zoom state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price / 1); // Convert cents back to dollars
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative bg-card rounded-sm overflow-hidden luxury-border hover-lift">
        {/* Image Container with Zoom */}
        <Link 
          to={`/product/${product.item_id}`} 
          className="block relative aspect-square overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => { setIsZooming(false); setZoomPosition({ x: 50, y: 50 }); }}
        >
          <div ref={imageRef} className="w-full h-full">
            <img
              src={product.images?.[0]?.url || product.image_url || '/placeholder.svg'}
              alt={product.images?.[0]?.alt || product.name}
              loading={index < 4 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              width="400"
              height="400"
              className="w-full h-full object-contain transition-transform duration-500 ease-out bg-white"
              style={{
                transform: isZooming ? 'scale(1.5)' : 'scale(1)',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={async (e) => { 
                e.preventDefault();
                if (isAddingToWishlist) return;
                setIsAddingToWishlist(true);
                try {
                  await toggleItem(product);
                } finally {
                  setIsAddingToWishlist(false);
                }
              }}
              className={cn(
                "h-10 w-10 backdrop-blur-sm transition-all",
                inWishlist 
                  ? "bg-transparent border-0 opacity-100" 
                  : "bg-background/90 hover:bg-primary hover:text-primary-foreground opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
              )}
            >
              {isAddingToWishlist ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className={cn("h-5 w-5", inWishlist && "fill-current text-gradient-gold")} style={inWishlist ? { color: '#D4AF37' } : {}} />
              )}
            </Button>
            {inCart && (
              <div className="h-10 w-10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" style={{ color: '#D4AF37' }} />
              </div>
            )}
          </div>

          {/* Add to Cart Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-10">
            <Button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isAddingToCart) return;
                setIsAddingToCart(true);
                try {
                  await addItem(product);
                } finally {
                  setIsAddingToCart(false);
                }
              }}
              disabled={!product.inStock}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/collections/${product.subcategory?.slug || product.category?.slug || 'general'}`}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.subcategory?.name || product.category?.name}
            </p>
          </Link>
          <Link to={`/product/${product.item_id}`}>
            <h3 className="font-display text-lg font-medium text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3 w-3',
                    i < Math.floor(product.rating)
                      ? 'fill-primary text-primary'
                      : 'text-muted'
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              {formatPrice(product.rate || product.price || 0)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/types/api';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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
        {/* Image Container */}
        <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden">
          <img
            src={product.images[0]?.url || '/placeholder.svg'}
            alt={product.images[0]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.images[1] && (
            <img
              src={product.images[1].url}
              alt={product.images[1].alt || product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          
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
            {!product.inStock && (
              <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <Button
              onClick={(e) => {
                e.preventDefault();
                addItem(product);
              }}
              disabled={!product.inStock}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link to={`/collections/${product.category?.slug}`}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {product.category?.name}
            </p>
          </Link>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-display text-lg font-medium text-foreground mb-2 line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          {product.rating > 0 && (
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
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-foreground">
              {formatPrice(product.price)}
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
}

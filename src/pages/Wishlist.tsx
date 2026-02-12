import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = async (product: typeof items[0]) => {
    try {
      await addItem(product);
      toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.` });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to add item to cart', 
        variant: 'destructive' 
      });
    }
  };

  const handleRemove = async (productId: string, productName: string) => {
    try {
      await removeItem(productId);
      toast({ title: 'Removed', description: `${productName} has been removed from your wishlist.` });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to remove item', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              My <span className="text-gradient-gold">Wishlist</span>
            </h1>
            <p className="text-foreground/60">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-semibold mb-3">Your wishlist is empty</h2>
              <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                Start adding items you love to your wishlist. They'll be saved here for you to revisit later.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/collections">Browse Collections</Link>
              </Button>
            </motion.div>
          ) : (
            <>
              {/* Clear All Button */}
              <div className="flex justify-end mb-6">
                <Button
                  variant="ghost"
                  className="text-foreground/60 hover:text-destructive"
                  onClick={() => {
                    clearWishlist();
                    toast({ title: 'Wishlist cleared', description: 'All items have been removed.' });
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-card rounded-xl overflow-hidden border border-border/50"
                  >
                    <Link to={`/product/${product.item_id || product.slug}`} className="block relative aspect-square overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {product.compareAtPrice && (
                        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                          {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link to={`/product/${product.item_id || product.slug}`}>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-foreground/60 mt-1">{product.category?.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-semibold text-primary">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-foreground/40 line-through">
                            ${product.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border/50"
                          onClick={() => handleRemove(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

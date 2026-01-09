import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
  import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItemQuantity, removeItem, fetchCart } = useCartStore();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  console.log('Cart data in CartDrawer:', cart);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-display font-semibold">Shopping Bag</h2>
                {cart?.items?.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({cart.itemCount || cart.items.length} items)
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            {!cart?.items?.length ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-medium mb-2">Your bag is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Explore our collection and find something you love
                </p>
                <Button onClick={closeCart} asChild>
                  <Link to="/collections">Browse Collections</Link>
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {cart?.items?.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4"
                      >
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="flex-shrink-0"
                        >
                          <img
                            src={item.product?.images?.[0]?.url || '/placeholder.svg'}
                            alt={item.product?.name || 'Product'}
                            width="96"
                            height="96"
                            loading="lazy"
                            decoding="async"
                            className="w-24 h-24 object-cover rounded-sm"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product.slug}`}
                            onClick={closeCart}
                          >
                            <h4 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                              {item.product?.name || 'Product'}
                            </h4>
                          </Link>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.variant.name}
                            </p>
                          )}
                          <p className="font-semibold mt-2">{formatPrice(item.price || 0)}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-border rounded-sm">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateItemQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  updateItemQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Summary */}
                <div className="p-6 border-t border-border space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(cart?.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {cart?.shipping === 0 ? 'Free' : formatPrice(cart?.shipping || 30)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sale Tax (9.75%)</span>
                      <span>{formatPrice(cart?.tax || 0)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-gradient-gold text-lg">
                        {formatPrice(cart?.total || 0)}
                      </span>
                    </div>
                  </div>
                  {(cart?.subtotal || 0) < 50000 && (
                    <p className="text-xs text-center text-muted-foreground">
                      Add {formatPrice(50000 - (cart?.subtotal || 0))} more for free shipping
                    </p>
                  )}
                  {isAuthenticated ? (
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" onClick={closeCart} asChild>
                      <Link to="/checkout">Proceed to Checkout</Link>
                    </Button>
                  ) : (
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" onClick={closeCart} asChild>
                      <Link to="/auth?redirect=/checkout" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Login to Checkout
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={closeCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

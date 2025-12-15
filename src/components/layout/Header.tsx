import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Collections', href: '/collections' },
  { name: 'Lighting', href: '/collections/lighting' },
  { name: 'Ceiling Fans', href: '/collections/ceiling-fans' },
  { name: 'Bath Fittings', href: '/collections/bath-fittings' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cart, openCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border/50'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-wider">
                <span className="text-gradient-gold">AZZARO</span>
                <span className="text-foreground/80 text-lg md:text-xl ml-1">HOME</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'text-sm font-medium tracking-wide transition-colors duration-300',
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-primary'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary hidden sm:flex">
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground/70 hover:text-primary"
                onClick={openCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {cart && cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {cart.itemCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground/70"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[90vw] bg-card border-l border-border z-50"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-lg font-display font-semibold text-gradient-gold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <nav className="flex-1 p-6 space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'block py-3 text-lg font-medium transition-colors',
                        location.pathname === item.href
                          ? 'text-primary'
                          : 'text-foreground/70 hover:text-primary'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="p-6 border-t border-border space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <User className="h-5 w-5" />
                    Account
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

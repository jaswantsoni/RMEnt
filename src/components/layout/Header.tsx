import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingBag, User, Heart, Settings, ChevronDown, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MegaNavbar } from '../MegaNavbar';
import { CategoryCache } from '@/lib/categoryCache';
import { toast } from "sonner";

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { isAuthenticated, user } = useUserStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { CategoryApiService } = await import('@/lib/categoryApi');
        const fetchedCategories = await CategoryApiService.fetchCategories();
        const transformedCategories = fetchedCategories.map(cat => ({
          ...cat,
          name: cat.name,
          href: `/collections/${cat.slug}`,
          image: cat.image_url || '',
          subcategories: cat.subcategories?.map(sub => ({
            ...sub,
            name: sub.name,
            href: `/collections/${sub.slug}`,
            image: sub.image_url || ''
          })) || []
        }));
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-background/90 backdrop-blur-md'
            : 'bg-background/100'
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-display font-semibold tracking-wider">
                <span className="text-gradient-gold flex">
                <img src="/main.svg" width={36} height={32} alt="logo" className='mx-2' loading="eager" decoding="async" />
                  AZZARO HOME
                  </span>
                {/* <span className="text-foreground/80 text-lg md:text-xl ml-1">HOME</span> */}
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {/* <Link
                to="/"
                className={cn(
                  'text-lg font-medium tracking-wide transition-colors duration-300',
                  location.pathname === '/'
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-primary'
                )}
              >
                Home
              </Link> */}
              {/* Categories Dropdown */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                  'flex items-center gap-1 text-lg font-medium tracking-wide transition-colors duration-300',
                  location.pathname.includes('/collections')
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-primary'
                  )}>
                  Categories
                  <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem asChild>
                  <Link to="/collections" className="w-full cursor-pointer">
                  All Collections
                  </Link>
                  </DropdownMenuItem>
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.slug} asChild>
                    <Link to={`/collections/${cat.slug}`} className="w-full cursor-pointer">
                    {cat.name}
                    </Link>
                    </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                    </DropdownMenu> */}

            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* <Link
                to="/about"
                className={cn(
                  'text-lg font-medium tracking-wide transition-colors duration-300',
                  location.pathname === '/about'
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-primary'
                )}
                >
                About
              </Link> */}
              <Link
                to="/contact"
                className={cn(
                  'hidden md:block text-lg font-medium tracking-wide transition-colors duration-300',
                  location.pathname === '/contact'
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-gold'
                )}
                >
                Contact
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/70 hover:scale-110 hover:text-gold transition-transform duration-600 ease-out"
                onClick={() => navigate('/search')}
                >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/70 hover:scale-110 hover:text-gold transition-transform duration-600 ease-out"
                onClick={() => navigate('/wishlist')}
                >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground/70 hover:scale-110 hover:text-gold transition-transform duration-600 ease-out"
                onClick={() => navigate(isAuthenticated ? '/account' : '/auth')}
                >
                {isAuthenticated ? (
                  (() => {
                    const imageUrl = user?.avatar || user?.avatar_url;
                    return imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Profile" 
                        width="24"
                        height="24"
                        loading="lazy"
                        decoding="async"
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-foreground">
                        {user?.firstName?.[0] || user?.first_name?.[0] || user?.email?.[0] || 'U'}
                      </div>
                    );
                  })()
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/70 hover:scale-110 hover:text-gold transition-transform duration-600 ease-out"
                  onClick={() => navigate('/orders')}
                >
                  <Package className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground/70 hover:text-gold transition-colors"
                onClick={openCart}
                >
                <ShoppingBag className="h-5 w-5" />
                {cart && (cart.itemCount || cart.items?.length) > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    {cart.itemCount || cart.items?.length || 0}
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
        {/* <div className="container mx-auto px-4 lg:px-8"> */}
        <MegaNavbar
        categories={categories}
        showSearch={false}
        showUserIcon={false}
        showCartIcon={false}
        onSearchClick={() => toast("Search clicked")}
        onUserClick={() => toast("Account clicked")}
        onCartClick={() => toast("Cart clicked")}
        cartItemCount={2}
      />
        {/* <NavBar/> */}
        {/* </div> */}
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
                <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
                  <Link
                    to="/"
                    className={cn(
                      'block py-2 text-lg font-medium transition-colors',
                      location.pathname === '/'
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-primary'
                    )}
                  >
                    Home
                  </Link>
                  
                  {/* Categories Section */}
                  <div className="py-2">
                    <p className="text-lg text-muted-foreground mb-3 uppercase tracking-wider">Categories</p>
                    <div className="space-y-2 pl-2">
                      <Link
                        to="/collections"
                        className={cn(
                          'block py-1.5 text-base font-medium transition-colors',
                          location.pathname === '/collections'
                            ? 'text-primary'
                            : 'text-foreground/70 hover:text-primary'
                        )}
                      >
                        All Collections
                      </Link>
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/collections/${cat.slug}`}
                          className={cn(
                            'block py-1.5 text-base font-medium transition-colors',
                            location.pathname === `/collections/${cat.slug}`
                              ? 'text-primary'
                              : 'text-foreground/70 hover:text-primary'
                          )}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* <Link
                    to="/about"
                    className={cn(
                      'block py-2 text-lg font-medium transition-colors',
                      location.pathname === '/about'
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-primary'
                    )}
                  >
                    About
                  </Link> */}
                  <Link
                    to="/contact"
                    className={cn(
                      'block py-2 text-lg font-medium transition-colors',
                      location.pathname === '/contact'
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-gold'
                    )}
                  >
                    Contact
                  </Link>
                </nav>
                <div className="p-6 border-t border-border space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(isAuthenticated ? '/account' : '/auth');
                    }}
                  >
                    <User className="h-5 w-5" />
                    {isAuthenticated ? 'My Account' : 'Sign In'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/wishlist');
                    }}
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist ({wishlistItems.length})
                  </Button>
                  {isAuthenticated && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/orders');
                        }}
                      >
                        <Package className="h-5 w-5" />
                        Orders
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/admin');
                        }}
                      >
                        <Settings className="h-5 w-5" />
                        Admin Panel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

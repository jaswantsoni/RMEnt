import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavSubcategory {
  name: string;
  href: string;
  image?: string;
}

export interface NavCategory {
  name: string;
  href: string;
  subcategories?: NavSubcategory[];
  image?: string;
  featured?: {
    title: string;
    image: string;
    href: string;
  };
}

interface MegaNavbarProps {
  logo?: React.ReactNode;
  categories: NavCategory[];
  className?: string;
  showSearch?: boolean;
  showUserIcon?: boolean;
  showCartIcon?: boolean;
  onSearchClick?: () => void;
  onUserClick?: () => void;
  onCartClick?: () => void;
  cartItemCount?: number;
}

export function MegaNavbar({
  logo,
  categories,
  className,
  showSearch = true,
  showUserIcon = true,
  showCartIcon = true,
  onSearchClick,
  onUserClick,
  onCartClick,
  cartItemCount = 0,
}: MegaNavbarProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (categoryName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveCategory(categoryName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const activeCategoryData = categories.find((c) => c.name === activeCategory);
  console.log('Rendering MegaNavbar with categories:', activeCategoryData);
  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "relative bg-background border-b border-border z-50",
          className
        )}
      >
        {/* Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button - Hidden since Header handles mobile menu */}
            {/* <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button> */}

            {/* Logo */}
            {/* <div className="flex-shrink-0">
              {logo || (
                <a
                  href="/"
                  className="text-2xl font-serif tracking-widest text-foreground hover:text-primary transition-colors"
                >
                  ARHAUS
                </a>
              )}
            </div> */}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {categories.map((category) => (
                <div
                  key={category.name}
                  onMouseEnter={() => handleMouseEnter(category.name)}
                  onMouseLeave={handleMouseLeave}
                  className="relative"
                >
                  <a
                    href={category.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors",
                      activeCategory === category.name
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {category.name}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          activeCategory === category.name && "rotate-180"
                        )}
                      />
                    )}
                  </a>
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {showSearch && (
                <button
                  onClick={onSearchClick}
                  className="p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
              {showUserIcon && (
                <button
                  onClick={onUserClick}
                  className="p-2 text-foreground hover:text-primary transition-colors hidden sm:block"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </button>
              )}
              {showCartIcon && (
                <button
                  onClick={onCartClick}
                  className="p-2 text-foreground hover:text-primary transition-colors relative"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <div
          className={cn(
            "absolute left-0 right-0 bg-background border-b border-border shadow-lg transition-all duration-300 ease-out overflow-hidden z-50",
            activeCategory && activeCategoryData?.subcategories?.length
              ? "opacity-100 max-h-[500px]"
              : "opacity-0 max-h-0 pointer-events-none"
          )}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Subcategories */}
              <div className="col-span-8">
                <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                  {activeCategoryData?.subcategories?.map((sub) => (
                    <a
                      key={sub.name}
                      href={sub.href}
                      className="group flex items-center gap-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                      onMouseEnter={() => setHoveredSubcategory(sub.name)}
                      onMouseLeave={() => setHoveredSubcategory(null)}
                    >
                      {(sub.image) && (
                        <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={sub.image || activeCategoryData?.image}
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <span className="text-sm font-medium tracking-wide">
                        {sub.name}
                      </span>
                    </a>
                  ))}
                </div>
                
                {/* View All Link */}
                {activeCategoryData && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <a
                      href={activeCategoryData.href}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors tracking-wide uppercase"
                    >
                      View All {activeCategoryData.name}
                      <ChevronDown className="ml-1 h-4 w-4 -rotate-90" />
                    </a>
                  </div>
                )}
              </div>

              {/* Featured Image */}
              <div className="col-span-4">
                {(() => {
                  const hoveredSub = hoveredSubcategory ? activeCategoryData?.subcategories?.find(s => s.name === hoveredSubcategory) : null;
                  const displayImage = hoveredSub?.image || activeCategoryData?.image;
                  const displayTitle = hoveredSub?.name || activeCategoryData?.name;
                  const displayHref = hoveredSub?.href || activeCategoryData?.href;
                  
                  return displayImage ? (
                    <a
                      href={displayHref}
                      className="block group"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                        <img
                          src={displayImage}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-foreground font-medium text-lg">
                            {displayTitle}
                          </p>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        {displayTitle || 'Featured Content'}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Hidden since Header handles mobile navigation */}
      {/* <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-xl transition-transform duration-300",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-6 border-b border-border flex items-center justify-between">
            <span className="text-lg font-serif tracking-widest">MENU</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            {categories.map((category) => (
              <MobileNavItem
                key={category.name}
                category={category}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
}

interface MobileNavItemProps {
  category: NavCategory;
  onClose: () => void;
}

function MobileNavItem({ category, onClose }: MobileNavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-around">
        <a
          href={category.href}
          onClick={onClose}
          className="flex-1 px-6 py-4 text-sm font-medium tracking-wide uppercase text-foreground hover:text-primary transition-colors"
        >
          {category.name}
        </a>
        {category.subcategories && category.subcategories.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-4 text-foreground hover:text-primary transition-colors"
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Subcategories */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="bg-muted/30 py-2">
          {category.subcategories?.map((sub) => (
            <a
              key={sub.name}
              href={sub.href}
              onClick={onClose}
              className="block px-8 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
            >
              {sub.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MegaNavbar;

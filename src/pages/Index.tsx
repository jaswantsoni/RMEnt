import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product, Category } from '@/types/api';
import { ProductApiService } from '@/lib/productApi';
import { useProductStore } from '@/store/productStore';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePopupLoginListener } from '@/hooks/usePopupLoginListener';
import { resetToDefaultSEO } from '@/lib/seo';

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹2,000' },
  { icon: RefreshCw, title: 'Easy Returns', description: '14-day return policy' },
  { icon: Shield, title: 'Authentic Products', description: '100% genuine quality' },
  { icon: Sparkles, title: 'Premium Curation', description: 'Handpicked collections' },
];

const heroCollections = [
  {
    label: 'New Season',
    title: 'Women\'s Collection',
    subtitle: 'Effortless elegance for every occasion',
    href: '/collections/women',
    bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=90',
  },
  {
    label: 'Signature',
    title: 'Fine Jewellery',
    subtitle: 'Crafted to be cherished forever',
    href: '/collections/jewellery',
    bg: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=90',
  },
];

export default function Index() {
  usePopupLoginListener();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { setProducts: setStoreProducts } = useProductStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => { resetToDefaultSEO(); }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveHero(h => (h + 1) % heroCollections.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    ProductApiService.fetchProducts(50).then(products => {
      if (products.length > 0) {
        setFeaturedProducts(products.slice(0, 4));
        setStoreProducts(products);
      }
    });
  }, [setStoreProducts]);

  useEffect(() => {
    import('@/lib/categoryApi').then(({ CategoryApiService }) => {
      CategoryApiService.fetchCategories().then(fetched => {
        setCategories(fetched.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          image: cat.image_url || '',
          productCount: 0,
          href: `/collections/${cat.slug}`,
          subcategories: cat.subcategories?.map(sub => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description || '',
            image: sub.image_url || '',
            href: `/collections/${sub.slug}`,
          })) || [],
        })));
      });
    });
  }, []);

  const displayCategories = categories.length > 0 ? categories : [
    { id: '1', name: 'Women', slug: 'women', description: 'Dresses, sarees, kurtas & more', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', productCount: 0, href: '/collections/women' },
    { id: '2', name: 'Men', slug: 'men', description: 'Shirts, suits, kurtas & more', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80', productCount: 0, href: '/collections/men' },
    { id: '3', name: 'Jewellery', slug: 'jewellery', description: 'Necklaces, rings, earrings & more', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80', productCount: 0, href: '/collections/jewellery' },
    { id: '4', name: 'Accessories', slug: 'accessories', description: 'Bags, scarves, watches & more', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', productCount: 0, href: '/collections/accessories' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Hero — full-screen split */}
      <section className="relative min-h-screen flex items-end overflow-hidden pt-20">
        {heroCollections.map((hero, i) => (
          <motion.div
            key={hero.href}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === activeHero ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <img src={hero.bg} alt={hero.title} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </motion.div>
        ))}

        <div className="relative container mx-auto px-4 lg:px-8 pb-24">
          <motion.div
            key={activeHero}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 border border-primary/40 text-primary text-xs tracking-[0.25em] uppercase mb-6">
              {heroCollections[activeHero].label}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold leading-tight mb-4">
              {heroCollections[activeHero].title.split(' ').map((word, i) =>
                i === 0 ? <span key={i}>{word} </span> : <span key={i} className="text-gradient-gold">{word} </span>
              )}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-md">
              {heroCollections[activeHero].subtitle}
            </p>
            <div className="flex items-center gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-base" asChild>
                <Link to={heroCollections[activeHero].href}>
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 h-14 text-base border-foreground/20" asChild>
                <Link to="/collections">All Collections</Link>
              </Button>
            </div>
          </motion.div>

          {/* Dot indicators */}
          <div className="flex gap-2 mt-10">
            {heroCollections.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveHero(i)}
                className={cn('h-1 rounded-full transition-all duration-300', i === activeHero ? 'w-8 bg-primary' : 'w-4 bg-foreground/20')}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features bar */}
      <section className="border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 py-8 px-6"
              >
                <f.icon className="h-7 w-7 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground text-sm">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
              Shop by <span className="text-gradient-gold">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From everyday elegance to statement pieces — find your style
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {displayCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={cat.href || `/collections/${cat.slug}`}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-sm bg-card border border-border"
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 hidden md:block">{cat.description}</p>
                    <span className="inline-flex items-center text-primary text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                      Shop Now <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jewellery spotlight banner */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-sm aspect-[21/9] md:aspect-[21/6]"
          >
            <img
              src="https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=1600&q=85"
              alt="Jewellery Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">New Arrivals</p>
                <h3 className="text-3xl md:text-5xl font-display font-semibold mb-4">
                  Fine <span className="text-gradient-gold">Jewellery</span>
                </h3>
                <p className="text-muted-foreground mb-6 max-w-xs hidden md:block">
                  Timeless pieces crafted with precision and passion
                </p>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/collections/jewellery">Explore Jewellery <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-display font-semibold mb-4">
                  Featured <span className="text-gradient-gold">Products</span>
                </h2>
                <p className="text-muted-foreground max-w-xl">
                  Handpicked selections representing the pinnacle of design and craftsmanship
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/collections">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

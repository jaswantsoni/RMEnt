import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product, Category } from '@/types/api';

import { ShopifyApiService } from '@/lib/shopifyApi';
import { useProductStore } from '@/store/productStore';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
// Products will be loaded from Google Drive

const categories: Category[] = [
  { id: '1', name: 'Bath Fittings', slug: 'bath-fittings', description: 'Premium bathroom luxury', image: '', productCount: 0 },
  { id: '2', name: 'Hardware', slug: 'hardware', description: 'Quality hardware solutions', image: '', productCount: 0 },
  { id: '3', name: 'Lighting', slug: 'lighting', description: 'Illuminate your space with elegance', image: '', productCount: 0 },
  { id: '4', name: 'Fans', slug: 'fans', description: 'Premium comfort meets style', image: '', productCount: 0 },
  { id: '5', name: 'Home Decor', slug: 'home-decor', description: 'Elevate your living space', image: '', productCount: 0 },
  { id: '6', name: 'Furniture', slug: 'furniture', description: 'Timeless furniture pieces', image: '', productCount: 0 },
  { id: '7', name: 'Carpet & Rugs', slug: 'carpet-rugs', description: 'Luxurious floor coverings', image: '', productCount: 0 },
  { id: '8', name: 'Perfume', slug: 'perfume', description: 'Signature fragrances', image: '', productCount: 0 },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders above $5,000' },
  { icon: Shield, title: '2 Year Warranty', description: 'On all products' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Sparkles, title: 'Premium Quality', description: 'Handpicked products' },
];

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { setProducts: setStoreProducts } = useProductStore();

  useEffect(() => {
    // Load products from Shopify backend
    const loadProducts = async () => {
      try {
        const products = await ShopifyApiService.fetchProducts(50); // Fetch more products
        
        if (products.length > 0) {
          setFeaturedProducts(products.slice(0, 4)); // First 4 for featured
          setStoreProducts(products); // All products for store
        }
      } catch (error) {
        console.error('Failed to load Shopify products:', error);
      }
    };

    loadProducts();
  }, [setStoreProducts]);

  return (
    <div className="min-h-screen pt-18 min-w-[100vw] bg-background">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        {/* <ScrollingBackground images={[
          '/img/ChatGPT Image Dec 23, 2025, 04_46_12 AM.png'
        ]}/> */}

        <div className={cn("absolute inset-0")}>
              <img
                src={"/img/ChatGPT Image Dec 23, 2025, 04_46_12 AM.png"}
                alt={"test"}
                className={cn("w-full h-full object-cover")}
              />
              <div className={cn("absolute")} />
            </div>
        <div className="relative container px-4 lg:px-8 py-20 text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 border border-primary/30 text-primary text-sm tracking-widest uppercase mb-8">
              Luxury Home Decor
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold leading-tight mb-8">
              Elevate Your
              <br />
              <span className="text-gradient-gold">Living Space</span>
            </h1>
            <span className="text-xl text-left text-muted-foreground max-w-[50vw] mx-auto mb-12">
              Discover exquisite lighting, premium ceiling fans, and luxurious bath fittings<p/> 
              that transform your home into a masterpiece.
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-left gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-14 text-base"
                asChild
              >
                <Link to="/collections">
                  Explore Collections
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 h-14 text-base border-foreground/20 hover:bg-foreground/5"
                asChild
              >
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        {/* <img src="/img/ChatGPT Image Dec 23, 2025, 04_46_12 AM.png" className='mr-12' height={60} width={600}/> */}

        
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-border ">
        
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 py-8 px-6"
              >
                <feature.icon className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 backdrop-blur-sm ">
        {/* <ScrollingBackground images={[
          'bg/huy-nguyen-fQgYAnWVFeo-unsplash.jpg',
          'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1615875605825-5eb9bb5c609e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]}/> */}
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
              Explore our curated collections designed to elevate every corner of your home
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/collections/${category.slug}`}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-sm bg-card border border-border"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 hidden md:block">{category.description}</p>
                    <span className="inline-flex items-center text-primary text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                      Shop Now
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
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
                Handpicked selections that represent the pinnacle of design and craftsmanship
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/collections">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}

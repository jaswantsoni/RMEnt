import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product, Category } from '@/types/api';

import { loadPublicProducts } from '@/lib/publicProductLoader';
import { convertDriveImageUrl } from '@/lib/imageUtils';
import { useProductStore } from '@/store/productStore';
import { useState, useEffect } from 'react';

// Products will be loaded from Google Drive
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Aurora Crystal Chandelier',
    slug: 'aurora-crystal-chandelier',
    description: 'Elegant crystal chandelier with modern design',
    shortDescription: 'Modern crystal chandelier',
    price: 45999,
    compareAtPrice: 59999,
    currency: 'INR',
    images: [{ id: '1', url: 'https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800', alt: 'Crystal Chandelier', position: 0 }],
    category: { id: '1', name: 'Lighting', slug: 'lighting', description: '', image: '', productCount: 0 },
    categoryId: '1',
    variants: [],
    tags: ['luxury', 'crystal'],
    specifications: [],
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    name: 'Noir Industrial Pendant',
    slug: 'noir-industrial-pendant',
    description: 'Industrial style pendant light',
    shortDescription: 'Industrial pendant',
    price: 12999,
    currency: 'INR',
    images: [{ id: '2', url: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800', alt: 'Pendant Light', position: 0 }],
    category: { id: '1', name: 'Lighting', slug: 'lighting', description: '', image: '', productCount: 0 },
    categoryId: '1',
    variants: [],
    tags: ['industrial'],
    specifications: [],
    inStock: true,
    stockQuantity: 32,
    rating: 4.6,
    reviewCount: 89,
    featured: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    name: 'Royal Gold Ceiling Fan',
    slug: 'royal-gold-ceiling-fan',
    description: 'Premium ceiling fan with gold accents',
    shortDescription: 'Gold accent ceiling fan',
    price: 28999,
    compareAtPrice: 34999,
    currency: 'INR',
    images: [{ id: '3', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800', alt: 'Ceiling Fan', position: 0 }],
    category: { id: '2', name: 'Ceiling Fans', slug: 'ceiling-fans', description: '', image: '', productCount: 0 },
    categoryId: '2',
    variants: [],
    tags: ['premium'],
    specifications: [],
    inStock: true,
    stockQuantity: 8,
    rating: 4.9,
    reviewCount: 67,
    featured: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    name: 'Cascade Waterfall Faucet',
    slug: 'cascade-waterfall-faucet',
    description: 'Modern waterfall bathroom faucet',
    shortDescription: 'Waterfall faucet',
    price: 8499,
    currency: 'INR',
    images: [{ id: '4', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', alt: 'Faucet', position: 0 }],
    category: { id: '3', name: 'Bath Fittings', slug: 'bath-fittings', description: '', image: '', productCount: 0 },
    categoryId: '3',
    variants: [],
    tags: ['modern'],
    specifications: [],
    inStock: true,
    stockQuantity: 45,
    rating: 4.5,
    reviewCount: 156,
    featured: false,
    createdAt: '',
    updatedAt: '',
  },
];

const categories: Category[] = [
  {
    id: '1',
    name: 'Lighting',
    slug: 'lighting',
    description: 'Illuminate your space with elegance',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    productCount: 245,
  },
  {
    id: '2',
    name: 'Ceiling Fans',
    slug: 'ceiling-fans',
    description: 'Premium comfort meets style',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    productCount: 89,
  },
  {
    id: '3',
    name: 'Bath Fittings',
    slug: 'bath-fittings',
    description: 'Luxury for your bathroom',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
    productCount: 167,
  },
];

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹5,000' },
  { icon: Shield, title: '2 Year Warranty', description: 'On all products' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Sparkles, title: 'Premium Quality', description: 'Handpicked products' },
];

export default function Index() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts.slice(0, 4));
  const { setProducts: setStoreProducts } = useProductStore();

  useEffect(() => {
    // Load products from Google Drive on page load
    const loadProducts = async () => {
      try {
        const products = await loadPublicProducts();
        if (products.length > 0) {
          const formattedProducts: Product[] = products.slice(0, 4).map(p => ({
            id: p.id || p['Product ID'] || p['ID'] || 'unknown',
            name: p.name || p['Product Name'] || p['Name'] || p['PRODUCT NAME'] || 'Unnamed Product',
            slug: (p.name || p['Product Name'] || p['Name'] || 'unnamed-product').toLowerCase().replace(/\s+/g, '-'),
            description: p.description || p['Description'] || p['DESCRIPTION'] || '',
            shortDescription: (p.description || p['Description'] || '').substring(0, 50) + '...',
            price: (p.price || p['Price'] || p['PRICE'] || p['MRP'] || 0) * 100,
            currency: 'INR',
            images: [{ id: '1', url: convertDriveImageUrl(p.imageUrl || p['Image URL'] || p['IMAGE URL'] || ''), alt: p.name || 'Product', position: 0 }],
            category: { id: '1', name: p.category || p['Category'] || p['CATEGORY'] || 'General', slug: 'general', description: '', image: '', productCount: 0 },
            categoryId: '1',
            variants: [],
            tags: [],
            specifications: [],
            inStock: true,
            stockQuantity: 10,
            rating: 4.5,
            reviewCount: 50,
            featured: true,
            createdAt: '',
            updatedAt: '',
          }));
          setFeaturedProducts(formattedProducts);
          // Also store all products for detail page access
          const allFormattedProducts = products.map(p => ({
            id: p.id || p['Product ID'] || p['ID'] || 'unknown',
            name: p.name || p['Product Name'] || p['Name'] || p['PRODUCT NAME'] || 'Unnamed Product',
            slug: (p.name || p['Product Name'] || p['Name'] || 'unnamed-product').toLowerCase().replace(/\s+/g, '-'),
            description: p.description || p['Description'] || p['DESCRIPTION'] || '',
            shortDescription: (p.description || p['Description'] || '').substring(0, 50) + '...',
            price: (p.price || p['Price'] || p['PRICE'] || p['MRP'] || 0) * 100,
            currency: 'INR',
            images: [{ id: '1', url: convertDriveImageUrl(p.imageUrl || p['Image URL'] || p['IMAGE URL'] || ''), alt: p.name || 'Product', position: 0 }],
            category: { id: '1', name: p.category || p['Category'] || p['CATEGORY'] || 'General', slug: 'general', description: '', image: '', productCount: 0 },
            categoryId: '1',
            variants: [],
            tags: [],
            specifications: [],
            inStock: true,
            stockQuantity: 10,
            rating: 4.5,
            reviewCount: 50,
            featured: true,
            createdAt: '',
            updatedAt: '',
          }));
          setStoreProducts(allFormattedProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920"
            alt="Luxury Interior"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>

        <div className="relative container mx-auto px-4 lg:px-8 py-20 text-center">
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Discover exquisite lighting, premium ceiling fans, and luxurious bath fittings 
              that transform your home into a masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

        {/* Scroll indicator */}
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
      <section className="border-y border-border bg-card/50">
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
              Explore our curated collections designed to elevate every corner of your home
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/collections/${category.slug}`}
                  className="group block relative aspect-[4/5] overflow-hidden rounded-sm"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-2xl font-display font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <span className="inline-flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-card/30">
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

      {/* Luxury Banner */}
      <section className="py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920"
              alt="Luxury Interior"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-xl">
                  <span className="text-primary text-sm tracking-widest uppercase mb-4 block">
                    New Collection
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-semibold mb-6">
                    The Art of
                    <br />
                    <span className="text-gradient-gold">Illumination</span>
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Discover our latest collection of designer lighting fixtures, 
                    crafted to transform your space into a work of art.
                  </p>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    asChild
                  >
                    <Link to="/collections/lighting">
                      Explore Collection
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-semibold mb-16">
              What Our <span className="text-gradient-gold">Clients Say</span>
            </h2>
            <div className="max-w-3xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-display italic text-foreground/90 mb-8">
                "Azzaro Home transformed our living space beyond imagination. The quality and 
                attention to detail in their products is unmatched."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Client"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <p className="font-medium">Priya Sharma</p>
                  <p className="text-sm text-muted-foreground">Interior Designer, Mumbai</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

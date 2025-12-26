import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Loader2 } from 'lucide-react';
import { loadPublicProducts, type PublicProduct } from '@/lib/publicProductLoader';
import { convertDriveImageUrl } from '@/lib/imageUtils';
import { getCategoryInfo } from '@/lib/categoryUtils';
import { useProductStore } from '@/store/productStore';
import type { Product } from '@/types/api';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { setProducts: setStoreProducts } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const publicProducts = await loadPublicProducts();
        console.log('Public Products:', publicProducts);
        
        const formattedProducts: Product[] = publicProducts.map(p => {
          const categoryName = p.Category || p.category || p['CATEGORY'] || 'General';
          const categoryInfo = getCategoryInfo(categoryName);
          console.log('Category mapping:', categoryName, '→', categoryInfo); // Debug
          return {
            id: p.id || p['Product ID'] || p['ID'] || 'unknown',
            name: p.name || p['Product Name'] || p['Name'] || p['PRODUCT NAME'] || 'Unnamed Product',
            slug: (p.name || p['Product Name'] || p['Name'] || 'unnamed-product').toLowerCase().replace(/\s+/g, '-'),
            description: p.description || p['Description'] || p['DESCRIPTION'] || '',
            shortDescription: (p.description || p['Description'] || '').substring(0, 100) + '...',
            price: (p.price || p['Price'] || p['PRICE'] || p['MRP'] || 0) * 100,
            currency: 'USD',
            images: [{ id: '1', url: convertDriveImageUrl(p.imageUrl || p['Image URL'] || p['IMAGE URL'] || ''), alt: p.name || 'Product', position: 0 }],
            category: { 
              id: categoryInfo.id, 
              name: categoryName, 
              slug: categoryInfo.slug, 
              description: '', 
              image: '', 
              productCount: 0 
            },
            categoryId: categoryInfo.id,
            variants: [],
            tags: [],
            specifications: [],
            inStock: true,
            stockQuantity: 10,
            rating: 4.5,
            reviewCount: 50,
            featured: false,
            createdAt: '',
            updatedAt: '',
          };
        });

        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
        setStoreProducts(formattedProducts); // Store for product detail page
        
        // Extract unique categories
        const uniqueCategories = [...new Set(publicProducts.map(p => p.category).filter(Boolean))];
        setCategories(uniqueCategories);
        console.log("unique Categories", uniqueCategories)
        
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category.name === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading products from Google Drive...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-semibold mb-4">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of {products.length} premium products
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
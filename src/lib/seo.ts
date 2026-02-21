/**
 * SEO Utility Functions
 * Dynamically updates page title, meta tags, and Open Graph tags for better SEO
 */

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  brand?: string;
  category?: string;
}

/**
 * Update page title and meta tags for SEO
 */
export const updatePageSEO = (config: SEOConfig) => {
  const {
    title,
    description,
    keywords,
    image = 'https://staging.azzarohome.com/og-image.png',
    url = window.location.href,
    type = 'website',
    price,
    currency = 'USD',
    availability,
    brand = 'Azzaro Home',
    category,
  } = config;

  // Update page title
  document.title = title;

  // Helper function to update or create meta tag
  const updateMetaTag = (selector: string, content: string, attribute: 'name' | 'property' = 'name') => {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, selector.replace(/meta\[name="|meta\[property="|"\]/g, ''));
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Update standard meta tags
  updateMetaTag('meta[name="description"]', description);
  if (keywords) {
    updateMetaTag('meta[name="keywords"]', keywords);
  }

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = url;

  // Update Open Graph tags
  updateMetaTag('meta[property="og:title"]', title, 'property');
  updateMetaTag('meta[property="og:description"]', description, 'property');
  updateMetaTag('meta[property="og:image"]', image, 'property');
  updateMetaTag('meta[property="og:url"]', url, 'property');
  updateMetaTag('meta[property="og:type"]', type, 'property');
  updateMetaTag('meta[property="og:site_name"]', brand, 'property');

  // Update Twitter Card tags
  updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
  updateMetaTag('meta[name="twitter:title"]', title);
  updateMetaTag('meta[name="twitter:description"]', description);
  updateMetaTag('meta[name="twitter:image"]', image);

  // Product-specific meta tags (Schema.org)
  if (type === 'product' && price) {
    updateMetaTag('meta[property="product:price:amount"]', price.toString(), 'property');
    updateMetaTag('meta[property="product:price:currency"]', currency, 'property');
    
    if (availability) {
      updateMetaTag('meta[property="product:availability"]', availability, 'property');
    }
    
    if (brand) {
      updateMetaTag('meta[property="product:brand"]', brand, 'property');
    }
    
    if (category) {
      updateMetaTag('meta[property="product:category"]', category, 'property');
    }
  }
};

/**
 * Generate SEO-friendly product title
 */
export const generateProductTitle = (productName: string, category?: string, brand: string = 'Azzaro Home'): string => {
  const parts = [productName];
  
  if (category) {
    parts.push(category);
  }
  
  parts.push(brand);
  
  return parts.join(' | ');
};

/**
 * Generate SEO-friendly product description
 */
export const generateProductDescription = (
  productName: string,
  description: string,
  price: number,
  category?: string
): string => {
  const shortDesc = description.length > 155 
    ? description.substring(0, 152) + '...' 
    : description;
  
  const parts = [`Buy ${productName}`];
  
  if (category) {
    parts.push(`in ${category}`);
  }
  
  parts.push(`at $${price.toFixed(2)}.`);
  parts.push(shortDesc);
  
  return parts.join(' ');
};

/**
 * Generate keywords from product data
 */
export const generateProductKeywords = (
  productName: string,
  category?: string,
  subcategory?: string,
  tags: string[] = []
): string => {
  const keywords = [
    productName,
    'Azzaro Home',
    'luxury home decor',
    'premium lighting',
  ];
  
  if (category) {
    keywords.push(category);
  }
  
  if (subcategory) {
    keywords.push(subcategory);
  }
  
  keywords.push(...tags);
  
  return keywords.join(', ');
};

/**
 * Add JSON-LD structured data for products
 */
export const addProductStructuredData = (product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  sku: string;
  brand: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  category?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        '@type': 'Organization',
        name: product.brand,
      },
    },
  };

  // Add category if available
  if (product.category) {
    (structuredData as any).category = product.category;
  }

  // Add rating if available
  if (product.rating && product.reviewCount) {
    (structuredData as any).aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

/**
 * Reset to default SEO tags (for homepage)
 */
export const resetToDefaultSEO = () => {
  updatePageSEO({
    title: 'Azzaro Home - Premium Home Decor & Luxury Interiors',
    description: 'Discover premium home decor, luxury lighting, designer fans, and exquisite bath fittings at Azzaro Home. Transform your living space with curated elegance.',
    keywords: 'luxury home decor, premium lighting, designer ceiling fans, bath fittings, home accessories, interior design',
    type: 'website',
  });
};

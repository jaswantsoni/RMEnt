/**
 * SEO Utility — RMP Jewels & Women Clothing
 * Handles dynamic title, meta, Open Graph, Twitter Card, JSON-LD
 */

const BRAND = 'RMP Jewels & Women Clothing';
const DOMAIN = 'https://ekart24.com';
const DEFAULT_IMAGE = `${DOMAIN}/rmp-logo.png`;

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

// ── Core helper ───────────────────────────────────────────────────────────────
const setMeta = (selector: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    const key = selector.match(/\[(?:name|property)="([^"]+)"\]/)?.[1] || '';
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (url: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
};

// ── Main update function ──────────────────────────────────────────────────────
export const updatePageSEO = (config: SEOConfig) => {
  const {
    title,
    description,
    keywords,
    image = DEFAULT_IMAGE,
    url = window.location.href,
    type = 'website',
    price,
    currency = 'INR',
    availability,
    brand = BRAND,
    category,
  } = config;

  document.title = title;

  // Standard
  setMeta('meta[name="description"]', description);
  setMeta('meta[name="author"]', brand);
  if (keywords) setMeta('meta[name="keywords"]', keywords);
  setCanonical(url);

  // Open Graph
  setMeta('meta[property="og:title"]', title, 'property');
  setMeta('meta[property="og:description"]', description, 'property');
  setMeta('meta[property="og:image"]', image, 'property');
  setMeta('meta[property="og:url"]', url, 'property');
  setMeta('meta[property="og:type"]', type, 'property');
  setMeta('meta[property="og:site_name"]', brand, 'property');

  // Twitter
  setMeta('meta[name="twitter:card"]', 'summary_large_image');
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', image);
  setMeta('meta[name="twitter:site"]', '@rmpjewels');

  // Product-specific
  if (type === 'product' && price) {
    setMeta('meta[property="product:price:amount"]', price.toString(), 'property');
    setMeta('meta[property="product:price:currency"]', currency, 'property');
    if (availability) setMeta('meta[property="product:availability"]', availability, 'property');
    if (brand) setMeta('meta[property="product:brand"]', brand, 'property');
    if (category) setMeta('meta[property="product:category"]', category, 'property');
  }
};

// ── JSON-LD helpers ───────────────────────────────────────────────────────────
const setJsonLd = (data: object, id = 'dynamic') => {
  const existing = document.querySelector(`script[type="application/ld+json"][data-id="${id}"]`);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-id', id);
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

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
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand || BRAND },
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency || 'INR',
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      seller: { '@type': 'Organization', name: BRAND },
    },
  };
  if (product.category) data.category = product.category;
  if (product.rating && product.reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }
  setJsonLd(data);
};

export const addCollectionStructuredData = (name: string, description: string, url: string) => {
  setJsonLd({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: BRAND, url: DOMAIN },
  });
};

// ── Title / description generators ───────────────────────────────────────────
export const generateProductTitle = (name: string, category?: string): string =>
  [name, category, BRAND].filter(Boolean).join(' | ');

export const generateProductDescription = (
  name: string,
  description: string,
  price: number,
  category?: string
): string => {
  const short = description.length > 140 ? description.slice(0, 137) + '...' : description;
  const parts = [`Buy ${name}`];
  if (category) parts.push(`in ${category}`);
  parts.push(`at ₹${price.toLocaleString('en-IN')}.`);
  parts.push(short);
  return parts.join(' ');
};

export const generateProductKeywords = (
  name: string,
  category?: string,
  subcategory?: string,
  tags: string[] = []
): string => {
  const base = [
    name,
    BRAND,
    'RMP jewellery',
    'women clothing India',
    'premium jewels',
    'ethnic wear',
    'designer jewellery',
  ];
  if (category) base.push(category);
  if (subcategory) base.push(subcategory);
  return [...base, ...tags].join(', ');
};

export const generateCollectionKeywords = (category?: string): string => {
  const base = [
    BRAND,
    'women clothing',
    'jewellery online',
    'ethnic wear',
    'sarees',
    'lehengas',
    'necklaces',
    'earrings',
    'bridal jewellery',
    'ekart24',
  ];
  if (category) base.unshift(category);
  return base.join(', ');
};

// ── Page-level presets ────────────────────────────────────────────────────────
export const resetToDefaultSEO = () => {
  updatePageSEO({
    title: 'RMP Jewels & Women Clothing — Premium Fashion & Fine Jewellery',
    description:
      'Shop premium women\'s clothing and exquisite jewellery at RMP. Discover sarees, lehengas, kurtas, necklaces, earrings, bridal sets and more. Curated elegance at ekart24.com.',
    keywords:
      'RMP jewels, women clothing, jewellery online India, sarees, lehengas, ethnic wear, bridal jewellery, necklaces, earrings, ekart24',
    image: DEFAULT_IMAGE,
    url: DOMAIN,
    type: 'website',
  });

  setJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: DOMAIN,
    logo: DEFAULT_IMAGE,
    sameAs: ['https://www.instagram.com/rmpjewels/'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'hello@ekart24.com',
    },
  });
};

export const setCollectionSEO = (categoryName?: string) => {
  const name = categoryName || 'All Collections';
  updatePageSEO({
    title: `${name} — RMP Jewels & Women Clothing`,
    description: `Browse our ${name.toLowerCase()} collection. Premium quality clothing and jewellery handpicked for the discerning woman.`,
    keywords: generateCollectionKeywords(categoryName),
    url: `${DOMAIN}/collections${categoryName ? '/' + categoryName.toLowerCase().replace(/\s+/g, '-') : ''}`,
    type: 'website',
  });
  addCollectionStructuredData(
    `${name} — RMP`,
    `Shop ${name.toLowerCase()} at RMP Jewels & Women Clothing`,
    window.location.href
  );
};

export const setProductSEO = (product: {
  name: string;
  description: string;
  image_url?: string;
  rate?: number;
  sku?: string;
  inStock?: boolean;
  category?: { name: string };
  subcategory?: { name: string };
  tags?: string[];
  item_id?: string;
}) => {
  const price = product.rate || 0;
  const category = product.category?.name;
  const image = product.image_url || DEFAULT_IMAGE;
  const url = `${DOMAIN}/product/${product.item_id || ''}`;

  updatePageSEO({
    title: generateProductTitle(product.name, category),
    description: generateProductDescription(product.name, product.description, price, category),
    keywords: generateProductKeywords(product.name, category, product.subcategory?.name, product.tags),
    image,
    url,
    type: 'product',
    price,
    currency: 'INR',
    availability: product.inStock ? 'in stock' : 'out of stock',
    category,
  });

  addProductStructuredData({
    name: product.name,
    description: product.description,
    image,
    price,
    currency: 'INR',
    sku: product.sku || product.item_id || '',
    brand: BRAND,
    availability: product.inStock ? 'InStock' : 'OutOfStock',
    category,
    url,
  });
};

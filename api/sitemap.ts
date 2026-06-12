import type { VercelRequest, VercelResponse } from '@vercel/node';

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000/api';
const SITE_URL = process.env.VITE_SITE_URL || 'https://ekart24.com';

interface ProductImage {
  url: string;
  alt: string;
}

interface Product {
  slug: string;
  name: string;
  updatedAt: string;
  image_url?: string;
  images?: ProductImage[];
  category?: { name: string };
}

interface Category {
  slug: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}

// Fetch all products across all pages
async function fetchAllProducts(): Promise<Product[]> {
  const products: Product[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const res = await fetch(
      `${BACKEND_URL}/products?page=${page}&pageSize=${pageSize}`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!res.ok) break;

    const json: ApiResponse<PaginatedResponse<Product>> = await res.json();
    if (!json.success || !json.data?.items?.length) break;

    products.push(...json.data.items);

    if (page >= json.data.totalPages) break;
    page++;
  }

  return products;
}

// Fetch all categories
async function fetchAllCategories(): Promise<Category[]> {
  const res = await fetch(`${BACKEND_URL}/categories`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) return [];

  const json: ApiResponse<Category[]> = await res.json();
  return json.success ? json.data : [];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(products: Product[], categories: Category[]): string {
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0', lastmod: now },
    { url: '/collections', changefreq: 'daily', priority: '0.9', lastmod: now },
    { url: '/products', changefreq: 'daily', priority: '0.9', lastmod: now },
    { url: '/about', changefreq: 'monthly', priority: '0.5', lastmod: now },
    { url: '/contact', changefreq: 'monthly', priority: '0.5', lastmod: now },
    { url: '/faq', changefreq: 'monthly', priority: '0.4', lastmod: now },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: now },
    { url: '/shipping', changefreq: 'monthly', priority: '0.4', lastmod: now },
  ];

  const staticUrls = staticPages
    .map(
      (page) => `
  <url>
    <loc>${escapeXml(SITE_URL + page.url)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('');

  const categoryUrls = categories
    .map(
      (cat) => `
  <url>
    <loc>${escapeXml(`${SITE_URL}/collections/${cat.slug}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('');

  const productUrls = products
    .map((product) => {
      // Collect all images for this product (deduplicated)
      const imageSet = new Set<string>();
      if (product.image_url) imageSet.add(product.image_url);
      product.images?.forEach((img) => img.url && imageSet.add(img.url));

      const imageNodes = Array.from(imageSet)
        .slice(0, 10) // Google recommends max ~1000 images per page; 10 is plenty per product
        .map((imgUrl, i) => {
          const alt = product.images?.[i]?.alt || product.name;
          return `
    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
      <image:caption>${escapeXml(alt)}</image:caption>
    </image:image>`;
        })
        .join('');

      return `
  <url>
    <loc>${escapeXml(`${SITE_URL}/product/${product.slug}`)}</loc>
    <lastmod>${product.updatedAt ? new Date(product.updatedAt).toISOString() : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageNodes}
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls}
${categoryUrls}
${productUrls}
</urlset>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const [products, categories] = await Promise.all([
      fetchAllProducts(),
      fetchAllCategories(),
    ]);

    const xml = buildSitemap(products, categories);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // Cache for 1 hour on CDN, serve stale for up to 24h while revalidating
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);
  } catch (err) {
    console.error('[sitemap] Failed to generate sitemap:', err);
    res.status(500).send('Failed to generate sitemap');
  }
}

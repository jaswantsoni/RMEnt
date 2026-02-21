/**
 * Utility functions for creating SEO-friendly URLs
 */

/**
 * Convert text to URL-friendly slug
 * Example: "Crystal Chandelier 8-Light" -> "crystal-chandelier-8-light"
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

/**
 * Create SEO-friendly product slug from name and SKU
 * Format: product-name-sku
 * Example: "Crystal Chandelier" + "CHAN-123" -> "crystal-chandelier-chan-123"
 */
export const createProductSlug = (name: string, sku: string): string => {
  const namePart = slugify(name);
  const skuPart = slugify(sku);
  return `${namePart}-${skuPart}`;
};

/**
 * Extract SKU from product slug
 * Example: "crystal-chandelier-chan-123" -> "CHAN-123"
 */
export const extractSkuFromSlug = (slug: string): string => {
  // The SKU is typically at the end after the last dash
  // We need to handle cases where SKU might have dashes
  const parts = slug.split('-');
  
  // Try to find a pattern that looks like a SKU
  // SKUs often have numbers or specific patterns
  
  // For now, we'll take the last part if it has numbers
  // or the last 2-3 parts if they form a SKU pattern
  const lastPart = parts[parts.length - 1];
  
  // If last part has numbers, it's likely part of SKU
  if (/\d/.test(lastPart)) {
    // Check if we need more parts (e.g., "CHAN-123" was split to ["chan", "123"])
    const potentialSku = parts.slice(-2).join('-');
    return potentialSku.toUpperCase();
  }
  
  return lastPart.toUpperCase();
};

/**
 * Extract item ID from slug
 * The slug format is: product-name-sku-itemid
 * Example: "crystal-chandelier-chan-123-7936722000000146433"
 */
export const extractItemIdFromSlug = (slug: string): string => {
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Item IDs are typically long numeric strings
  if (/^\d{10,}$/.test(lastPart)) {
    return lastPart;
  }
  
  // If not found at the end, return the original slug
  // The backend will handle the lookup
  return slug;
};

/**
 * Create full product slug with item ID
 * Format: product-name-sku-itemid
 * Example: createFullProductSlug("Crystal Chandelier", "CHAN-123", "7936722000000146433")
 *          -> "crystal-chandelier-chan-123-7936722000000146433"
 */
export const createFullProductSlug = (name: string, sku: string, itemId: string): string => {
  const baseSlug = createProductSlug(name, sku);
  return `${baseSlug}-${itemId}`;
};

/**
 * Parse product slug to extract components
 */
export const parseProductSlug = (slug: string): {
  fullSlug: string;
  itemId: string;
  sku: string;
} => {
  const itemId = extractItemIdFromSlug(slug);
  const sku = extractSkuFromSlug(slug);
  
  return {
    fullSlug: slug,
    itemId,
    sku,
  };
};

/**
 * Get product URL using slug (preferred) or ID (fallback)
 */
export function getProductUrl(product: { slug?: string; id: number }): string {
  if (product.slug) {
    return `/product/${product.slug}`;
  }
  // Fallback to ID if slug doesn't exist (for backward compatibility)
  return `/product/${product.id}`;
}


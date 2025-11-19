// Product image utility - Using high-quality product images
// Supports Openclipart-style images and modern product photography

// Product image mapping based on product name keywords
const productImageKeywords: Record<string, string> = {
  // Electronics & Tech
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&auto=format&q=80',
  computer: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&auto=format&q=80',
  mouse: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop&auto=format&q=80',
  keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop&auto=format&q=80',
  phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&auto=format&q=80',
  smartphone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&auto=format&q=80',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop&auto=format&q=80',
  watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&auto=format&q=80',
  camera: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop&auto=format&q=80',
  headphone: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&auto=format&q=80',
  speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop&auto=format&q=80',
  
  // Clothing & Fashion
  shirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format&q=80',
  tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format&q=80',
  dress: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop&auto=format&q=80',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&auto=format&q=80',
  sneakers: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&auto=format&q=80',
  bag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&auto=format&q=80',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop&auto=format&q=80',
  
  // Home & Living
  furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=80',
  chair: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop&auto=format&q=80',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f7826?w=800&h=800&fit=crop&auto=format&q=80',
  book: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop&auto=format&q=80',
  
  // Sports & Fitness
  sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&auto=format&q=80',
  fitness: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&auto=format&q=80',
  ball: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=800&fit=crop&auto=format&q=80',
};

// Default product images with variety
const defaultProductImages = [
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&auto=format&q=80',
];

/**
 * Get product image URL based on product name
 * Uses keyword matching to find appropriate product images
 */
export function getProductImage(productName: string, productId?: number): string {
  const name = productName.toLowerCase();
  
  // Check for specific product keyword matches
  for (const [keyword, imageUrl] of Object.entries(productImageKeywords)) {
    if (name.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Use product ID to get a consistent image from default set
  if (productId) {
    const imageIndex = (productId - 1) % defaultProductImages.length;
    return defaultProductImages[imageIndex];
  }
  
  // Return first default image
  return defaultProductImages[0];
}

/**
 * Get product image gallery (multiple views)
 * Returns array of image URLs for product gallery
 */
export function getProductImageGallery(productName: string, productId: number): string[] {
  const baseImage = getProductImage(productName, productId);
  const baseUrl = baseImage.split('?')[0];
  const params = baseImage.split('?')[1] || '';
  
  // Generate variations by changing dimensions slightly
  // In production, you'd have actual different product images
  return [
    `${baseUrl}?w=800&h=800&fit=crop&auto=format&q=80`,
    `${baseUrl}?w=700&h=700&fit=crop&auto=format&q=80`,
    `${baseUrl}?w=900&h=900&fit=crop&auto=format&q=80`,
    `${baseUrl}?w=750&h=750&fit=crop&auto=format&q=80`,
  ];
}

/**
 * Get product image by category
 */
export function getProductImageByCategory(category: string, productId: number): string {
  const categories: Record<string, string[]> = {
    electronics: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop&auto=format&q=80',
    ],
    clothing: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop&auto=format&q=80',
    ],
    accessories: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&auto=format&q=80',
    ],
    home: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop&auto=format&q=80',
    ],
    sports: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=800&fit=crop&auto=format&q=80',
    ],
    books: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop&auto=format&q=80',
    ],
  };
  
  const categoryImages = categories[category.toLowerCase()] || defaultProductImages;
  const imageIndex = (productId - 1) % categoryImages.length;
  return categoryImages[imageIndex];
}

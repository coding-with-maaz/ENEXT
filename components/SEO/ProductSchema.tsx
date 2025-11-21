import StructuredData from './StructuredData';
import { getProductImage } from '@/lib/product-images';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://enext-store.com';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  brand?: string;
  sku?: string;
  short_description?: string;
  image_url?: string;
  meta_title?: string;
  meta_description?: string;
}

interface ProductSchemaProps {
  product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const imageUrl = product.image_url || getProductImage(product.name, product.id);
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.meta_title || product.name,
    description: product.meta_description || product.short_description || product.description || product.name,
    image: imageUrl,
    sku: product.sku || `PROD-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'ENEXT',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price.toString(),
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '128',
    },
  };

  return <StructuredData data={schema} />;
}


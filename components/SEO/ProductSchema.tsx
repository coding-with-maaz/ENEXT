import StructuredData from './StructuredData';
import { getProductImage } from '@/lib/product-images';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://enext-store.com';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductSchemaProps {
  product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const imageUrl = getProductImage(product.name, product.id);
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.name,
    image: imageUrl,
    sku: `PROD-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'ENEXT',
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


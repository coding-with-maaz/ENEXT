import type { Metadata } from 'next';
import { getProductImage } from '@/lib/product-images';
import { getProductUrl } from '@/lib/product-url';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://enext-store.com';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    // Try to fetch by slug first, fallback to ID
    let res = await fetch(`${siteUrl}/api/products/slug/${params.id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      // Fallback to ID-based route
      res = await fetch(`${siteUrl}/api/products/${params.id}`, {
        cache: 'no-store',
      });
    }
    
    if (!res.ok) {
      return {
        title: 'Product Not Found | ENEXT',
        description: 'The product you are looking for could not be found.',
      };
    }

    const data = await res.json();
    const product = data.success ? data.data : null;

    if (!product) {
      return {
        title: 'Product Not Found | ENEXT',
        description: 'The product you are looking for could not be found.',
      };
    }

    const productImage = getProductImage(product.name, product.id);
    const productUrl = getProductUrl(product);

    const productDescription = product.description || `Buy ${product.name} at the best price. High quality product with fast shipping.`;
    const ogDescription = product.description || `Buy ${product.name} at the best price.`;

    return {
      title: `${product.name} | ENEXT`,
      description: productDescription,
      keywords: [product.name, 'product', 'buy', 'online shopping', 'e-commerce'],
      openGraph: {
        title: `${product.name} | ENEXT`,
        description: ogDescription,
        type: 'website',
        url: `${siteUrl}${productUrl}`,
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: product.name || 'Product',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | ENEXT`,
        description: ogDescription,
        images: [productImage],
      },
      alternates: {
        canonical: productUrl,
      },
    };
  } catch (error) {
    return {
      title: 'Product | ENEXT',
      description: 'View product details and specifications.',
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


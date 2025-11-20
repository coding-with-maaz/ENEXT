import type { Metadata } from 'next';
import WebSiteSchema from '@/components/SEO/WebSiteSchema';

export const metadata: Metadata = {
  title: 'Shop - Browse All Products',
  description: 'Browse our complete collection of products. Find the best deals, filter by price, and discover new items. Fast shipping and secure checkout.',
  keywords: ['shop', 'products', 'browse', 'catalog', 'online shopping', 'e-commerce'],
  openGraph: {
    title: 'Shop - Browse All Products | ENEXT',
    description: 'Browse our complete collection of products. Find the best deals and discover new items.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop - Browse All Products | ENEXT',
    description: 'Browse our complete collection of products. Find the best deals and discover new items.',
  },
  alternates: {
    canonical: '/shop',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <WebSiteSchema />
      {children}
    </>
  );
}


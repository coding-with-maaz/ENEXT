import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about ENEXT - your trusted e-commerce platform. We offer the best products with fast delivery and excellent customer service.',
  keywords: ['about', 'company', 'e-commerce', 'online store', 'mission', 'values'],
  openGraph: {
    title: 'About Us | ENEXT',
    description: 'Learn more about ENEXT - your trusted e-commerce platform.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


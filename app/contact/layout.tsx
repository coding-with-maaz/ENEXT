import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ENEXT. We are here to help with any questions about our products, orders, or services. Contact our customer support team.',
  keywords: ['contact', 'support', 'customer service', 'help', 'get in touch'],
  openGraph: {
    title: 'Contact Us | ENEXT',
    description: 'Get in touch with ENEXT. We are here to help with any questions.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


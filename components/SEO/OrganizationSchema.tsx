import StructuredData from './StructuredData';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://enext-store.com';

export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ENEXT',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Modern e-commerce platform offering the latest products with best prices and fast delivery.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@enext-store.com',
    },
    sameAs: [
      'https://www.facebook.com/enext',
      'https://www.twitter.com/enext',
      'https://www.instagram.com/enext',
    ],
  };

  return <StructuredData data={schema} />;
}


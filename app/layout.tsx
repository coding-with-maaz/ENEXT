import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import ConditionalLayout from '@/components/ConditionalLayout'
import OrganizationSchema from '@/components/SEO/OrganizationSchema'
import WebSiteSchema from '@/components/SEO/WebSiteSchema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://enext-store.com'
const siteName = 'ENEXT'
const siteDescription = 'Shop the latest products with the best prices. Modern e-commerce experience with fast delivery and secure checkout.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ENEXT - Modern E-Commerce Store',
    template: '%s | ENEXT'
  },
  description: siteDescription,
  keywords: [
    'e-commerce',
    'online shopping',
    'next.js',
    'react',
    'typescript',
    'modern shopping',
    'online store',
    'shopping cart',
    'products',
    'retail'
  ],
  authors: [{ name: 'ENEXT Team' }],
  creator: 'ENEXT',
  publisher: 'ENEXT',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteName,
    title: 'ENEXT - Modern E-Commerce Store',
    description: siteDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ENEXT E-Commerce Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ENEXT - Modern E-Commerce Store',
    description: siteDescription,
    images: ['/og-image.jpg'],
    creator: '@enext_store',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <OrganizationSchema />
        <WebSiteSchema />
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}


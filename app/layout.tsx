import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import ConditionalLayout from '@/components/ConditionalLayout'

export const metadata: Metadata = {
  title: 'ENEXT - Modern E-Commerce Store',
  description: 'Shop the latest products with the best prices. Modern e-commerce experience with fast delivery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}


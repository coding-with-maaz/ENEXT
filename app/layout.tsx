import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import AnimatedNavbar from '@/components/AnimatedNavbar'
import Footer from '@/components/Footer'

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
          <AnimatedNavbar />
          <main className="pt-20" style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}


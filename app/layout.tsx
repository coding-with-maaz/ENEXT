import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ENEXT - Next.js with MySQL',
  description: 'A complete Next.js application with MySQL database integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


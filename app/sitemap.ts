import { MetadataRoute } from 'next'
import { executeQuery } from '@/lib/db'
import { PRODUCT_QUERIES } from '@/lib/queries'
import { getProductUrl } from '@/lib/product-url'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://enext-store.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl

  // Static routes
  const routes = [
    '',
    '/shop',
    '/cart',
    '/about',
    '/contact',
    '/orders',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Dynamic product routes - fetch from database
  let productRoutes: MetadataRoute.Sitemap = []
  
  try {
    const [products, error] = await executeQuery(PRODUCT_QUERIES.SELECT_ALL)
    
    if (!error && products && Array.isArray(products)) {
      productRoutes = products.map((product: any) => ({
        url: `${baseUrl}${getProductUrl(product)}`,
        lastModified: new Date(product.updated_at || product.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
    }
  } catch (error) {
    console.error('Error generating product sitemap:', error)
  }

  return [...routes, ...productRoutes]
}


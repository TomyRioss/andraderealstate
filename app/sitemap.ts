import type { MetadataRoute } from 'next'
import { listProperties } from '@/lib/pocketbase-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grupochalita.com'

  const properties = (await listProperties()).filter((property) => property.active)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/propiedades`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/toldos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${siteUrl}/propiedades/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...propertyRoutes]
}

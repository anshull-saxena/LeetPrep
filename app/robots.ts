import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hopefuel.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/demo/', '/demo-horizon/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

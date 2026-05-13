import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.cuinspace.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/en/private/', '/zh/private/', '/api/private/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

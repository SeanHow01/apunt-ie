import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://punt.ie';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/home', '/lessons/', '/settings', '/fireup', '/calculator'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

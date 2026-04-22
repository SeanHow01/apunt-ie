import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://punt.ie';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/news`, lastModified: new Date() },
    { url: `${baseUrl}/tools/loan-calculator`, lastModified: new Date() },
    { url: `${baseUrl}/tools/loan-comparison`, lastModified: new Date() },
  ];

  const articleRoutes: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${baseUrl}/news/${a.slug}`,
    lastModified: new Date(a.updated_at ?? new Date()),
  }));

  return [...staticRoutes, ...articleRoutes];
}

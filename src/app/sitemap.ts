import { categories } from '@/components/EventsSection';
import { createServer } from '@/lib/supabase/server';
import { MetadataRoute } from 'next';

const BASE_URL = 'https://techtrix.rcciit.org.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static top-level routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/teams`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/merchandise`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Event category pages
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/events/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic individual event pages from database
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createServer();
    const { data: events } = await supabase
      .from('events')
      .select('id, updated_at')
      .eq('reg_status', true);

    if (events) {
      eventRoutes = events.map((event) => ({
        url: `${BASE_URL}/event/${event.id}`,
        lastModified: event.updated_at
          ? new Date(event.updated_at)
          : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      }));
    }
  } catch {
    // If DB fetch fails, sitemap still works without individual event URLs
  }

  return [...staticRoutes, ...categoryRoutes, ...eventRoutes];
}

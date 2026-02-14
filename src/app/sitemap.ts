import { categories } from '@/components/EventsSection';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://techtrix.rcciit.org.in';

  // Static routes
  const routes = ['', '/#events', '/#about', '/#sponsors', '/#contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    })
  );

  // Dynamic event routes
  const eventRoutes = categories.map((category) => ({
    url: `${baseUrl}/events/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...eventRoutes];
}

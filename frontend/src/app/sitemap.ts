import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8000';

  const routes = [
    '',
    '/about',
    '/admissions',
    '/academics',
    '/contact',
    '/facilities',
    '/gallery',
    '/notices',
    '/events',
    '/downloads'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}

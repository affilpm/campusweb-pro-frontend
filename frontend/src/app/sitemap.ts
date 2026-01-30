import { MetadataRoute } from 'next';

interface Notice {
  id: number;
  slug: string;
  publish_date: string;
}

interface Facility {
  id: number;
  slug: string;
}

interface Event {
  id: number;
  slug: string;
  event_date: string;
}

async function getNotices(): Promise<Notice[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/notices/`, { 
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function getFacilities(): Promise<Facility[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/home/`, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.facilities || [];
  } catch {
    return [];
  }
}

async function getEvents(): Promise<Event[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/events/`, { 
      next: { revalidate: 300 }
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/admissions',
    '/academics',
    '/contact',
    '/facilities',
    '/gallery',
    '/notices',
    '/events',
    '/public-disclosure',
    '/public-disclosure/general',
    '/public-disclosure/documents',
    '/public-disclosure/fees',
    '/public-disclosure/infrastructure',
    '/public-disclosure/results-academics',
    '/privacy',
    '/terms',
  ];

  const staticSitemap: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic content
  const [notices, facilities, events] = await Promise.all([
    getNotices(),
    getFacilities(),
    getEvents(),
  ]);

  // Notice pages
  const noticeSitemap: MetadataRoute.Sitemap = notices.map((notice) => ({
    url: `${baseUrl}/notices/${notice.slug}`,
    lastModified: new Date(notice.publish_date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Facility pages
  const facilitySitemap: MetadataRoute.Sitemap = facilities
    .filter((f) => f.slug)
    .map((facility) => ({
      url: `${baseUrl}/facilities/${facility.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  // Event pages
  const eventSitemap: MetadataRoute.Sitemap = events
    .filter((e) => e.slug)
    .map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.event_date ? new Date(event.event_date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [
    ...staticSitemap,
    ...noticeSitemap,
    ...facilitySitemap,
    ...eventSitemap,
  ];
}

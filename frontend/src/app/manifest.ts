import { MetadataRoute } from 'next'
import { SiteSettings } from '@/lib/public-types'
import { getPageSEO } from '@/lib/seo-api'

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/layout/`, {
        next: { revalidate: 300 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.site_settings;
  } catch {
    return null;
  }
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Fetch both Site Settings and Home Page SEO
  const [settings, seo] = await Promise.all([
    getSiteSettings(),
    getPageSEO('home')
  ]);

  // Prioritize SEO Title/Description for the App Manifest to match Search Results
  // Fallback to Site Settings -> Default strings
  const name = seo?.title || settings?.school_name || 'Novel School India';
  
  // For short_name, prefer school_name as SEO title might be long (e.g. "Novel School | Best School in City")
  const shortName = settings?.school_name || seo?.title?.split('|')[0].trim() || 'Novel School';
  
  const description = seo?.meta_description || settings?.school_description || settings?.school_motto || 'Excellence in education at Novel School India.';
  
  // Icons usually come from Site Settings (Logo/Favicon), SEO OG Image is usually a banner, not an icon
  const icon = settings?.school_logo || '/logo.png';

  return {
    name: name,
    short_name: shortName.substring(0, 12),
    description: description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#1e40af', // Match brand blue
    icons: [
      {
        src: icon,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: icon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: icon,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: icon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}

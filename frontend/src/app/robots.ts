import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8000';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/secure-admin/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

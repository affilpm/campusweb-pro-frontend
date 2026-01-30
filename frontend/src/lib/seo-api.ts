
// -- SEO Helper --
import { PageSEO } from './public-types';

export const getPageSEO = async (slug: string): Promise<PageSEO | null> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Using native fetch for Better Next.js caching support
    const res = await fetch(`${apiUrl}/api/v1/school-info/seo/${slug}/`, {
      next: { revalidate: 300 },
    });
    
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`Failed to fetch SEO for ${slug}`);
    }
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching SEO for ${slug}:`, error);
    return null;
  }
};

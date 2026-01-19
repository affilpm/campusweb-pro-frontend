import { Metadata } from 'next';

import { getPageSEO } from '@/lib/seo-api';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('gallery');
  const title = 'Photo Gallery | School';
  const description = 'Explore our school photo gallery - capturing moments of learning, growth, and celebration from campus life and events.';

  if (seo) {
    return {
      title: seo.title || title,
      description: seo.meta_description || description,
      keywords: seo.meta_keywords?.split(',').map(k => k.trim()),
      openGraph: {
        title: seo.title || title,
        description: seo.meta_description || description,
        images: seo.og_image ? [seo.og_image] : undefined,
      }
    };
  }

  return {
    title,
    description,
  };
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

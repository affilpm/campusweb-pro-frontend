import { Metadata } from 'next';

import { getPageSEO } from '../../lib/seo-api';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('contact');
  
  if (seo) {
    return {
      title: seo.title || 'Contact Us | School',
      description: seo.meta_description || 'Get in touch with us. Find our address, phone number, email, and office hours. Send us a message for any inquiries about admissions, academics, or general information.',
      keywords: seo.meta_keywords ? seo.meta_keywords.split(',').map(k => k.trim()) : ['contact school', 'school address', 'school phone', 'school email', 'admissions inquiry'],
      openGraph: {
        title: seo.title || 'Contact Us | School',
        description: seo.meta_description,
        images: seo.og_image ? [seo.og_image] : undefined,
        type: 'website',
      },
    };
  }

  return {
    title: 'Contact Us | School',
    description: 'Get in touch with us. Find our address, phone number, email, and office hours. Send us a message for any inquiries about admissions, academics, or general information.',
    keywords: ['contact school', 'school address', 'school phone', 'school email', 'admissions inquiry'],
    openGraph: {
      title: 'Contact Us | School',
      description: 'Get in touch with us for any inquiries about admissions, academics, or general information.',
      type: 'website',
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

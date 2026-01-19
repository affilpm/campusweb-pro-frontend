import { ReactNode } from 'react';
import Header from '@/components/home/header';
import Footer from '@/components/home/footer';
import { LayoutData } from '@/lib/public-types';

async function getLayoutData(): Promise<LayoutData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/public/layout/`, { 
      cache: 'force-cache',
      next: { revalidate: 300 } 
    });

    if (!res.ok) {
      console.warn('Failed to fetch layout data', res.status);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching layout data:', error);
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const data = await getLayoutData();

  // Fallback if data fails - render children without header/footer or with static fallback?
  // Ideally we should have a static fallback or error state, but children might need context?
  // For now, render children. But Header is critical for navigation.
  if (!data) {
     return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <>
      <Header siteSettings={data.site_settings} />
      <div className="min-h-screen">
        {children}
      </div>
      <Footer siteSettings={data.site_settings} quickLinks={data.quick_links} />
    </>
  );
}

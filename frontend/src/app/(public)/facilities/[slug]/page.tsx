import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import FacilityClient, { FacilityDetail } from './FacilityClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fetch facility data
async function getFacility(slug: string): Promise<FacilityDetail | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/v1/school-info/facilities/${slug}/`, {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    
    if (!res.ok) return null;
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching facility:', error);
    return null;
  }
}

// Generate SEO metadata for the facility page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const facility = await getFacility(slug);
  
  if (!facility) {
    return { title: 'Facility Not Found' };
  }
  
  return {
    title: `${facility.name} | Our Facilities`,
    description: facility.short_description || `Explore our ${facility.name} facility.`,
    openGraph: {
      title: `${facility.name} | Our Facilities`,
      description: facility.short_description,
      images: facility.cover_image ? [facility.cover_image] : undefined,
    },
  };
}

export default async function FacilityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const facility = await getFacility(slug);

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">🏫</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Facility Not Found</h1>
          <p className="text-gray-600 mb-6">The facility you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/facilities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Facilities
          </Link>
        </div>
      </div>
    );
  }

  // Pass the data to the client component for animations
  return <FacilityClient facility={facility} />;
}

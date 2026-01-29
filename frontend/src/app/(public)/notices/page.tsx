import { Metadata } from 'next';
import Link from 'next/link';
import { Notice } from '@/lib/public-types';
import { getPageSEO } from '@/lib/seo-api';

// Dynamic metadata with SEO API (matching other pages like gallery, about, facilities)
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('notices');
  
  return {
    title: seo?.title || 'All Notices | School Website',
    description: seo?.meta_description || 'Latest updates, announcements and notices from our school.',
    openGraph: {
      title: seo?.title || 'All Notices | School Website',
      description: seo?.meta_description || 'Latest updates, announcements and notices from our school.',
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
  };
}

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    // Matching gallery/facilities caching strategy (no force-cache, just revalidate)
    const res = await fetch(`${apiUrl}/api/v1/communication/notices/?page=1`, { 
      next: { revalidate: 1 }, // ISR: revalidate every 1 second
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const notices: Notice[] = await res.json();

    return {
      notices
    };
  } catch (error) {
    console.error('Error fetching notices page data:', error);
    return null;
  }
}

export default async function NoticesPage() {
  const data = await getData();

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Page</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { notices } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header with Dark Background */}
      <div className="bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 pt-32 pb-20 lg:pt-40 lg:pb-28 relative overflow-hidden text-white">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
            <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Announcements
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            School Notice Board
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest announcements, circulars, and news from the school administration.
          </p>
        </div>
      </div>

      <div className="flex-grow py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Notices List */}
          <div className="space-y-4">
            {notices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <span className="text-4xl block mb-4">📭</span>
                <p className="text-gray-500 text-lg">No notices published yet.</p>
              </div>
            ) : (
              notices.map((notice) => (
                <Link 
                  key={notice.id}
                  href={`/notices/${notice.slug}`}
                  className="group block bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition-all duration-200"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                          {formatDate(notice.publish_date)}
                        </span>
                        {notice.is_important && (
                          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md uppercase tracking-wide">
                            Important
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {notice.title}
                      </h2>
                      <div className="prose prose-amber max-w-none text-gray-600 line-clamp-3">
                        {notice.content}
                      </div>
                      <div className="mt-4 flex items-center text-amber-600 font-medium text-sm">
                        <span>Read full notice</span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

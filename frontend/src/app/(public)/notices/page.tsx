import { Metadata } from 'next';
import Link from 'next/link';
import { Notice } from '@/lib/public-types';

import { getPageSEO } from '@/lib/seo-api';

export const metadata: Metadata = {
  title: 'All Notices | School Website',
  description: 'Latest updates, announcements and notices from our school.',
};

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(`${apiUrl}/api/public/notices/?page=1`, { 
      cache: 'force-cache',
      next: { revalidate: 300 },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

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
      <div className="pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            School Notice Board
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
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
                  href={`/notices/${notice.id}`}
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

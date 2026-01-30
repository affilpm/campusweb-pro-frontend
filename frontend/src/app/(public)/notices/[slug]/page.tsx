import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Notice } from '@/lib/public-types';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the notice page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const res = await fetch(`${apiUrl}/api/v1/communication/notices/${slug}/`);
    if (!res.ok) return { title: 'Notice Not Found' };
    
    const notice: Notice = await res.json();
    return {
      title: `${notice.title} | Notice`,
      description: notice.content.substring(0, 160),
    };
  } catch (error) {
    return { title: 'Notice' };
  }
}

async function getData(slug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    // Consistent caching strategy matching other pages (no force-cache)
    const noticeRes = await fetch(`${apiUrl}/api/v1/communication/notices/${slug}/`, { 
      next: { revalidate: 300 } // ISR: revalidate every 5 minutes
    });

    if (!noticeRes.ok) return null; // Handle 404 gracefully

    const notice: Notice = await noticeRes.json();

    return {
      notice
    };
  } catch (error) {
    console.error('Error fetching notice detail data:', error);
    return null;
  }
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) {
    notFound();
  }

  const { notice } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow pt-40 pb-12 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/notices" 
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Notices
            </Link>
          </div>

          {/* Notice Content */}
          <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-8 sm:p-10 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-sm font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {formatDate(notice.publish_date)}
                </span>
                {notice.is_important && (
                  <span className="text-sm font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full uppercase tracking-wide">
                    Important
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {notice.title}
              </h1>
            </div>

            {/* Body */}
            <div className="p-8 sm:p-10">
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {notice.content}
              </div>

              {/* Attachment */}
              {notice.attachment && (
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Attached Document
                  </h3>
                  <a 
                    href={notice.attachment} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white hover:border-amber-400 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-amber-700">Download Attachment</p>
                      <p className="text-xs text-gray-500 mt-0.5">Click to view or download</p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

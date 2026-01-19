import { Metadata } from 'next';
import { GalleryImage, LayoutData } from '@/lib/public-types';
import { getPageSEO } from '@/lib/seo-api';
import Header from '@/components/home/header';
import Footer from '@/components/home/footer';
import AnimatedSection from '@/components/ui/animated-section';
import GalleryGrid from '@/components/gallery/gallery-grid';

interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
}

interface GalleryData {
  categories: GalleryCategory[];
  images: GalleryImage[];
}

// Fetch gallery data with ISR caching
async function getGalleryData(): Promise<GalleryData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // Explicitly set limit to 50 to match frontend expectation
    const res = await fetch(`${apiUrl}/api/public/gallery/?limit=50`, {
      cache: 'force-cache',
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Error fetching gallery data:', error);
    return null;
  }
}

// Fetch layout data for header/footer
async function getLayoutData(): Promise<LayoutData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/layout/`, {
      cache: 'force-cache',
      next: { revalidate: 300 },
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Error fetching layout data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSEO('gallery');
  
  return {
    title: seo?.title || 'Photo Gallery',
    description: seo?.meta_description || 'View our school photo gallery',
    openGraph: {
      title: seo?.title || 'Photo Gallery',
      description: seo?.meta_description || 'View our school photo gallery',
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
  };
}

const defaultSettings = {
  school_name: 'School',
  school_motto: '',
  school_logo: null,
  favicon: null,
  address: '',
  phone: '',
  email: '',
  facebook_url: '',
  twitter_url: '',
  instagram_url: '',
  youtube_url: '',
  footer_text: ''
};

export default async function GalleryPage() {
  const [galleryData, layoutData] = await Promise.all([
    getGalleryData(),
    getLayoutData()
  ]);
  
  if (!galleryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📷</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gallery Coming Soon</h1>
          <p className="text-gray-600">Check back later for photos!</p>
        </div>
      </div>
    );
  }

  const siteSettings = layoutData?.site_settings || defaultSettings;
  const quickLinks = layoutData?.quick_links || [];

  return (
    <main className="overflow-hidden">
      <Header siteSettings={siteSettings} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-pink-400 rounded-full" />
              School Memories
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Capturing moments of learning, growth, and celebration
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Grid - Client Component for interactivity */}
      <GalleryGrid 
        categories={galleryData.categories} 
        images={galleryData.images} 
      />

      <Footer siteSettings={siteSettings} quickLinks={quickLinks} />
    </main>
  );
}

import { Metadata } from 'next';
import { HomepageData } from '@/lib/public-types';
import { getPageSEO } from '@/lib/seo-api';

import HeroSection from '@/components/home/hero-section';
import StatsSection from '@/components/home/stats-section';
import AboutSection from '@/components/home/about-section';
import PrincipalSection from '@/components/home/principal-section';
import FacilitiesSection from '@/components/home/facilities-section';
import AchievementsSection from '@/components/home/achievements-section';
import NoticesSection from '@/components/home/notices-section';
import EventsSection from '@/components/home/events-section';
import GallerySection from '@/components/home/gallery-section';
import CTASection from '@/components/home/cta-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import PublicDisclosureSection from '@/components/home/public-disclosure-section';
import ErrorRetry from '@/components/ui/error-retry';
// Fetch homepage data from Django API with ISR
async function getHomepageData(): Promise<HomepageData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/home/`, {
      next: { revalidate: 300 }, // ISR: revalidate every 60 seconds
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch homepage data');
    }
    
    return res.json();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching homepage data:', error);
    }
    return null;
  }
}

// Dynamic metadata based on site settings
export async function generateMetadata(): Promise<Metadata> {
  const [data, seo] = await Promise.all([
    getHomepageData(),
    getPageSEO('home')
  ]);
  
  if (seo) {
    // If title is just "Home", replace it with School Name for better SEO
    const effectiveTitle = (seo.title?.toLowerCase() === 'home' || !seo.title) 
      ? (data?.site_settings?.school_name || 'School Website')
      : seo.title;

    return {
      title: effectiveTitle,
      description: seo.meta_description || data?.site_settings?.school_description || data?.site_settings?.school_motto || 'Quality education for tomorrow\'s leaders',
      keywords: [
        ...(seo.meta_keywords ? seo.meta_keywords.split(',').map(k => k.trim()) : ['school', 'education', 'CBSE', 'academics', 'admissions']),
        // Inject local keywords if address is available
        ...(data?.site_settings?.address ? (() => {
          const parts = data.site_settings.address.split(',');
          // Attempt to find city/locality (usually 2nd or 3rd to last part)
          const city = parts.length > 1 ? parts[parts.length - 2].trim() : parts[0];
          return city ? [`School in ${city}`, `Best School in ${city}`, `Admissions in ${city}`] : [];
        })() : [])
      ],
      openGraph: {
        title: effectiveTitle,
        description: seo.meta_description || data?.site_settings?.school_description || data?.site_settings?.school_motto,
        images: seo.og_image ? [seo.og_image] : undefined,
        type: 'website',
      },
    };
  }

  return {
    title: data?.site_settings?.school_name || 'School Website',
    description: data?.site_settings?.school_description || data?.site_settings?.school_motto || 'Quality education for tomorrow\'s leaders',
    keywords: ['school', 'education', 'CBSE', 'academics', 'admissions'],
    openGraph: {
      title: data?.site_settings?.school_name,
      description: data?.site_settings?.school_description || data?.site_settings?.school_motto,
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const data = await getHomepageData();
  
  // Loading/Error State
  if (!data) {
    return (
      <ErrorRetry 
        title="Unable to Load Content"
        message="The homepage data could not be retrieved. We are trying to reconnect..."
        autoRetry={true}
      />
    );
  }

  const { 
    site_settings, 
    hero, 
    about, 
    principal, 
    notices, 
    events, 
    gallery, 
    facilities, 
    academics, 
    achievements,
    testimonials, 
    general_info,
    admission
  } = data;

  return (
    <main className="overflow-hidden">
      {/* Hero Section - Full screen with animations */}
      <HeroSection 
        data={hero} 
        schoolName={site_settings.school_name} 
        admissionOpen={admission?.is_open ?? false}
      />

      {/* Notices Banner - Animated ticker */}
      <NoticesSection notices={notices} />

      {/* Stats Section - Animated counters */}
      <StatsSection 
        stats={[
          { id: 'est', value: about.established_year?.toString() || '1990', label: 'Established' },
          { id: 'students', value: about.students_count || '2000+', label: 'Students' },
          { id: 'teachers', value: about.teachers_count || '100+', label: 'Teachers' },
          ...(academics || []).map(a => ({ id: `acad-${a.id}`, value: a.value, label: a.title }))
        ]}
      />

      {/* About Section - Interactive split layout */}
      <AboutSection data={about} />

      {/* Principal's Message - Premium card design */}
      <PrincipalSection data={principal} />

      {/* Facilities Section - Dynamic grid with hover effects */}
      <FacilitiesSection facilities={facilities} />

      {/* Achievements Section - Awards and Recognition */}
      <AchievementsSection achievements={achievements} />

      {/* Events Section - Horizontal slider */}
      <EventsSection events={events} />

      {/* Gallery Section - Masonry with lightbox */}
      <GallerySection images={gallery} />

      {/* CTA Section - Parallax background */}
      <CTASection admissionOpen={admission?.is_open ?? false} />

      {/* Testimonials Section - Interactive carousel */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Public Disclosure Section - Information table */}
      <PublicDisclosureSection items={general_info} />
    </main>
  );
}

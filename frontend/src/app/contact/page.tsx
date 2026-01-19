import { Metadata } from 'next';
import { ContactPageData, SiteSettings } from '@/lib/public-types';
import { renderHours } from '@/lib/utils';
import { getPageSEO } from '@/lib/seo-api';
import Header from '@/components/home/header';
import Footer from '@/components/home/footer';
import AnimatedSection from '@/components/ui/animated-section';
import ContactForm from '@/components/contact/contact-form';

// Fetch contact data with ISR caching
async function getContactData(): Promise<ContactPageData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/contact/`, {
      cache: 'force-cache',
      next: { revalidate: 300 }, // ISR: revalidate every 60 seconds
    });
    
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const [data, seo] = await Promise.all([
    getContactData(),
    getPageSEO('contact')
  ]);
  
  return {
    title: seo?.title || data?.title || 'Contact Us',
    description: seo?.meta_description || data?.subtitle || 'Get in touch with us',
    openGraph: {
      title: seo?.title || 'Contact Us',
      description: seo?.meta_description || 'Get in touch with us',
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
  };
}

const defaultSettings: SiteSettings = {
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

export default async function ContactPage() {
  const data = await getContactData();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to load content</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const siteSettings = data.site_settings || defaultSettings;
  const quickLinks = data.quick_links || [];

  // Parse phone numbers
  let phones: string[] = [siteSettings.phone];
  try {
    const parsed = JSON.parse(siteSettings.phone);
    if (Array.isArray(parsed)) phones = parsed;
    else phones = [String(parsed)];
  } catch { /* treat as single string */ }

  return (
    <main className="overflow-hidden">
      <Header siteSettings={siteSettings} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-800 via-slate-700 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {data.title || 'Contact Us'}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {data.subtitle || "We'd love to hear from you"}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <AnimatedSection>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  <p className="text-gray-600 text-lg">
                    Have a question or want to know more about our school? Reach out to us!
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">{siteSettings.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <div className="flex flex-col">
                        {phones.map((phone, idx) => (
                          <a key={idx} href={`tel:${phone}`} className="text-gray-600 hover:text-blue-600 transition-colors mb-1">
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a href={`mailto:${siteSettings.email}`} className="text-gray-600 hover:text-blue-600 transition-colors">
                        {siteSettings.email}
                      </a>
                    </div>
                  </div>
                </div>
                   
                {/* School Hours */}
                {data.school_hours && (
                  <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 mb-1">School Hours</h3>
                      <div className="whitespace-pre-line text-gray-600">
                        {renderHours(data.school_hours)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Office Hours */}
                {data.office_hours && (
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                      <div className="whitespace-pre-line text-gray-600">
                        {renderHours(data.office_hours)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Contact Form - Client Component */}
            <AnimatedSection delay={0.2}>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <ContactForm apiUrl={apiUrl} />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map */}
      {data.map_embed_code && (
        <section className="h-96 bg-gray-200">
          <div 
            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
            dangerouslySetInnerHTML={{ __html: data.map_embed_code }}
          />
        </section>
      )}

      <Footer siteSettings={siteSettings} quickLinks={quickLinks} />
    </main>
  );
}

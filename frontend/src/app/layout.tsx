import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#1e40af', // Primary school blue
  width: 'device-width',
  initialScale: 1,
};

import { SiteSettings } from "@/lib/public-types";

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/public/layout/`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.site_settings;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const schoolName = settings?.school_name || "Novel School";
  const schoolDescription = settings?.school_description || settings?.school_motto || "Excellence in education";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://novelschoolindia.com';
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: schoolName,
      template: `%s | ${schoolName}`
    },
    description: schoolDescription,
    keywords: ["school", "education", "learning", "academic", "students", schoolName],
    icons: {
      icon: settings?.favicon || settings?.school_logo || "/logo.png",
      apple: settings?.school_logo || "/logo.png",
      shortcut: settings?.favicon || settings?.school_logo || "/logo.png",
    },
    manifest: "/manifest.webmanifest",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: schoolName,
      title: schoolName,
      description: schoolDescription,
      images: settings?.school_logo ? [settings.school_logo] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: schoolName,
      description: schoolDescription,
      images: settings?.school_logo ? [settings.school_logo] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://novelschoolindia.com';

  // Parse potential multiple phone numbers
  let telephone: string | string[] = settings?.phone || "";
  if (settings?.phone) {
    try {
      const parsed = JSON.parse(settings.phone);
      if (Array.isArray(parsed)) {
        telephone = parsed;
      }
    } catch {
      // Fallback to string if not JSON
      telephone = settings.phone;
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* JSON-LD Structured Data for School */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "School",
              "name": settings?.school_name || "Novel School",
              "url": siteUrl,
              "logo": settings?.school_logo || `${siteUrl}/logo.png`,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": settings?.address || ""
              },
              "telephone": telephone,
              "email": settings?.email || "",
              "sameAs": [
                settings?.facebook_url,
                settings?.twitter_url,
                settings?.instagram_url,
                settings?.youtube_url,
                settings?.linkedin_url
              ].filter(Boolean)
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}

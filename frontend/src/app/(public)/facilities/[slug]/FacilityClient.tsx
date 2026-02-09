'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface FacilityImage {
  id: number;
  image: string;
  caption: string;
  order: number;
}

export interface FacilityDetail {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  icon: string;
  cover_image: string | null;
  gallery_images: FacilityImage[];
}

interface FacilityClientProps {
  facility: FacilityDetail;
}

export default function FacilityClient({ facility }: FacilityClientProps) {
  const [selectedImage, setSelectedImage] = useState<FacilityImage | null>(null);

  return (
    <main className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {facility.cover_image ? (
          <>
            <Image 
              src={facility.cover_image} 
              alt={facility.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[200px] opacity-20">{facility.icon}</span>
          </div>
        )}

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col justify-end pb-12">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-white/70 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li>/</li>
              <li><Link href="/facilities" className="hover:text-white transition-colors">Facilities</Link></li>
              <li>/</li>
              <li className="text-white font-medium">{facility.name}</li>
            </ol>
          </nav>

          {/* Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-4xl">{facility.icon}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              {facility.name}
            </h1>
          </div>

          <p className="text-xl text-white/80 max-w-3xl">
            {facility.short_description}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Facility</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {facility.long_description ? (
                  facility.long_description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{facility.short_description}</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Facility Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{facility.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Facility Type</p>
                      <p className="font-semibold text-gray-900">{facility.name}</p>
                    </div>
                  </div>
                  {facility.gallery_images.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">📷</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gallery</p>
                        <p className="font-semibold text-gray-900">{facility.gallery_images.length} Photos</p>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/facilities"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  All Facilities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {facility.gallery_images.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {facility.gallery_images.map((img, idx) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md aspect-square"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image 
                    src={img.image} 
                    alt={img.caption || `${facility.name} - Image ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Caption on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-medium text-sm line-clamp-2">
                      {img.caption || facility.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage.image}
              alt={selectedImage.caption || facility.name}
              className="max-w-full max-h-[80vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            {selectedImage.caption && (
              <p className="absolute bottom-6 left-0 right-0 text-center text-white text-lg">
                {selectedImage.caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

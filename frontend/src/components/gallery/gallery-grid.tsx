'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryImage } from '@/lib/public-types';
import AnimatedSection from '@/components/ui/animated-section';

interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
}

interface GalleryGridProps {
  categories: GalleryCategory[];
  images: GalleryImage[];
  initialCategory?: string;
}

export default function GalleryGrid({ categories, images, initialCategory = 'all' }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = images.filter(img => 
    selectedCategory === 'all' || img.category_name === selectedCategory
  );

  return (
    <>
      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat.name
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Images Yet</h3>
              <p className="text-gray-600">Check back soon for updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, idx) => (
                <AnimatedSection key={image.id} delay={Math.min(idx * 0.03, 0.3)}>
                  <motion.div
                    className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md aspect-square"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm">{image.title}</h3>
                      {image.category_name && (
                        <span className="text-white/70 text-xs">{image.category_name}</span>
                      )}
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              className="max-w-4xl max-h-[80vh] mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                {selectedImage.caption && (
                  <p className="text-white/70 mt-2">{selectedImage.caption}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

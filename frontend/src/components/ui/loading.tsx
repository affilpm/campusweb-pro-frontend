'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const dotDelay = [0, 0.2, 0.4];

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      {/* Animated Logo Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-4 border-blue-200`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner pulsing dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={`${size === 'lg' ? 'w-4 h-4' : size === 'md' ? 'w-2.5 h-2.5' : 'w-2 h-2'} bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full`} />
        </motion.div>
        
        {/* Orbiting dot */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${size === 'lg' ? 'w-3 h-3' : 'w-2 h-2'} bg-blue-500 rounded-full shadow-lg`} />
        </motion.div>
      </div>

      {/* Loading text with animated dots */}
      {text && (
        <div className="flex items-center gap-1">
          <span className="text-gray-600 font-medium text-sm">{text}</span>
          <div className="flex gap-0.5">
            {dotDelay.map((delay, i) => (
              <motion.span
                key={i}
                className="w-1 h-1 bg-blue-500 rounded-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Page loading skeleton that matches the site design
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton with shimmer effect */}
      <div className="relative pt-12 pb-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 overflow-hidden">
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        
        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <div className="h-10 bg-white/20 rounded-xl w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-5 bg-white/10 rounded-lg w-96 max-w-full mx-auto animate-pulse" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-40 bg-gray-100 rounded-xl mb-4 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation loading overlay (improved version)
export function NavigationLoader({ logo }: { logo?: string | null }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/95 backdrop-blur-md p-8 rounded-3xl flex flex-col items-center gap-5 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Animated school logo placeholder */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {logo ? (
              <Image 
                src={logo} 
                alt="Loading..." 
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-3xl">🎓</span>
              </div>
            )}
          </motion.div>
          
          {/* Progress ring */}
          <svg className="absolute -inset-2 w-20 h-20" viewBox="0 0 80 80">
            <motion.circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-lg">Loading</p>
          <motion.p
            className="text-gray-500 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Please wait...
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

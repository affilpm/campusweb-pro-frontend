'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { SiteSettings } from '@/lib/public-types';
import { NavigationLoader } from '@/components/ui/loading';

interface HeaderProps {
  siteSettings: SiteSettings;
}

export default function Header({ siteSettings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);
  const [isPhoneDropdownOpen, setIsPhoneDropdownOpen] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lastToggleTime = useRef<number>(0);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      // Close phone dropdown when scrolling to prevent overlap with header
      if (window.scrollY > 50) {
        setIsPhoneDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open (prevents iOS Safari issues)
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save current scroll position before locking
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Get the saved scroll position from body.style.top
      const scrollY = document.body.style.top;
      // Reset body styles first
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      // Restore scroll position if we had one saved
      if (scrollY) {
        window.scrollTo({
          top: parseInt(scrollY, 10) * -1,
          behavior: 'instant'
        });
      }
    }
    return () => {
      // Cleanup on unmount - restore scroll position if menu was open
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo({
          top: parseInt(scrollY, 10) * -1,
          behavior: 'instant'
        });
      }
    };
  }, [isMobileMenuOpen]);

  // Debounced toggle with animation guard
  const toggleMobileMenu = useCallback(() => {
    const now = Date.now();
    // Debounce: ignore clicks within 50ms (iOS-friendly short debounce)
    if (now - lastToggleTime.current < 50) return;
    
    lastToggleTime.current = now;
    setIsMobileMenuOpen(prev => !prev);
  }, []);



  // Optimized navigation handler for mobile - navigate immediately
  const handleNavigation = useCallback((href: string) => {
    if (isNavigating) return;
    
    // If already on this page, just close the menu
    if (pathname === href) {
      setIsMobileMenuOpen(false);
      setOpenMobileSubMenu(null);
      return;
    }
    
    // Show loading state but KEEP menu open until navigation completes
    setIsNavigating(true);
    // We do NOT close the menu here anymore - it will close in the useEffect when pathname changes
    // This allows the loading overlay to be visible while the new page loads
    
    // Navigate immediately
    requestAnimationFrame(() => {
      router.push(href);
    });
  }, [pathname, router, isNavigating]);

  // Reset navigation state and close menu when pathname changes (navigation completed)
  useEffect(() => {
    setIsNavigating(false);
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu(null);
    // Aggressively clean up any scroll locks
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  }, [pathname]);

  // Safety timeout for navigation - prevents infinite loading state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isNavigating) {
      timeout = setTimeout(() => {
        setIsNavigating(false);
        // Also cleanup scroll just in case
        document.body.style.overflow = '';
      }, 8000); // 8 seconds max loading time
    }
    return () => clearTimeout(timeout);
  }, [isNavigating]);

  // Simple close for non-navigation actions (like backdrop click)
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu(null);
  }, []);

  interface NavLink {
    name: string;
    href: string;
    subItems?: { name: string; href: string }[];
  }

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'Admissions', href: '/admissions' },
    {
      name: 'Public Disclosure',
      href: '/public-disclosure',
      subItems: [
        { name: 'General', href: '/public-disclosure/general' },
        { name: 'Documents and Information', href: '/public-disclosure/documents' },
        { name: 'Results and Academics', href: '/public-disclosure/results-academics' },
        { name: 'Infrastructure', href: '/public-disclosure/infrastructure' },
        { name: 'Fees', href: '/public-disclosure/fees' },
      ]
    },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r ${
        pathname.startsWith('/academics') ? 'from-teal-900 to-emerald-900'
        : pathname.startsWith('/contact') ? 'from-amber-900 to-orange-900'
        : pathname.startsWith('/notices') ? 'from-purple-900 to-violet-900'
        : 'from-blue-900 to-indigo-900'
      } text-white text-sm transition-transform duration-[400ms] ease-out will-change-transform ${isScrolled ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {(() => {
                let phones = [siteSettings.phone];
                try {
                    const parsed = JSON.parse(siteSettings.phone);
                    if (Array.isArray(parsed)) phones = parsed;
                    else phones = [String(parsed)];
                } catch { /* treat as string */ }

                if (phones.length > 1) {
                    return (
                        <div className="relative">
                            <button 
                                onClick={() => setIsPhoneDropdownOpen(!isPhoneDropdownOpen)}
                                className="flex items-center gap-2 hover:text-amber-300 transition-colors py-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="font-medium">Call Us</span>
                                <svg className={`w-3 h-3 opacity-70 transition-transform ${isPhoneDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {/* Dropdown */}
                            {isPhoneDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl overflow-hidden py-1 border border-blue-100 z-[70]">
                                    {phones.map((phone, idx) => (
                                        <a 
                                            key={idx} 
                                            href={`tel:${phone}`} 
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-0"
                                            onClick={() => setIsPhoneDropdownOpen(false)}
                                        >
                                            <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {phone}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                }

                // Single phone fallback
                return (
                    <a href={`tel:${phones[0]}`} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="hidden sm:inline">{phones[0]}</span>
                    </a>
                );
            })()}
            <a href={`mailto:${siteSettings.email}`} className="hidden md:flex items-center gap-2 hover:text-amber-300 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {siteSettings.email}
            </a>
          </div>
          
          {/* Social Media Icons - More Visible with Colors */}
          <div className="flex items-center gap-4">
            {siteSettings.facebook_url && (
              <a 
                href={siteSettings.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 transition-all hover:scale-110"
                title="Facebook"
                aria-label="Visit our Facebook page"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
            )}
            {siteSettings.twitter_url && (
              <a 
                href={siteSettings.twitter_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-400 transition-all hover:scale-110"
                title="Twitter"
                aria-label="Visit our Twitter profile"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            )}
            {siteSettings.instagram_url && (
              <a 
                href={siteSettings.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-500 hover:via-pink-400 hover:to-orange-300 transition-all hover:scale-110"
                title="Instagram"
                aria-label="Visit our Instagram profile"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            )}
            {siteSettings.youtube_url && (
              <a 
                href={siteSettings.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 transition-all hover:scale-110"
                title="YouTube"
                aria-label="Visit our YouTube channel"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header 
        className={`fixed left-0 right-0 z-50 will-change-transform ${
          isScrolled 
            ? 'top-0 bg-white/95 backdrop-blur-md shadow-lg' 
            : 'top-[52px] bg-transparent'
        }`}
        style={{
          transition: 'top 400ms ease-out, background-color 400ms ease-out, box-shadow 400ms ease-out'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Left side - Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileMenu}
                onTouchEnd={(e) => { e.preventDefault(); toggleMobileMenu(); }}
                className={`lg:hidden p-2 rounded-lg touch-manipulation select-none ${isScrolled ? 'text-gray-900' : 'text-white'}`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-3">
                {siteSettings.school_logo ? (
                  <div className="relative h-12 w-12 lg:h-14 lg:w-14">
                    <Image 
                      src={siteSettings.school_logo} 
                      alt="Logo" 
                      fill
                      className="object-contain"
                      sizes="56px"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl lg:text-2xl">🎓</span>
                  </div>
                )}
                <div>
                  <h1 className={`font-extrabold tracking-wide text-sm sm:text-lg leading-none ${isScrolled ? 'text-[#1a56a6]' : 'text-white'}`}>
                    {siteSettings.school_name}
                  </h1>
                  <p className={`text-[10px] sm:text-xs font-medium tracking-wide mt-0.5 ${isScrolled ? 'text-[#1a56a6]' : 'text-blue-100'}`}>
                    {siteSettings.school_motto}
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.subItems && pathname.startsWith(link.href));
                const hasSubItems = link.subItems && link.subItems.length > 0;
                
                return (
                  <div key={link.name} className="relative group">
                    <Link
                      href={link.href}
                      className={`font-medium transition-colors relative flex items-center gap-1 ${
                        isActive 
                          ? (isScrolled 
                              ? (pathname.startsWith('/academics') ? 'text-teal-600' 
                                : pathname.startsWith('/contact') ? 'text-amber-600'
                                : pathname.startsWith('/notices') ? 'text-purple-600'
                                : 'text-blue-600') 
                              : (pathname.startsWith('/academics') ? 'text-emerald-400' 
                                : pathname.startsWith('/contact') ? 'text-amber-400'
                                : pathname.startsWith('/notices') ? 'text-purple-300'
                                : 'text-amber-400'))
                          : (isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white/90 hover:text-white')
                      }`}
                    >
                      {link.name}
                      {hasSubItems && (
                        <svg className={`w-4 h-4 transition-transform group-hover:rotate-180`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                      <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      } ${
                        isScrolled 
                          ? (pathname.startsWith('/academics') ? 'bg-teal-600' 
                            : pathname.startsWith('/contact') ? 'bg-amber-600'
                            : pathname.startsWith('/notices') ? 'bg-purple-600'
                            : 'bg-blue-600')
                          : (pathname.startsWith('/academics') ? 'bg-emerald-400' 
                            : pathname.startsWith('/contact') ? 'bg-amber-400'
                            : pathname.startsWith('/notices') ? 'bg-purple-300'
                            : 'bg-amber-400')
                      }`} />
                    </Link>

                    {/* Dropdown Menu */}
                    {hasSubItems && (
                      <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pt-2">
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden py-2 border border-blue-100">
                          {link.subItems?.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`block px-4 py-3 text-sm transition-colors border-l-2 ${
                                  isSubActive
                                    ? 'bg-blue-50 text-blue-600 border-blue-600 font-medium'
                                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-transparent hover:border-blue-600'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Notification Bell */}
              <Link
                href="/notices"
                className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
                  pathname.startsWith('/notices')
                    ? 'bg-amber-100 text-amber-600'
                    : isScrolled 
                      ? 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-600' 
                      : 'bg-white/10 text-white hover:bg-white/20 hover:text-amber-300'
                }`}
                title="Notices & Announcements"
              >
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                </div>
              </Link>
            </nav>




          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - CSS Optimized (No heavy JS animations/blurs) */}
      <div 
        className={`fixed inset-0 z-[80] lg:hidden transition-visibility duration-300 ${
           isMobileMenuOpen ? 'visible' : 'invisible delay-300'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 touch-manipulation transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />
        
        {/* Sidebar Panel */}
        <div 
          className={`absolute top-0 left-0 w-80 max-w-[85vw] h-full bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 cubic-bezier(0.32,0.72,0,1) transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ 
            transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)', 
            willChange: 'transform',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Header with gradient (Simplified - No Orbs) */}
          <div className={`relative p-6 bg-gradient-to-r ${
            pathname.startsWith('/academics') ? 'from-teal-600 to-emerald-700'
            : pathname.startsWith('/contact') ? 'from-amber-600 to-orange-700'
            : pathname.startsWith('/notices') ? 'from-purple-600 to-violet-700'
            : 'from-blue-600 to-indigo-700'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {siteSettings.school_logo ? (
                  <div className="relative h-10 w-10 rounded-lg bg-white p-1 overflow-hidden">
                    <Image 
                      src={siteSettings.school_logo} 
                      alt="Logo" 
                      fill
                      className="object-contain" 
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎓</span>
                  </div>
                )}
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">{siteSettings.school_name || 'Menu'}</h2>
                  <p className="text-blue-200 text-xs">{siteSettings.school_motto || 'Navigation'}</p>
                </div>
              </div>
              <button 
                onClick={closeMobileMenu}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="relative p-4 pb-24 flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
            <nav className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.subItems && pathname.startsWith(link.href));
                const isSubMenuOpen = openMobileSubMenu === link.name;
                
                return (
                <div 
                  key={link.name}
                  className="touch-manipulation"
                >
                  {link.subItems ? (
                    <div>
                      <button
                        onClick={() => setOpenMobileSubMenu(isSubMenuOpen ? null : link.name)}
                        className="flex items-center justify-between w-full py-3 px-4 text-gray-200 hover:bg-white/10 rounded-xl font-medium transition-all duration-200 group"
                      >
                        <span className="group-hover:text-white transition-colors">{link.name}</span>
                        <svg 
                          className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Submenu - CSS Height Transition or Simple Conditional */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSubMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-500/30 pl-3">
                          {link.subItems.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                prefetch={true}
                                className={`block py-2 px-3 text-sm rounded-lg transition-all duration-200 relative ${
                                  isSubActive
                                    ? 'text-white bg-blue-600/20 font-medium'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                                onClick={(e) => { e.preventDefault(); handleNavigation(subItem.href); }}
                              >
                                {isSubActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-blue-500 rounded-full" />}
                                <span className="relative">{subItem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      prefetch={true}
                      className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-200 relative ${
                        isActive 
                          ? 'text-white bg-blue-600/20 border-l-2 border-blue-500' 
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={(e) => { e.preventDefault(); handleNavigation(link.href); }}
                    >
                      {isActive && <span className="absolute right-3 w-2 h-2 bg-blue-500 rounded-full" />}
                      {link.name}
                    </Link>
                  )}
                </div>
                );
              })}

              {/* Notices */}
              <div className="touch-manipulation">
                <Link
                  href="/notices"
                  prefetch={true}
                  className={`flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30 rounded-xl font-medium transition-all duration-200 border border-amber-500/30 ${pathname.startsWith('/notices') ? 'ring-2 ring-amber-400/50' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigation('/notices'); }}
                >
                  <div className="relative">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  </div>
                  Notices & Announcements
                </Link>
              </div>
            </nav>
          </div>

          {/* Footer Social Links */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-8">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Follow Us</p>
            <div className="flex items-center gap-2">
              {siteSettings.facebook_url && (
                <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
              )}
              {siteSettings.instagram_url && (
                <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-pink-500/20 text-pink-400 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              )}
              {siteSettings.youtube_url && (
                <a href={siteSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {siteSettings.twitter_url && (
                <a href={siteSettings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Global Navigation Loader - Centered on Screen */}
      <AnimatePresence>
        {isNavigating && <NavigationLoader logo={siteSettings.school_logo} />}
      </AnimatePresence>
    </>
  );
}

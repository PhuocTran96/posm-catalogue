/**
 * Header Component
 *
 * Modern navigation header with logo, navigation links, and user controls
 * Features responsive design, smooth animations, and accessibility
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navigation = [
    { name: 'Catalogue', href: '/', icon: '🏪' },
    { name: 'Admin', href: '/admin', icon: '⚙️', requireAuth: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const isAdminMode = location.pathname.startsWith('/admin');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-secondary-200'
          : 'bg-white/90 backdrop-blur-sm shadow-soft border-b border-secondary-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            aria-label="POSM Catalogue Home"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-xl font-bold">P</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                POSM Catalogue
              </h1>
              <p className="text-xs text-secondary-500">Product Display Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900 shadow-soft'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Mode Indicator */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 shadow-soft">
              {isAdminMode ? (
                <>
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium text-primary-700">Admin Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-medium text-primary-700">Viewer Mode</span>
                </>
              )}
            </div>

            {/* Help Button */}
            <button
              className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-all duration-200"
              aria-label="Help"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Help</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-secondary-100">
          <nav className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900 shadow-soft'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mobile Help Link */}
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-secondary-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Help</span>
            </div>

            {/* Mobile Mode Indicator */}
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200">
              {isAdminMode ? (
                <>
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium text-primary-700">Admin Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-medium text-primary-700">Viewer Mode</span>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Breadcrumb for mobile (shown on sub-pages) */}
      {location.pathname !== '/' && (
        <div className="lg:hidden bg-primary-50 border-t border-primary-100">
          <div className="px-4 py-2">
            <div className="flex items-center space-x-2 text-sm text-primary-700">
              <Link to="/" className="hover:text-primary-900 transition-colors">
                Home
              </Link>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                {location.pathname.includes('/admin') ? 'Admin' : 'Model Details'}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

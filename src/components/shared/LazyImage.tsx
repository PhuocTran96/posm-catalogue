/**
 * LazyImage Component
 *
 * Image component with built-in lazy loading using Intersection Observer
 * Shows a placeholder while loading and handles error states
 */

import { useState } from 'react';
import { useLazyLoad } from '@/hooks/useLazyLoad';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

/**
 * LazyImage component for lazy loading images
 */
export function LazyImage({
  src,
  alt,
  placeholderSrc,
  onLoad,
  onError,
  className = '',
  ...props
}: LazyImageProps) {
  const { ref, isVisible } = useLazyLoad<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Default placeholder SVG for missing images
  const defaultPlaceholder =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';

  return (
    <div ref={ref} className={`relative ${className}`}>
      {isVisible ? (
        <>
          {/* Show placeholder while loading */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Actual image */}
          <img
            src={imageError ? placeholderSrc || defaultPlaceholder : src}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            {...props}
          />
        </>
      ) : (
        // Placeholder before image enters viewport
        <div className="w-full h-full bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}

export default LazyImage;

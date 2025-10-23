/**
 * ModelViewer Component
 *
 * Modern model viewer with POSM markers
 * Features responsive design, loading states, and interactive elements
 */

import { useState, useRef, useEffect } from 'react';
import type { ProductModel, POSMMarker } from '@/types';

interface ModelViewerProps {
  model: ProductModel;
  onMarkerClick?: (marker: POSMMarker) => void;
  className?: string;
  showMarkers?: boolean;
}

export const ModelViewer = (props: ModelViewerProps) => {
  const { model, onMarkerClick, className = '', showMarkers = true } = props;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<POSMMarker | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleMarkerClick = (marker: POSMMarker) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Model Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
          {model.name}
        </h1>
        {model.code && (
          <p className="text-lg text-secondary-600 font-mono">
            {model.code}
          </p>
        )}
        {model.description && (
          <p className="text-secondary-700 mt-3 max-w-3xl mx-auto leading-relaxed">
            {model.description}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-secondary-600">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{model.posmMarkers.length} POSM markers</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{model.categoryIds.length} categories</span>
          </div>
        </div>
      </div>

      {/* Main Viewer */}
      <div className="card-large shadow-large">
        <div
          ref={containerRef}
          className="relative bg-secondary-100 rounded-xl overflow-hidden"
          style={{
            aspectRatio: model.image.width / model.image.height,
          }}
        >
          {/* Loading State */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary-100">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary-600 loading-dots">Loading model</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary-100">
              <div className="card-glass max-w-md mx-auto p-8">
                <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Failed to Load Image
                </h3>
                <p className="text-secondary-600 text-center mb-4">
                  The model image could not be loaded. Please check the file path.
                </p>
                <div className="bg-secondary-100 rounded-lg p-3">
                  <p className="text-xs font-mono text-secondary-500 text-center">
                    {model.image.url}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Model Image */}
          <img
            ref={imageRef}
            src={model.image.url}
            alt={model.image.alt}
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />

          {/* Placeholder for future POSM markers */}
          {showMarkers && imageLoaded && model.posmMarkers.length > 0 && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-large text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  Interactive POSM Markers
                </h3>
                <p className="text-secondary-600 mb-4">
                  This model has {model.posmMarkers.length} POSM markers that will be displayed here.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    // Simulate clicking the first marker
                    if (model.posmMarkers.length > 0) {
                      handleMarkerClick(model.posmMarkers[0]);
                    }
                  }}
                >
                  View Sample Marker
                </button>
              </div>
            </div>
          )}

          {/* No markers message */}
          {showMarkers && imageLoaded && model.posmMarkers.length === 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-secondary-600">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No POSM markers
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Metadata */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-500">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{model.image.width} × {model.image.height}px</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>{model.image.format.toUpperCase()}</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Updated {new Date(model.metadata.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
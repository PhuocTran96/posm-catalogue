/**
 * POSMPopup Component
 *
 * Modern popup for displaying POSM marker details
 * Features smooth animations, backdrop blur, and responsive design
 */

import { useEffect } from 'react';
import type { POSMMarker } from '@/types';

interface POSMPopupProps {
  marker: POSMMarker | null;
  isOpen: boolean;
  onClose: () => void;
}

export const POSMPopup = ({ marker, isOpen, onClose }: POSMPopupProps) => {
  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !marker) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Popup Content */}
      <div className="relative max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="card-glass shadow-large border border-white/30 animate-float">
          {/* Header */}
          <div className="border-b border-secondary-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-1">
                    {marker.info.name}
                  </h2>
                  {marker.info.description && (
                    <p className="text-secondary-600">
                      {marker.info.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-all duration-200"
                aria-label="Close popup"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Position Information */}
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">Position</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(marker.position.x)}
                  </div>
                  <div className="text-sm text-secondary-600">X Position</div>
                </div>
                <div className="bg-secondary-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(marker.position.y)}
                  </div>
                  <div className="text-sm text-secondary-600">Y Position</div>
                </div>
                <div className="bg-secondary-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {Math.round(marker.position.z || 0)}
                  </div>
                  <div className="text-sm text-secondary-600">Z Position</div>
                </div>
              </div>
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Type</h3>
                <div className="badge-primary capitalize">
                  {marker.type}
                </div>
              </div>

              {marker.category && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Category</h3>
                  <div className="badge-secondary">
                    {marker.category}
                  </div>
                </div>
              )}
            </div>

            {/* Materials */}
            {marker.materials && marker.materials.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Materials</h3>
                <div className="space-y-3">
                  {marker.materials.map((material) => (
                    <div key={material.id} className="card bg-secondary-50/50 border-secondary-200">
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-secondary-900">
                              {material.name}
                            </h4>
                            {material.description && (
                              <p className="text-secondary-600 text-sm mt-1">
                                {material.description}
                              </p>
                            )}
                          </div>
                          {material.quantity && (
                            <div className="badge-primary">
                              Qty: {material.quantity}
                            </div>
                          )}
                        </div>

                        {/* Specifications */}
                        {material.specifications && Object.keys(material.specifications).length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-semibold text-secondary-700 mb-2">Specifications</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {Object.entries(material.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-secondary-600 capitalize">{key}:</span>
                                  <span className="font-medium text-secondary-900">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artwork */}
            {marker.info.artworkUrl && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Artwork</h3>
                <div className="bg-secondary-100 rounded-lg overflow-hidden">
                  <img
                    src={marker.info.artworkUrl}
                    alt={marker.info.name}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Dimensions */}
            {marker.info.dimensions && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Dimensions</h3>
                <div className="grid grid-cols-3 gap-4 bg-secondary-50 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-secondary-900">
                      {marker.info.dimensions.width}
                    </div>
                    <div className="text-sm text-secondary-600">Width ({marker.info.dimensions.unit})</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-secondary-900">
                      {marker.info.dimensions.height}
                    </div>
                    <div className="text-sm text-secondary-600">Height ({marker.info.dimensions.unit})</div>
                  </div>
                  {marker.info.dimensions.depth && (
                    <div className="text-center">
                      <div className="text-xl font-bold text-secondary-900">
                        {marker.info.dimensions.depth}
                      </div>
                      <div className="text-sm text-secondary-600">Depth ({marker.info.dimensions.unit})</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Material Type */}
            {marker.info.materialType && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Material Type</h3>
                <div className="badge-success">
                  {marker.info.materialType}
                </div>
              </div>
            )}

            {/* Notes */}
            {marker.info.notes && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Notes</h3>
                <div className="bg-secondary-50 rounded-lg p-4">
                  <p className="text-secondary-700 whitespace-pre-wrap">
                    {marker.info.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            {marker.metadata && Object.keys(marker.metadata).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Additional Information</h3>
                <div className="space-y-2">
                  {Object.entries(marker.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-secondary-100">
                      <span className="text-secondary-600 capitalize">{key}:</span>
                      <span className="font-medium text-secondary-900">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-secondary-100 p-6">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

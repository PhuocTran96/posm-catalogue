/**
 * MarkerEditor Component
 *
 * Placeholder admin component for editing POSM markers
 * Will be implemented with drag-and-drop functionality
 */

import type { ProductModel } from '@/types';

interface MarkerEditorProps {
  model: ProductModel;
}

export const MarkerEditor = ({ model }: MarkerEditorProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Edit Model: {model.name}
        </h1>
        {model.code && (
          <p className="text-lg text-secondary-600 font-mono">
            {model.code}
          </p>
        )}
      </div>

      {/* Placeholder Content */}
      <div className="card-glass">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-3">Marker Editor</h2>
          <p className="text-secondary-600 mb-6 max-w-md mx-auto">
            Interactive POSM marker editor for <strong>{model.name}</strong> will be implemented here.
          </p>

          {/* Feature List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            <div className="flex items-center space-x-3 text-left p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 3.5a1.5 1.5 0 11-3 0m3 3.5a1.5 1.5 0 103 0m-3-3.5a1.5 1.5 0 10-3 0" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-secondary-900">Drag & Drop</div>
                <div className="text-sm text-secondary-600">Easy marker positioning</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-secondary-900">Real-time Editing</div>
                <div className="text-sm text-secondary-600">Live marker info updates</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-secondary-900">Auto-save</div>
                <div className="text-sm text-secondary-600">Automatic draft saving</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left p-3 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-secondary-900">Image Upload</div>
                <div className="text-sm text-secondary-600">Artwork & materials</div>
              </div>
            </div>
          </div>

          <div className="alert-info">
            <p className="text-sm">
              <strong>Coming Soon:</strong> Full marker editing interface with drag-and-drop positioning,
              real-time collaboration, and advanced export options.
            </p>
          </div>
        </div>
      </div>

      {/* Current Markers Preview */}
      <div className="card-glass">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Current Markers</h3>
          {model.posmMarkers.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-secondary-500 mb-4">No markers found for this model</p>
              <p className="text-secondary-400 text-sm">
                Add markers using the editor above when it's implemented
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {model.posmMarkers.map((marker, index) => (
                <div key={marker.id} className="card bg-secondary-50/50 border-secondary-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-secondary-900">
                          {marker.info.name || `Marker ${index + 1}`}
                        </h4>
                        <p className="text-sm text-secondary-600 mt-1">
                          Type: {marker.type}
                        </p>
                        {marker.info.description && (
                          <p className="text-xs text-secondary-500 mt-2 line-clamp-2">
                            {marker.info.description}
                          </p>
                        )}
                      </div>
                      <div className="badge-primary text-xs">
                        {marker.type}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-secondary-500">
                      Position: ({Math.round(marker.position.x)}, {Math.round(marker.position.y)})
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
/**
 * ModelList Component
 *
 * Displays a list/grid of product models from the catalogue
 * Supports thumbnails, hover states, and model selection
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ModelSummary } from '@/types';
import { LazyImage } from './LazyImage';

interface ModelListProps {
  models: ModelSummary[];
  loading?: boolean;
  error?: Error | null;
  selectedModelId?: string | null;
  onSelectModel?: (modelId: string) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

/**
 * ModelList component for browsing product models
 */
export function ModelList({
  models,
  loading = false,
  error = null,
  selectedModelId = null,
  onSelectModel,
  viewMode: initialViewMode = 'grid',
  className = '',
}: ModelListProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  const handleModelClick = (modelId: string) => {
    if (onSelectModel) {
      onSelectModel(modelId);
    } else {
      // Default behavior: navigate to model detail page
      navigate(`/model/${modelId}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center max-w-md">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Models</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!models || models.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center max-w-md">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Models Found</h3>
          <p className="text-gray-600">There are no product models in the catalogue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {models.length} {models.length === 1 ? 'model' : 'models'}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Grid view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="List view"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Model Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              isSelected={model.id === selectedModelId}
              onClick={() => handleModelClick(model.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {models.map((model) => (
            <ModelListItem
              key={model.id}
              model={model}
              isSelected={model.id === selectedModelId}
              onClick={() => handleModelClick(model.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ModelCard - Grid view card component
 */
interface ModelCardProps {
  model: ModelSummary;
  isSelected: boolean;
  onClick: () => void;
}

function ModelCard({ model, isSelected, onClick }: ModelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
        isSelected ? 'ring-2 ring-blue-600' : ''
      }`}
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <LazyImage
          src={model.thumbnailUrl}
          alt={model.name}
          className="w-full h-full object-cover"
        />
        {model.posmCount > 0 && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {model.posmCount} POSM
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{model.name}</h3>
        {model.code && <p className="text-sm text-gray-500 mb-2">{model.code}</p>}
        {model.categoryIds.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {model.categoryIds.slice(0, 2).map((categoryId) => (
              <span
                key={categoryId}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {categoryId}
              </span>
            ))}
            {model.categoryIds.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                +{model.categoryIds.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ModelListItem - List view item component
 */
interface ModelListItemProps {
  model: ModelSummary;
  isSelected: boolean;
  onClick: () => void;
}

function ModelListItem({ model, isSelected, onClick }: ModelListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg flex ${
        isSelected ? 'ring-2 ring-blue-600' : ''
      }`}
    >
      <div className="w-48 h-32 bg-gray-100 flex-shrink-0 relative overflow-hidden">
        <LazyImage
          src={model.thumbnailUrl}
          alt={model.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{model.name}</h3>
            {model.posmCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full ml-2">
                {model.posmCount} POSM
              </span>
            )}
          </div>
          {model.code && <p className="text-sm text-gray-500 mb-2">{model.code}</p>}
        </div>
        {model.categoryIds.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {model.categoryIds.map((categoryId) => (
              <span
                key={categoryId}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {categoryId}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelList;

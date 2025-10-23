/**
 * App Component
 *
 * Root application component with React Router setup
 * Integrates ModelList and ModelViewer with catalogue data
 */

import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ModelList } from '@/components/shared/ModelList';
import { SearchBar } from '@/components/shared/SearchBar';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import { ModelViewer } from '@/components/viewer/ModelViewer';
import { POSMPopup } from '@/components/viewer/POSMPopup';
import { useCatalogueIndex, useModelData } from '@/hooks/useModelData';
import { searchModels, filterModelsByCategory } from '@/services/modelService';
import type { POSMMarker } from '@/types';
import './App.css';

// Lazy load admin components for better code splitting
const MarkerEditor = lazy(() => import('@/components/admin/MarkerEditor'));
const ExportPanel = lazy(() => import('@/components/admin/ExportPanel'));

/**
 * HomePage - Displays the model catalogue list with search and filters
 */
function HomePage() {
  const { catalogue, loading, error } = useCatalogueIndex();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cats = searchParams.get('categories');
    return cats ? cats.split(',').filter(Boolean) : [];
  });

  // Update URL params when search/filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategories, setSearchParams]);

  // Apply search and filters
  const filteredModels = useMemo(() => {
    if (!catalogue) return [];

    let models = catalogue.models;

    // Apply search filter
    if (searchQuery) {
      models = searchModels(searchQuery, { ...catalogue, models });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      models = filterModelsByCategory(selectedCategories, { ...catalogue, models });
    }

    return models;
  }, [catalogue, searchQuery, selectedCategories]);

  const hasActiveFilters = searchQuery || selectedCategories.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50/20 to-accent-50/20">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 shadow-large">
        <div className="hero-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight animate-float">
                <span className="gradient-text bg-gradient-to-r from-white to-accent-100 bg-clip-text">
                  Product Model Catalogue
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-4xl mx-auto leading-relaxed">
                Discover and explore interactive POSM placement details for all your product displays
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/90">
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium">{catalogue?.models?.length || 0} Models</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium">{catalogue?.categories?.length || 0} Categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12 relative z-10">
        {/* Search and Filter Card */}
        {!loading && !error && catalogue && (
          <div className="card-glass mb-8 shadow-large border border-white/30">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Search Bar */}
                <div className="lg:col-span-3">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    disabled={loading}
                    suggestions={catalogue.models.map(m => m.name)}
                  />
                </div>

                {/* Category Filter Sidebar */}
                <div className="lg:col-span-1">
                  <CategoryFilter
                    categories={catalogue.categories}
                    selectedCategoryIds={selectedCategories}
                    onSelectionChange={setSelectedCategories}
                    models={catalogue.models}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Results Info */}
              {hasActiveFilters && (
                <div className="alert-info mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <span className="font-semibold text-primary-900">
                          {filteredModels.length} result{filteredModels.length !== 1 ? 's' : ''} found
                        </span>
                        {catalogue.models.length > 0 && (
                          <span className="text-primary-700 ml-1">
                            (of {catalogue.models.length} total)
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategories([]);
                      }}
                      className="btn-outline text-sm px-4 py-2"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Model List */}
        <ModelList
          models={filteredModels}
          loading={loading}
          error={error}
        />

        {/* Empty State for No Results */}
        {!loading && !error && filteredModels.length === 0 && hasActiveFilters && (
          <div className="text-center py-16">
            <div className="card-glass max-w-md mx-auto p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-3">No Models Found</h3>
              <p className="text-secondary-600 text-lg mb-8">
                No models match your current search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                }}
                className="btn-primary px-6 py-3"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * ModelDetailPage - Displays a single model with POSM markers
 */
function ModelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { model, loading, error } = useModelData(id || null);
  const [selectedMarker, setSelectedMarker] = useState<POSMMarker | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleMarkerClick = (marker: POSMMarker) => {
    setSelectedMarker(marker);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    // Don't clear selectedMarker immediately to allow smooth transition
    setTimeout(() => setSelectedMarker(null), 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to catalogue link */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Catalogue
          </a>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading model...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center min-h-[400px]">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Model</h3>
              <p className="text-gray-600">{error.message}</p>
              <a
                href="/"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800"
              >
                Return to Catalogue
              </a>
            </div>
          </div>
        )}

        {/* Model viewer */}
        {model && !loading && !error && (
          <>
            <ModelViewer
              model={model}
              onMarkerClick={handleMarkerClick}
            />

            <POSMPopup
              marker={selectedMarker}
              isOpen={isPopupOpen}
              onClose={handleClosePopup}
            />
          </>
        )}
      </main>
    </div>
  );
}

/**
 * AdminPage - Admin interface for editing POSM markers and exporting data
 */
function AdminPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'models' | 'export'>('models');
  const { catalogue, loading: catalogueLoading } = useCatalogueIndex();

  // If we have a model ID, show the marker editor
  if (id) {
    return <AdminModelEditor modelId={id} />;
  }

  // Otherwise show the admin interface with tabs
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Manage POSM markers and export catalogue data
          </p>
        </div>

        {/* Admin Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('models')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'models'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span>Models</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'export'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Export</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'models' ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit Models</h2>
              <p className="text-gray-600">
                Select a model to edit its POSM markers
              </p>
            </div>

            {/* Model Selection */}
            {catalogueLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading models...</p>
            </div>
          </div>
        ) : catalogue ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogue.models.map(model => (
              <div
                key={model.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = `/admin/model/${model.id}`}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={model.thumbnailUrl}
                    alt={model.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-model.webp';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{model.name}</h3>
                  {model.code && (
                    <p className="text-sm text-gray-600 mb-2">Code: {model.code}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{model.posmCount} marker{model.posmCount !== 1 ? 's' : ''}</span>
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Models Available</h3>
            <p className="text-gray-600 mb-4">
              There are no models in the catalogue to edit.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Viewer
            </a>
          </div>
        )}
          </>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Export Data</h2>
              <p className="text-gray-600">
                Export catalogue data as JSON for backup or sharing
              </p>
            </div>

            {/* Export Panel */}
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading export panel...</p>
                </div>
              </div>
            }>
              <ExportPanel />
            </Suspense>
          </>
        )}
      </main>
    </div>
  );
}

/**
 * AdminModelEditor - Component for editing a specific model's markers
 */
function AdminModelEditor({ modelId }: { modelId: string }) {
  const { model, loading, error } = useModelData(modelId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading model...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Model</h3>
            <p className="text-gray-600">{error?.message || 'Model not found'}</p>
            <div className="mt-4 space-x-4">
              <a
                href="/admin"
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Admin
              </a>
              <a
                href="/"
                className="inline-block text-blue-600 hover:text-blue-800"
              >
                Return to Viewer
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <a
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Admin Panel
          </a>
        </div>

        {/* Model Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Model: {model.name}</h1>
          {model.code && (
            <p className="text-gray-600 mt-1">Code: {model.code}</p>
          )}
        </div>

        {/* Marker Editor */}
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading editor...</p>
            </div>
          </div>
        }>
          <MarkerEditor model={model} />
        </Suspense>
      </main>
    </div>
  );
}

/**
 * NotFoundPage - 404 error page
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </main>
    </div>
  );
}

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route - model catalogue */}
        <Route path="/" element={<HomePage />} />

        {/* Model detail route - shows specific model with POSM markers */}
        <Route path="/model/:id" element={<ModelDetailPage />} />

        {/* Admin routes - for positioning and editing (Phase 5-7) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/model/:id"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

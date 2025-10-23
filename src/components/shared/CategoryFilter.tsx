/**
 * CategoryFilter Component
 *
 * Modern category filter with checkboxes, search, and collapsible sections
 * Features responsive design and smooth animations
 */

import { useState, useMemo } from 'react';
import type { Category, ModelSummary } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  models?: ModelSummary[];
  className?: string;
  disabled?: boolean;
}

export const CategoryFilter = ({
  categories,
  selectedCategoryIds,
  onSelectionChange,
  models = [],
  className = '',
  disabled = false
}: CategoryFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate model counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    categories.forEach((category) => {
      counts[category.id] = models.filter((model) =>
        model.categoryIds.includes(category.id)
      ).length;
    });

    return counts;
  }, [categories, models]);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;

    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleToggle = (categoryId: string) => {
    if (disabled) return;

    if (selectedCategoryIds.includes(categoryId)) {
      // Remove category
      onSelectionChange(selectedCategoryIds.filter((id) => id !== categoryId));
    } else {
      // Add category
      onSelectionChange([...selectedCategoryIds, categoryId]);
    }
  };

  const handleClearAll = () => {
    if (disabled) return;
    onSelectionChange([]);
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onSelectionChange(filteredCategories.map((cat) => cat.id));
  };

  const hasActiveFilters = selectedCategoryIds.length > 0;
  const hasSearchResults = filteredCategories.length > 0;

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className={`card-glass ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-secondary-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-secondary-900 flex items-center space-x-2">
            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Categories</span>
            {hasActiveFilters && (
              <span className="badge-primary text-xs">{selectedCategoryIds.length}</span>
            )}
          </h3>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-all duration-200"
            aria-label={isExpanded ? "Collapse categories" : "Expand categories"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={handleClearAll}
              disabled={disabled}
              className="btn-ghost text-xs px-2 py-1"
            >
              Clear all
            </button>
            <div className="text-xs text-secondary-500">
              {selectedCategoryIds.length} selected
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search */}
          {categories.length > 6 && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                disabled={disabled}
                className="input pl-9 pr-3 py-2 text-sm"
              />
            </div>
          )}

          {/* Select/Clear All */}
          {categories.length > 1 && !searchTerm && (
            <div className="flex items-center justify-between py-2 border-y border-secondary-100">
              <button
                onClick={handleSelectAll}
                disabled={disabled || selectedCategoryIds.length === filteredCategories.length}
                className="btn-ghost text-xs px-2 py-1 disabled:opacity-50"
              >
                Select all
              </button>
              <button
                onClick={handleClearAll}
                disabled={disabled || selectedCategoryIds.length === 0}
                className="btn-ghost text-xs px-2 py-1 disabled:opacity-50"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {hasSearchResults ? (
              filteredCategories.map((category) => {
                const count = categoryCounts[category.id] || 0;
                const isSelected = selectedCategoryIds.includes(category.id);

                return (
                  <label
                    key={category.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-secondary-50 border border-transparent'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(category.id)}
                        disabled={disabled}
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-secondary-900 truncate">
                          {category.name}
                        </div>
                        {category.description && (
                          <div className="text-xs text-secondary-500 truncate">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {count > 0 && (
                        <span className={`badge text-xs ${
                          isSelected ? 'badge-primary' : 'badge-secondary'
                        }`}>
                          {count}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-secondary-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-secondary-500 text-sm">No categories found</p>
                <p className="text-secondary-400 text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Summary */}
          {categories.length > 0 && (
            <div className="pt-3 border-t border-secondary-100">
              <div className="text-xs text-secondary-500">
                Showing {filteredCategories.length} of {categories.length} categories
                {hasActiveFilters && (
                  <span className="ml-1">
                    • {selectedCategoryIds.length} selected
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * InfoEditor Component
 *
 * Admin component for editing POSM marker information
 * Provides form interface for editing marker details, artwork, and metadata
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { POSMMarker } from '@/types';

interface InfoEditorProps {
  marker: POSMMarker | null;
  onSave: (markerInfo: POSMMarker['info']) => void;
  onCancel: () => void;
  isOpen: boolean;
}

/**
 * Form validation errors interface
 */
interface FormErrors {
  name?: string;
  description?: string;
  artworkUrl?: string;
  notes?: string;
}

/**
 * Form data interface matching POSM information structure
 */
interface FormData {
  name: string;
  description: string;
  artworkUrl: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
    unit: string;
  };
  materialType: string;
  notes: string;
}

// Character limits for form fields
const FIELD_LIMITS = {
  name: 200,
  description: 2000,
  notes: 1000,
  materialType: 100,
} as const;

/**
 * Utility function to sanitize text input (XSS prevention)
 */
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Utility function to validate URL
 */
function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // Empty URL is valid (optional field)

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * InfoEditor component for editing POSM marker details
 */
export function InfoEditor({ marker, onSave, onCancel, isOpen }: InfoEditorProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    artworkUrl: '',
    dimensions: {
      width: '',
      height: '',
      depth: '',
      unit: 'cm',
    },
    materialType: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when marker changes
  useEffect(() => {
    if (marker) {
      setFormData({
        name: marker.info.name || '',
        description: marker.info.description || '',
        artworkUrl: marker.info.artworkUrl || '',
        dimensions: {
          width: marker.info.dimensions?.width?.toString() || '',
          height: marker.info.dimensions?.height?.toString() || '',
          depth: marker.info.dimensions?.depth?.toString() || '',
          unit: marker.info.dimensions?.unit || 'cm',
        },
        materialType: marker.info.materialType || '',
        notes: marker.info.notes || '',
      });

      // Set artwork preview if URL exists
      if (marker.info.artworkUrl) {
        setArtworkPreview(marker.info.artworkUrl);
      } else {
        setArtworkPreview(null);
      }

      setErrors({});
      setHasUnsavedChanges(false);
    }
  }, [marker]);

  // Track unsaved changes
  useEffect(() => {
    if (marker) {
      const currentData = {
        name: marker.info.name || '',
        description: marker.info.description || '',
        artworkUrl: marker.info.artworkUrl || '',
        dimensions: {
          width: marker.info.dimensions?.width?.toString() || '',
          height: marker.info.dimensions?.height?.toString() || '',
          depth: marker.info.dimensions?.depth?.toString() || '',
          unit: marker.info.dimensions?.unit || 'cm',
        },
        materialType: marker.info.materialType || '',
        notes: marker.info.notes || '',
      };

      const hasChanges = JSON.stringify(formData) !== JSON.stringify(currentData);
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, marker]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Name validation (required)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > FIELD_LIMITS.name) {
      newErrors.name = `Name must be ${FIELD_LIMITS.name} characters or less`;
    }

    // Description validation (required)
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > FIELD_LIMITS.description) {
      newErrors.description = `Description must be ${FIELD_LIMITS.description} characters or less`;
    }

    // Artwork URL validation (optional but must be valid if provided)
    if (formData.artworkUrl && !isValidUrl(formData.artworkUrl)) {
      newErrors.artworkUrl = 'Please enter a valid URL';
    }

    // Notes validation (optional but has character limit)
    if (formData.notes.length > FIELD_LIMITS.notes) {
      newErrors.notes = `Notes must be ${FIELD_LIMITS.notes} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form input changes
  const handleInputChange = useCallback((field: keyof FormData | string, value: string) => {
    const sanitizedValue = sanitizeInput(value);

    if (field.includes('.')) {
      // Handle nested fields (dimensions)
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof FormData];
        return {
          ...prev,
          [parent]: {
            ...(parentValue && typeof parentValue === 'object' ? parentValue : {}),
            [child]: sanitizedValue,
          },
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [field as keyof FormData]: sanitizedValue,
      }));
    }
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, artworkUrl: 'Please select an image file' }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, artworkUrl: 'Image must be smaller than 5MB' }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setArtworkPreview(result);

      // For static site, we'll store as data URL or relative path
      // In a real implementation, this would upload to a server
      const fileName = `posm-${Date.now()}.${file.type.split('/')[1]}`;
      const relativePath = `/images/posm/${fileName}`;

      setFormData(prev => ({
        ...prev,
        artworkUrl: relativePath,
      }));

      setErrors(prev => ({ ...prev, artworkUrl: undefined }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const markerInfo = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        ...(formData.artworkUrl && { artworkUrl: formData.artworkUrl.trim() }),
        ...(formData.dimensions.width && formData.dimensions.height && {
          dimensions: {
            width: parseFloat(formData.dimensions.width),
            height: parseFloat(formData.dimensions.height),
            ...(formData.dimensions.depth && { depth: parseFloat(formData.dimensions.depth) }),
            unit: formData.dimensions.unit,
          },
        }),
        ...(formData.materialType && { materialType: formData.materialType.trim() }),
        ...(formData.notes && { notes: formData.notes.trim() }),
      };

      await onSave(markerInfo);
    } catch (error) {
      console.error('Failed to save marker info:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSave]);

  // Handle cancel with unsaved changes warning
  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  }, [hasUnsavedChanges, onCancel]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleCancel]);

  if (!marker || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Modal Content */}
          <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Edit POSM Marker Details
                </h3>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Basic Information</h4>

                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter POSM name"
                    maxLength={FIELD_LIMITS.name}
                    autoFocus
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.name.length}/{FIELD_LIMITS.name}
                    </p>
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter detailed description of the POSM"
                    maxLength={FIELD_LIMITS.description}
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.description && (
                      <p className="text-sm text-red-600">{errors.description}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.description.length}/{FIELD_LIMITS.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Artwork */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Artwork</h4>

                {/* Artwork URL/Upload */}
                <div>
                  <label htmlFor="artworkUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Artwork Image (URL or Upload)
                  </label>
                  <div className="space-y-3">
                    {/* URL Input */}
                    <input
                      id="artworkUrl"
                      type="url"
                      value={formData.artworkUrl}
                      onChange={(e) => handleInputChange('artworkUrl', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.artworkUrl ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/artwork.webp"
                    />

                    {/* File Upload */}
                    <div className="flex items-center space-x-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Image
                      </button>
                      <span className="text-sm text-gray-500">
                        PNG, JPG, WEBP up to 5MB
                      </span>
                    </div>
                  </div>

                  {errors.artworkUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.artworkUrl}</p>
                  )}
                </div>

                {/* Artwork Preview */}
                {(artworkPreview || formData.artworkUrl) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
                      <img
                        src={artworkPreview || formData.artworkUrl}
                        alt="Artwork preview"
                        className="max-w-full h-48 object-contain mx-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Physical Details */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Physical Details</h4>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input
                        type="number"
                        value={formData.dimensions.width}
                        onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Width"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={formData.dimensions.height}
                        onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Height"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={formData.dimensions.depth}
                        onChange={(e) => handleInputChange('dimensions.depth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Depth (optional)"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <select
                      value={formData.dimensions.unit}
                      onChange={(e) => handleInputChange('dimensions.unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="in">Inches (in)</option>
                      <option value="mm">Millimeters (mm)</option>
                      <option value="ft">Feet (ft)</option>
                      <option value="m">Meters (m)</option>
                    </select>
                  </div>
                </div>

                {/* Material Type */}
                <div>
                  <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-1">
                    Material Type
                  </label>
                  <input
                    id="materialType"
                    type="text"
                    value={formData.materialType}
                    onChange={(e) => handleInputChange('materialType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Rigid PVC, Foam Board, Aluminum"
                    maxLength={FIELD_LIMITS.materialType}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.materialType.length}/{FIELD_LIMITS.materialType}
                  </p>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Additional Information</h4>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                      errors.notes ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Additional notes, installation instructions, etc."
                    maxLength={FIELD_LIMITS.notes}
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.notes && (
                      <p className="text-sm text-red-600">{errors.notes}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.notes.length}/{FIELD_LIMITS.notes}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InfoEditor;
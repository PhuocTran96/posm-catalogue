/**
 * ExportPanel Component
 *
 * Admin component for exporting catalogue data
 * Supports multiple export formats and configurations
 */

import { useState } from 'react';

export const ExportPanel = () => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'xlsx'>('json');
  const [includeImages, setIncludeImages] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real application, this would trigger the actual export
    console.log('Exporting data:', {
      format: exportFormat,
      includeImages,
      includeMetadata
    });

    setIsExporting(false);

    // Show success message
    alert(`Export completed as ${exportFormat.toUpperCase()} file!`);
  };

  return (
    <div className="card-glass">
      <div className="p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-success-100 to-success-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-3">Export Data</h2>
        <p className="text-secondary-600 mb-8 max-w-md mx-auto">
          Export catalogue data for backup or sharing in various formats
        </p>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          {/* Format Selection */}
          <div className="text-left">
            <label className="block text-sm font-semibold text-secondary-900 mb-3">
              Export Format
            </label>
            <div className="space-y-2">
              {(['json', 'csv', 'xlsx'] as const).map((format) => (
                <label key={format} className="flex items-center space-x-3 p-3 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={exportFormat === format}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium text-secondary-900 uppercase">
                      {format}
                    </div>
                    <div className="text-xs text-secondary-600">
                      {format === 'json' && 'Machine-readable format'}
                      {format === 'csv' && 'Spreadsheet compatible'}
                      {format === 'xlsx' && 'Excel format'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div className="text-left">
            <label className="block text-sm font-semibold text-secondary-900 mb-3">
              Include Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-secondary-900">Images</div>
                  <div className="text-xs text-secondary-600">Include image files</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <div>
                  <div className="font-medium text-secondary-900">Metadata</div>
                  <div className="text-xs text-secondary-600">Include technical details</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Export Stats */}
        <div className="bg-secondary-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-secondary-600">Models</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">0</div>
              <div className="text-sm text-secondary-600">Markers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">~0 MB</div>
              <div className="text-sm text-secondary-600">Est. Size</div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="btn-accent px-8 py-3 text-lg"
        >
          {isExporting ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Catalogue
            </>
          )}
        </button>

        {/* Coming Soon Notice */}
        <div className="alert-info mt-6">
          <p className="text-sm">
            <strong>Note:</strong> This is a demonstration. In a production environment,
            this would generate actual export files with the selected options.
          </p>
        </div>
      </div>
    </div>
  );
};
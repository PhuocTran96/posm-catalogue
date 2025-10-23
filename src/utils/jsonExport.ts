import type { ProductModel, ExportData, ExportMetadata, Category } from '@/types';

/**
 * Format JSON with proper indentation
 * @param data - Data to format
 * @param indent - Number of spaces for indentation
 * @returns Formatted JSON string
 */
export function formatJSON(data: any, indent: number = 2): string {
  return JSON.stringify(data, null, indent);
}

/**
 * Create export data structure
 * @param models - Models to export
 * @param categories - Categories referenced by models
 * @param exportType - 'full' or 'selective'
 * @param notes - Optional export notes
 * @returns Complete export data object
 */
export function createExportData(
  models: ProductModel[],
  categories: Category[],
  exportType: 'full' | 'selective',
  notes?: string
): ExportData {
  const totalMarkers = calculateTotalMarkers(models);

  const metadata: ExportMetadata = {
    totalModels: models.length,
    totalMarkers,
    exportedBy: undefined, // TODO: Get from auth session if available
    notes,
  };

  return {
    exportedAt: new Date().toISOString(),
    exportType,
    version: '1.0.0',
    models,
    categories,
    metadata,
  };
}

/**
 * Calculate total markers across all models
 * @param models - Array of models
 * @returns Total number of POSM markers
 */
export function calculateTotalMarkers(models: ProductModel[]): number {
  return models.reduce((total, model) => total + model.posmMarkers.length, 0);
}

/**
 * Filter categories that are used by exported models
 * @param models - Models being exported
 * @param allCategories - All available categories
 * @returns Filtered array of categories
 */
export function filterUsedCategories(
  models: ProductModel[],
  allCategories: Category[]
): Category[] {
  const usedCategoryIds = new Set<string>();

  models.forEach((model) => {
    model.categoryIds.forEach((catId) => usedCategoryIds.add(catId));
  });

  return allCategories.filter((cat) => usedCategoryIds.has(cat.id));
}

/**
 * Generate filename for export with timestamp
 * @param prefix - Filename prefix
 * @param exportType - Export type for filename
 * @returns Filename string
 */
export function generateExportFilename(
  prefix: string = 'posm-export',
  exportType: 'full' | 'selective' = 'full'
): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .substring(0, 19); // Format: YYYY-MM-DDTHH-MM-SS

  return `${prefix}-${exportType}-${timestamp}.json`;
}

/**
 * Validate export data structure
 * @param data - Export data to validate
 * @returns True if valid structure
 */
export function validateExportData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;

  // Check required fields
  if (!data.exportedAt || !data.exportType || !data.version) return false;
  if (!Array.isArray(data.models) || data.models.length === 0) return false;
  if (!Array.isArray(data.categories)) return false;
  if (!data.metadata || typeof data.metadata !== 'object') return false;

  // Validate metadata
  if (typeof data.metadata.totalModels !== 'number') return false;
  if (typeof data.metadata.totalMarkers !== 'number') return false;

  // Verify counts match
  if (data.metadata.totalModels !== data.models.length) return false;

  return true;
}

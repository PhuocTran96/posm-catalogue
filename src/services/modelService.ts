import type {
  CatalogueIndex,
  ProductModel,
  ModelSummary,
  ExportData,
  ValidationResult,
} from '@/types';
import { cache } from '@/utils/cache';

// Cache TTL constants (in milliseconds)
const CATALOGUE_INDEX_TTL = 5 * 60 * 1000; // 5 minutes
const MODEL_DATA_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Load the catalogue index containing all models
 * @returns Promise resolving to catalogue index
 * @throws Error if fetch fails or JSON is invalid
 */
export async function loadCatalogueIndex(): Promise<CatalogueIndex> {
  const cacheKey = 'catalogue-index';

  // Check cache first
  const cached = cache.get<CatalogueIndex>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch('/data/models.json');

    if (!response.ok) {
      throw new Error(`Failed to load catalogue index: ${response.statusText}`);
    }

    const data: CatalogueIndex = await response.json();

    // Validate basic structure
    if (!data.version || !data.models || !Array.isArray(data.models)) {
      throw new Error('Invalid catalogue data format');
    }

    // Cache the result
    cache.set(cacheKey, data, CATALOGUE_INDEX_TTL);

    return data;
  } catch (error) {
    console.error('Error loading catalogue index:', error);
    throw new Error('Failed to load catalogue index');
  }
}

/**
 * Load a specific model by ID
 * @param modelId - Unique model identifier
 * @returns Promise resolving to complete model data
 * @throws Error if model not found or JSON is invalid
 */
export async function loadModel(modelId: string): Promise<ProductModel> {
  const cacheKey = `model-${modelId}`;

  // Check cache first
  const cached = cache.get<ProductModel>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`/data/models/${modelId}.json`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Model not found: ${modelId}`);
      }
      throw new Error(`Failed to load model: ${response.statusText}`);
    }

    const data: ProductModel = await response.json();

    // Validate model has required fields
    if (!data.id || !data.name || !data.image) {
      throw new Error('Invalid model data format');
    }

    // Cache the result
    cache.set(cacheKey, data, MODEL_DATA_TTL);

    return data;
  } catch (error) {
    console.error(`Error loading model ${modelId}:`, error);
    throw error;
  }
}

/**
 * Load multiple models by IDs
 * @param modelIds - Array of model identifiers
 * @returns Promise resolving to array of models
 * @throws Error if any model fails to load
 */
export async function loadModels(modelIds: string[]): Promise<ProductModel[]> {
  const promises = modelIds.map((id) => loadModel(id));
  return Promise.all(promises);
}

/**
 * Search models by text query
 * @param query - Search term (case-insensitive)
 * @param catalogue - Catalogue index to search
 * @returns Filtered array of model summaries
 */
export function searchModels(
  query: string,
  catalogue: CatalogueIndex
): ModelSummary[] {
  if (!query || query.trim() === '') {
    return catalogue.models;
  }

  const searchTerm = query.toLowerCase().trim();

  return catalogue.models.filter((model) => {
    const nameMatch = model.name.toLowerCase().includes(searchTerm);
    const codeMatch = model.code?.toLowerCase().includes(searchTerm) || false;

    return nameMatch || codeMatch;
  });
}

/**
 * Filter models by categories
 * @param categoryIds - Array of category IDs to filter by
 * @param catalogue - Catalogue index to filter
 * @returns Filtered array of model summaries
 */
export function filterModelsByCategory(
  categoryIds: string[],
  catalogue: CatalogueIndex
): ModelSummary[] {
  if (!categoryIds || categoryIds.length === 0) {
    return catalogue.models;
  }

  return catalogue.models.filter((model) => {
    // OR logic: Model included if it has ANY matching category
    return model.categoryIds.some((catId) => categoryIds.includes(catId));
  });
}

/**
 * Validate model data against schema
 * @param model - Model data to validate
 * @returns Validation result with errors if invalid
 */
export function validateModel(model: unknown): ValidationResult<ProductModel> {
  const errors: Array<{ field: string; message: string; value?: unknown }> = [];

  if (typeof model !== 'object' || model === null) {
    return { valid: false, errors: [{ field: 'model', message: 'Model must be an object' }] };
  }

  const m = model as any;

  // Required fields
  if (!m.id || typeof m.id !== 'string') {
    errors.push({ field: 'id', message: 'ID is required and must be a string', value: m.id });
  }

  if (!m.name || typeof m.name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required and must be a string', value: m.name });
  }

  // Validate image
  if (!m.image || typeof m.image !== 'object') {
    errors.push({ field: 'image', message: 'Image is required' });
  } else {
    if (!m.image.url) errors.push({ field: 'image.url', message: 'Image URL is required' });
    if (typeof m.image.width !== 'number' || m.image.width <= 0) {
      errors.push({ field: 'image.width', message: 'Image width must be a positive number' });
    }
    if (typeof m.image.height !== 'number' || m.image.height <= 0) {
      errors.push({ field: 'image.height', message: 'Image height must be a positive number' });
    }
  }

  // Validate POSM markers
  if (!Array.isArray(m.posmMarkers)) {
    errors.push({ field: 'posmMarkers', message: 'POSM markers must be an array' });
  } else {
    m.posmMarkers.forEach((marker: any, index: number) => {
      if (!marker.position || typeof marker.position.x !== 'number' || typeof marker.position.y !== 'number') {
        errors.push({ field: `posmMarkers[${index}].position`, message: 'Invalid position coordinates' });
      }
      if (marker.position.x < 0 || marker.position.x > 100) {
        errors.push({
          field: `posmMarkers[${index}].position.x`,
          message: 'X coordinate must be between 0 and 100',
          value: marker.position.x,
        });
      }
      if (marker.position.y < 0 || marker.position.y > 100) {
        errors.push({
          field: `posmMarkers[${index}].position.y`,
          message: 'Y coordinate must be between 0 and 100',
          value: marker.position.y,
        });
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: m as ProductModel };
}

/**
 * Export model data as JSON file
 * @param models - Array of models to export
 * @param exportType - 'full' or 'selective'
 * @returns ExportData object ready for download
 */
export function exportModels(
  models: ProductModel[],
  exportType: 'full' | 'selective'
): ExportData {
  if (!models || models.length === 0) {
    throw new Error('Cannot export empty model list');
  }

  // Collect unique categories
  const categoryIds = new Set<string>();
  models.forEach((model) => {
    model.categoryIds.forEach((catId) => categoryIds.add(catId));
  });

  // For now, we'll need to get categories from somewhere - in practice,
  // this would come from the catalogue index
  const categories: any[] = []; // TODO: Get from catalogue

  // Calculate total markers
  const totalMarkers = models.reduce((sum, model) => sum + model.posmMarkers.length, 0);

  const exportData: ExportData = {
    exportedAt: new Date().toISOString(),
    exportType,
    version: '1.0.0',
    models,
    categories,
    metadata: {
      totalModels: models.length,
      totalMarkers,
    },
  };

  return exportData;
}

/**
 * Download JSON data as file
 * @param data - Data to download
 * @param filename - Name for downloaded file
 */
export function downloadJSON(data: object, filename: string): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading JSON:', error);
    throw new Error('Failed to download JSON file');
  }
}

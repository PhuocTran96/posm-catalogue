import type { ProductModel } from '@/types';

const DRAFT_KEY_PREFIX = 'posm-draft-';
const TIMESTAMP_SUFFIX = '-timestamp';

/**
 * Save model draft to localStorage
 * @param modelId - Model being edited
 * @param draftData - Unsaved changes
 */
export function saveDraft(modelId: string, draftData: ProductModel): void {
  try {
    const key = `${DRAFT_KEY_PREFIX}${modelId}`;
    const timestampKey = `${key}${TIMESTAMP_SUFFIX}`;

    localStorage.setItem(key, JSON.stringify(draftData));
    localStorage.setItem(timestampKey, new Date().toISOString());
  } catch (error) {
    console.error('Error saving draft:', error);
    throw new Error('Failed to save draft');
  }
}

/**
 * Load draft from localStorage
 * @param modelId - Model ID
 * @returns Draft data if exists, null otherwise
 */
export function loadDraft(modelId: string): ProductModel | null {
  try {
    const key = `${DRAFT_KEY_PREFIX}${modelId}`;
    const draftData = localStorage.getItem(key);

    if (!draftData) {
      return null;
    }

    return JSON.parse(draftData) as ProductModel;
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
}

/**
 * Clear draft after saving
 * @param modelId - Model ID
 */
export function clearDraft(modelId: string): void {
  const key = `${DRAFT_KEY_PREFIX}${modelId}`;
  const timestampKey = `${key}${TIMESTAMP_SUFFIX}`;

  localStorage.removeItem(key);
  localStorage.removeItem(timestampKey);
}

/**
 * Check if draft exists
 * @param modelId - Model ID
 * @returns True if unsaved changes exist
 */
export function hasDraft(modelId: string): boolean {
  const key = `${DRAFT_KEY_PREFIX}${modelId}`;
  return localStorage.getItem(key) !== null;
}

/**
 * Get all draft model IDs
 * @returns Array of model IDs with drafts
 */
export function getAllDraftIds(): string[] {
  const draftIds: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key && key.startsWith(DRAFT_KEY_PREFIX) && !key.endsWith(TIMESTAMP_SUFFIX)) {
      const modelId = key.substring(DRAFT_KEY_PREFIX.length);
      draftIds.push(modelId);
    }
  }

  return draftIds;
}

/**
 * Get draft timestamp
 * @param modelId - Model ID
 * @returns ISO timestamp string or null
 */
export function getDraftTimestamp(modelId: string): string | null {
  const timestampKey = `${DRAFT_KEY_PREFIX}${modelId}${TIMESTAMP_SUFFIX}`;
  return localStorage.getItem(timestampKey);
}

/**
 * Clear all drafts
 */
export function clearAllDrafts(): void {
  const draftIds = getAllDraftIds();
  draftIds.forEach((id) => clearDraft(id));
}

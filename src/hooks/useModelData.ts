/**
 * useModelData Hook
 *
 * Custom React hook for fetching and caching product model data
 * Uses ModelService to load data and manages loading/error states
 */

import { useState, useEffect, useCallback } from 'react';
import { loadModel, loadModels, loadCatalogueIndex } from '@/services/modelService';
import type { ProductModel, CatalogueIndex } from '@/types';

interface UseModelDataResult {
  model: ProductModel | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseModelsDataResult {
  models: ProductModel[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseCatalogueResult {
  catalogue: CatalogueIndex | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single model by ID
 * Automatically refetches when modelId changes
 */
export function useModelData(modelId: string | null): UseModelDataResult {
  const [model, setModel] = useState<ProductModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModel = useCallback(async () => {
    if (!modelId) {
      setModel(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await loadModel(modelId);
      setModel(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load model'));
      setModel(null);
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  useEffect(() => {
    fetchModel();
  }, [fetchModel]);

  return {
    model,
    loading,
    error,
    refetch: fetchModel,
  };
}

/**
 * Hook to fetch multiple models by IDs
 * Automatically refetches when modelIds array changes
 */
export function useModelsData(modelIds: string[]): UseModelsDataResult {
  const [models, setModels] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModels = useCallback(async () => {
    if (!modelIds || modelIds.length === 0) {
      setModels([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await loadModels(modelIds);
      setModels(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load models'));
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, [modelIds.join(',')]); // Dependency on stringified IDs array

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    loading,
    error,
    refetch: fetchModels,
  };
}

/**
 * Hook to fetch the catalogue index
 * Loads once on mount unless explicitly refetched
 */
export function useCatalogueIndex(): UseCatalogueResult {
  const [catalogue, setCatalogue] = useState<CatalogueIndex | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCatalogue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loadCatalogueIndex();
      setCatalogue(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load catalogue'));
      setCatalogue(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogue();
  }, [fetchCatalogue]);

  return {
    catalogue,
    loading,
    error,
    refetch: fetchCatalogue,
  };
}

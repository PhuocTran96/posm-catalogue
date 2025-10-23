/**
 * usePOSMMarkers Hook
 *
 * Custom React hook for managing POSM marker state
 * Provides operations to add, move, delete, and manage markers
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { POSMMarker, Coordinates } from '@/types';

const MARKER_DRAFT_PREFIX = 'posm-marker-draft-';

// Helper functions for marker drafts in localStorage
function saveMarkerDraft(modelId: string, markers: POSMMarker[]): void {
  const key = `${MARKER_DRAFT_PREFIX}${modelId}`;
  localStorage.setItem(key, JSON.stringify(markers));
}

function loadMarkerDraft(modelId: string): POSMMarker[] | null {
  const key = `${MARKER_DRAFT_PREFIX}${modelId}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as POSMMarker[];
  } catch {
    return null;
  }
}

function hasMarkerDraft(modelId: string): boolean {
  const key = `${MARKER_DRAFT_PREFIX}${modelId}`;
  return localStorage.getItem(key) !== null;
}

function clearMarkerDraft(modelId: string): void {
  const key = `${MARKER_DRAFT_PREFIX}${modelId}`;
  localStorage.removeItem(key);
}

interface UsePOSMMarkersResult {
  markers: POSMMarker[];
  selectedMarkerId: string | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;

  // Selection operations
  selectMarker: (markerId: string | null) => void;

  // Marker operations
  addMarker: (position: Coordinates) => POSMMarker;
  updateMarkerPosition: (markerId: string, position: Coordinates) => void;
  updateMarkerInfo: (markerId: string, info: POSMMarker['info']) => void;
  deleteMarker: (markerId: string) => void;

  // Draft operations
  saveDraftMarkers: () => Promise<void>;
  loadDraftMarkers: () => Promise<boolean>;
  clearDraftMarkers: () => void;

  // Utility
  generateMarkerId: () => string;
}

/**
 * Hook to manage POSM markers for a specific model
 * Handles local state management and draft persistence
 */
export function usePOSMMarkers(modelId: string, initialMarkers: POSMMarker[] = []): UsePOSMMarkersResult {
  const [markers, setMarkers] = useState<POSMMarker[]>(initialMarkers);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const markerIdCounter = useRef(1);
  const lastSaveRef = useRef<POSMMarker[]>([]);
  const autoSaveTimerRef = useRef<number | undefined>(undefined);

  // Generate unique marker ID
  const generateMarkerId = useCallback((): string => {
    return `marker-${String(markerIdCounter.current++).padStart(3, '0')}`;
  }, []);

  // Initialize markers and check for drafts
  useEffect(() => {
    setMarkers(initialMarkers);
    lastSaveRef.current = initialMarkers;

    // Check for existing draft
    if (hasMarkerDraft(modelId)) {
      // Auto-load draft if it exists (async call, but we don't need to wait)
      loadDraftMarkers().catch(err => console.error('Failed to auto-load draft:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId, initialMarkers]);

  // Auto-save every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        saveDraftMarkers();
      }, 30000); // 30 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasUnsavedChanges, markers, modelId]);

  // Track unsaved changes
  useEffect(() => {
    const currentMarkersJSON = JSON.stringify(markers);
    const lastSaveJSON = JSON.stringify(lastSaveRef.current);
    setHasUnsavedChanges(currentMarkersJSON !== lastSaveJSON);
  }, [markers]);

  // Selection operations
  const selectMarker = useCallback((markerId: string | null) => {
    setSelectedMarkerId(markerId);
  }, []);

  // Marker operations
  const addMarker = useCallback((position: Coordinates): POSMMarker => {
    const newMarker: POSMMarker = {
      id: generateMarkerId(),
      position,
      info: {
        name: 'New POSM Marker',
        description: 'Click to edit details',
      },
      displayOptions: {
        iconColor: '#FF5733',
        iconSize: 32,
        zIndex: 1,
      },
    };

    setMarkers(prev => [...prev, newMarker]);
    return newMarker;
  }, [generateMarkerId]);

  const updateMarkerPosition = useCallback((markerId: string, position: Coordinates) => {
    setMarkers(prev =>
      prev.map(marker =>
        marker.id === markerId
          ? { ...marker, position }
          : marker
      )
    );
  }, []);

  const updateMarkerInfo = useCallback((markerId: string, info: POSMMarker['info']) => {
    setMarkers(prev =>
      prev.map(marker =>
        marker.id === markerId
          ? { ...marker, info }
          : marker
      )
    );
  }, []);

  const deleteMarker = useCallback((markerId: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== markerId));

    // Clear selection if deleted marker was selected
    if (selectedMarkerId === markerId) {
      setSelectedMarkerId(null);
    }
  }, [selectedMarkerId]);

  // Draft operations
  const saveDraftMarkers = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      saveMarkerDraft(modelId, markers);
      lastSaveRef.current = [...markers];
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save draft markers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [markers, modelId]);

  const loadDraftMarkers = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const draftMarkers = loadMarkerDraft(modelId);

      if (draftMarkers) {
        setMarkers(draftMarkers);
        lastSaveRef.current = [...draftMarkers];
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load draft markers:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [modelId]);

  const clearDraftMarkers = useCallback((): void => {
    clearMarkerDraft(modelId);
    setHasUnsavedChanges(false);
  }, [modelId]);

  return {
    markers,
    selectedMarkerId,
    hasUnsavedChanges,
    isLoading,
    selectMarker,
    addMarker,
    updateMarkerPosition,
    updateMarkerInfo,
    deleteMarker,
    saveDraftMarkers,
    loadDraftMarkers,
    clearDraftMarkers,
    generateMarkerId,
  };
}
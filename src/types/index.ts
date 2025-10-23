// Core data types for POSM Catalogue Platform

export interface Coordinates {
  x: number; // Horizontal position (0-100 percent)
  y: number; // Vertical position (0-100 percent)
}

export interface Dimensions {
  width: number;
  height: number;
  depth?: number;
  unit: string; // e.g., "cm", "in"
}

export interface DisplayOptions {
  iconColor?: string; // Hex color
  iconSize?: number; // Pixels
  zIndex?: number; // Stacking order
}

export interface POSMInformation {
  name: string;
  description: string;
  artworkUrl?: string;
  dimensions?: Dimensions;
  materialType?: string;
  notes?: string;
}

export interface POSMMarker {
  id: string;
  position: Coordinates;
  info: POSMInformation;
  displayOptions?: DisplayOptions;
}

export interface ModelImage {
  url: string;
  width: number;
  height: number;
  alt: string;
  format: string; // e.g., "webp", "jpeg", "png"
}

export interface ModelMetadata {
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  version: string; // Semver
  author?: string;
}

export interface ProductModel {
  id: string;
  name: string;
  code?: string;
  description?: string;
  categoryIds: string[];
  image: ModelImage;
  posmMarkers: POSMMarker[];
  metadata: ModelMetadata;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ModelSummary {
  id: string;
  name: string;
  code?: string;
  thumbnailUrl: string;
  categoryIds: string[];
  posmCount: number;
  dataUrl: string;
}

export interface CatalogueIndex {
  version: string;
  lastUpdated: string; // ISO 8601 timestamp
  totalModels: number;
  categories: Category[];
  models: ModelSummary[];
}

export interface UserSession {
  isAuthenticated: boolean;
  sessionToken: string;
  expiresAt: string; // ISO 8601 timestamp
  mode: 'viewer' | 'admin';
}

export interface ExportMetadata {
  totalModels: number;
  totalMarkers: number;
  exportedBy?: string;
  notes?: string;
}

export interface ExportData {
  exportedAt: string; // ISO 8601 timestamp
  exportType: 'full' | 'selective';
  version: string;
  models: ProductModel[];
  categories: Category[];
  metadata: ExportMetadata;
}

// Validation result type
export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Cache entry type
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Preload an image
 * @param url - Image URL
 * @returns Promise that resolves when image is loaded
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));

    img.src = url;
  });
}

/**
 * Get image dimensions
 * @param url - Image URL
 * @returns Promise resolving to width and height
 */
export async function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  const img = await preloadImage(url);
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

/**
 * Validate image format
 * @param filename - Image filename or URL
 * @returns True if format is supported
 */
export function validateImageFormat(filename: string): boolean {
  const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const lowerFilename = filename.toLowerCase();

  return supportedFormats.some((format) => lowerFilename.endsWith(format));
}

/**
 * Check if image URL is valid (exists and loads)
 * @param url - Image URL
 * @returns Promise resolving to true if image loads successfully
 */
export async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    await preloadImage(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create thumbnail data URL from image
 * @param imageUrl - Original image URL
 * @param maxWidth - Maximum thumbnail width
 * @param maxHeight - Maximum thumbnail height
 * @returns Promise resolving to data URL
 */
export async function createThumbnail(
  imageUrl: string,
  maxWidth: number = 200,
  maxHeight: number = 200
): Promise<string> {
  const img = await preloadImage(imageUrl);

  // Calculate thumbnail dimensions maintaining aspect ratio
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = width * ratio;
    height = height * ratio;
  }

  // Create canvas and draw thumbnail
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * Get file size of image
 * @param url - Image URL
 * @returns Promise resolving to file size in bytes
 */
export async function getImageFileSize(url: string): Promise<number> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');

    return contentLength ? parseInt(contentLength, 10) : 0;
  } catch (error) {
    console.error('Error getting image file size:', error);
    return 0;
  }
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

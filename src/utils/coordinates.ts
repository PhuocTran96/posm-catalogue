import type { Coordinates } from '@/types';

/**
 * Convert percentage coordinates to pixel coordinates
 * @param percent - Percentage value (0-100)
 * @param dimension - Image dimension in pixels (width or height)
 * @returns Pixel value
 */
export function percentToPixels(percent: number, dimension: number): number {
  return (percent / 100) * dimension;
}

/**
 * Convert pixel coordinates to percentage coordinates
 * @param pixels - Pixel value
 * @param dimension - Image dimension in pixels (width or height)
 * @returns Percentage value (0-100)
 */
export function pixelsToPercent(pixels: number, dimension: number): number {
  if (dimension === 0) return 0;
  return (pixels / dimension) * 100;
}

/**
 * Validate that coordinates are within valid bounds (0-100%)
 * @param coordinates - Coordinates to validate
 * @returns True if valid, false otherwise
 */
export function validateCoordinates(coordinates: Coordinates): boolean {
  return (
    coordinates.x >= 0 &&
    coordinates.x <= 100 &&
    coordinates.y >= 0 &&
    coordinates.y <= 100
  );
}

/**
 * Clamp coordinates to valid bounds (0-100%)
 * @param coordinates - Coordinates to clamp
 * @returns Clamped coordinates
 */
export function clampCoordinates(coordinates: Coordinates): Coordinates {
  return {
    x: Math.max(0, Math.min(100, coordinates.x)),
    y: Math.max(0, Math.min(100, coordinates.y)),
  };
}

/**
 * Calculate absolute position for marker icon (centered on coordinate)
 * @param coordinates - Percentage coordinates
 * @param imageWidth - Image width in pixels
 * @param imageHeight - Image height in pixels
 * @param iconSize - Icon size in pixels (default: 32)
 * @returns Object with left and top pixel positions
 */
export function calculateMarkerPosition(
  coordinates: Coordinates,
  imageWidth: number,
  imageHeight: number,
  iconSize: number = 32
): { left: number; top: number } {
  const x = percentToPixels(coordinates.x, imageWidth);
  const y = percentToPixels(coordinates.y, imageHeight);

  // Center the icon on the coordinate point
  return {
    left: x - iconSize / 2,
    top: y - iconSize / 2,
  };
}

/**
 * Calculate percentage coordinates from mouse/touch event
 * @param event - Mouse or touch event
 * @param imageElement - Image HTML element
 * @returns Percentage coordinates
 */
export function getCoordinatesFromEvent(
  event: MouseEvent | TouchEvent,
  imageElement: HTMLElement
): Coordinates {
  const rect = imageElement.getBoundingClientRect();

  let clientX: number, clientY: number;

  if ('touches' in event && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else if ('clientX' in event) {
    clientX = event.clientX;
    clientY = event.clientY;
  } else {
    return { x: 0, y: 0 };
  }

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const percentX = pixelsToPercent(x, rect.width);
  const percentY = pixelsToPercent(y, rect.height);

  return clampCoordinates({ x: percentX, y: percentY });
}

/**
 * POSMHotspot Component
 *
 * Renders an interactive marker at a percentage-based coordinate
 * Handles click events and applies styling
 */

import { calculateMarkerPosition } from '@/utils/coordinates';
import type { POSMMarker } from '@/types';

interface POSMHotspotProps {
  marker: POSMMarker;
  imageWidth: number;
  imageHeight: number;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

/**
 * POSMHotspot component for interactive markers on model images
 */
export function POSMHotspot({
  marker,
  imageWidth,
  imageHeight,
  onClick,
  isSelected = false,
  className = '',
}: POSMHotspotProps) {
  // Get marker icon size from display options or use default
  const iconSize = marker.displayOptions?.iconSize || 32;
  const iconColor = marker.displayOptions?.iconColor || '#3B82F6'; // blue-600
  const zIndex = marker.displayOptions?.zIndex || 10;

  // Calculate pixel position from percentage coordinates
  const position = calculateMarkerPosition(
    marker.position,
    imageWidth,
    imageHeight,
    iconSize
  );

  return (
    <button
      onClick={onClick}
      className={`absolute pointer-events-auto group cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-full ${
        isSelected ? 'scale-125 ring-2 ring-blue-600' : ''
      } ${className}`}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        zIndex,
      }}
      aria-label={`POSM marker: ${marker.info.name}`}
      title={marker.info.name}
    >
      {/* Marker Icon - Pulsing Pin */}
      <div className="relative w-full h-full">
        {/* Pulse Animation Ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{
            backgroundColor: iconColor,
          }}
        />

        {/* Main Pin Icon */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: iconColor,
          }}
        >
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg">
            {marker.info.name}
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Screen Reader Text */}
      <span className="sr-only">
        View POSM details for {marker.info.name}
      </span>
    </button>
  );
}

export default POSMHotspot;

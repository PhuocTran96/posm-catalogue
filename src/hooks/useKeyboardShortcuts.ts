/**
 * useKeyboardShortcuts Hook
 *
 * Custom hook for implementing keyboard shortcuts throughout the app
 */

import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  handler: () => void;
}

/**
 * Hook to register keyboard shortcuts
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
        const shiftMatches = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
        const altMatches = shortcut.altKey === undefined || event.altKey === shortcut.altKey;
        const metaMatches = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);
}

/**
 * Global keyboard shortcuts for the application
 */
export const globalShortcuts = {
  SEARCH: {
    key: '/',
    description: 'Focus search bar',
  },
  ESCAPE: {
    key: 'Escape',
    description: 'Close modal/dialog',
  },
  HELP: {
    key: '?',
    shiftKey: true,
    description: 'Show keyboard shortcuts',
  },
  ADMIN: {
    key: 'a',
    ctrlKey: true,
    shiftKey: true,
    description: 'Go to admin panel',
  },
  HOME: {
    key: 'h',
    ctrlKey: true,
    description: 'Go to home',
  },
};

/**
 * Hook for focus management and keyboard navigation
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, active = true) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Auto-focus first element
    firstElement.focus();

    container.addEventListener('keydown', handleTabKey as EventListener);

    return () => {
      container.removeEventListener('keydown', handleTabKey as EventListener);
    };
  }, [containerRef, active]);
}

export default useKeyboardShortcuts;

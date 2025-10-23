/**
 * SearchBar Component
 *
 * Modern search input with autocomplete suggestions and filters
 * Features keyboard navigation, loading states, and responsive design
 */

import { useState, useRef, useEffect, useCallback } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  debounceMs?: number;
  suggestions?: string[];
}

export const SearchBar = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Search products, models, or categories...",
  debounceMs = 300,
  suggestions = []
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Sync local value with prop value
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    (newValue: string) => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(() => {
        onChange(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  // Filter suggestions based on input
  const filteredSuggestions = suggestions
    .filter(suggestion =>
      suggestion.toLowerCase().includes(localValue.toLowerCase())
    )
    .slice(0, 8);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      if (activeSuggestion > -1) {
        e.preventDefault();
        const suggestion = filteredSuggestions[activeSuggestion];
        setLocalValue(suggestion);
        onChange(suggestion);
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalValue(suggestion);
    onChange(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  // Keyboard shortcut: Ctrl/Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when focused and there are suggestions
  useEffect(() => {
    if (isFocused && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [isFocused, filteredSuggestions.length]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className={`w-5 h-5 transition-colors ${
              isFocused ? 'text-primary-500' : 'text-secondary-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={`input pl-12 pr-12 h-12 text-lg rounded-xl transition-all duration-200 ${
            isFocused
              ? 'ring-2 ring-primary-500 ring-offset-2 shadow-medium border-primary-500'
              : 'hover:border-secondary-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Search"
          role="searchbox"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
        />

        {/* Clear button */}
        {localValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5 text-secondary-400 hover:text-secondary-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Keyboard Shortcut Hint */}
        {!localValue && !disabled && !isFocused && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-semibold text-secondary-500 bg-secondary-100 border border-secondary-200 rounded">
              {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K
            </kbd>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-large border border-secondary-100 overflow-hidden">
          <ul className="py-2" role="listbox">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                role="option"
                aria-selected={index === activeSuggestion}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === activeSuggestion
                    ? 'bg-primary-50 text-primary-900 border-r-2 border-primary-500'
                    : 'hover:bg-secondary-50 text-secondary-900'
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setActiveSuggestion(index)}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="font-medium">{suggestion}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* Search for current input */}
          {localValue && (
            <div className="border-t border-secondary-100 p-2">
              <button
                onClick={() => {
                  onChange(localValue);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center space-x-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium">Search for "{localValue}"</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading indicator overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

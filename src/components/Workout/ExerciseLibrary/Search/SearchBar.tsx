import React, { useRef, useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  onSearchSubmit: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearchSubmit,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder = 'Search exercises, muscles or equipment...',
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isShortcutTriggered = useRef(false);
  const [isFocused, setIsFocused] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isShortcutTriggered.current = true;
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    // Only auto-select text when opened via Ctrl+K shortcut
    if (isShortcutTriggered.current && value.length > 0 && inputRef.current) {
      inputRef.current.select();
      isShortcutTriggered.current = false;
    }
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    isShortcutTriggered.current = false;
    if (onBlur) onBlur();
  };

  const handleSubmit = () => {
    if (isLoading) return;
    onSearchSubmit(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      if (value.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        onChange('');
      } else {
        if (inputRef.current) inputRef.current.blur();
      }
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="fitbee-search-bar-wrapper">
      <div className="fitbee-search-bar-inner">
        {/* Search Icon or Loading Spinner */}
        <span className="fitbee-search-bar-icon" aria-hidden="true">
          {isLoading ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          )}
        </span>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          className="fitbee-search-bar-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search exercises"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
        />

        {/* Shortcut Badge (Hidden when focused or text entered) */}
        {!isFocused && value.length === 0 && (
          <kbd className="fitbee-search-kbd-badge" title="Shortcut: Ctrl+K / Cmd+K">
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        )}

        {/* Clear Button */}
        {value.length > 0 && (
          <button
            type="button"
            className="fitbee-search-bar-clear-btn"
            onClick={handleClear}
            aria-label="Clear search text"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Submit Search Button (Disabled when loading) */}
        <button
          type="button"
          className="fitbee-search-bar-submit-btn"
          onClick={handleSubmit}
          disabled={isLoading}
          aria-label="Submit search"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
};



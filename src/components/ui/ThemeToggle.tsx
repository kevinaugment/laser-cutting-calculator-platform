/**
 * Theme Toggle Component
 * Allows users to switch between light and dark modes
 */

import React from 'react';
import { useTheme } from '../../theme';

export function ThemeToggle() {
  const { theme, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:bg-neutral-800"
      style={{
        backgroundColor: 'var(--color-neutral-50)',
        color: 'var(--color-neutral-700)',
        border: '1px solid var(--color-neutral-200)',
      }}
      aria-label={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme.mode === 'light' ? (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
      <span className="ml-2">
        {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
      </span>
    </button>
  );
}

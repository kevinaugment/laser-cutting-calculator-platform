/**
 * Theme Provider
 * React Context provider for unified theme system
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeContextValue } from './types';
import { lightTheme, darkTheme } from './config';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: 'light' | 'dark';
}

export function ThemeProvider({ children, defaultMode = 'light' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<'light' | 'dark'>(() => {
    // Check localStorage for saved preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return defaultMode;
  });

  const theme: Theme = mode === 'dark' ? darkTheme : lightTheme;

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setModeState(newMode);
  };

  const setMode = (newMode: 'light' | 'dark') => {
    setModeState(newMode);
  };

  // Save to localStorage and update CSS variables
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', mode);
      
      // Update CSS custom properties for the current theme
      const root = document.documentElement;
      
      // Update color variables
      Object.entries(theme.colors.primary).forEach(([key, value]) => {
        root.style.setProperty(`--color-primary-${key}`, value);
      });
      
      Object.entries(theme.colors.secondary).forEach(([key, value]) => {
        root.style.setProperty(`--color-secondary-${key}`, value);
      });
      
      Object.entries(theme.colors.neutral).forEach(([key, value]) => {
        root.style.setProperty(`--color-neutral-${key}`, value);
      });
      
      // Update semantic colors
      Object.entries(theme.colors.success).forEach(([key, value]) => {
        root.style.setProperty(`--color-success-${key}`, value);
      });
      
      Object.entries(theme.colors.warning).forEach(([key, value]) => {
        root.style.setProperty(`--color-warning-${key}`, value);
      });
      
      Object.entries(theme.colors.error).forEach(([key, value]) => {
        root.style.setProperty(`--color-error-${key}`, value);
      });
      
      Object.entries(theme.colors.info).forEach(([key, value]) => {
        root.style.setProperty(`--color-info-${key}`, value);
      });
      
      // Update spacing variables
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
      
      // Update typography variables
      root.style.setProperty('--font-family-sans', theme.typography.fontFamily.sans.join(', '));
      root.style.setProperty('--font-family-mono', theme.typography.fontFamily.mono.join(', '));
      
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });
      
      // Update border radius variables
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });
      
      // Update shadow variables
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
      
      // Update breakpoint variables
      Object.entries(theme.breakpoints).forEach(([key, value]) => {
        root.style.setProperty(`--breakpoint-${key}`, value);
      });
      
      // Update data attribute for CSS selectors
      root.setAttribute('data-theme', mode);
    }
  }, [mode, theme]);

  const value: ThemeContextValue = {
    theme,
    toggleMode,
    setMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility hook for accessing theme values directly
export function useThemeValues() {
  const { theme } = useTheme();
  return theme;
}

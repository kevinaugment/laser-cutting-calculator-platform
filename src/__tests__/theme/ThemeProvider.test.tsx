/**
 * Theme Provider Tests
 * Tests for the unified theme system
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider, useTheme } from '../../theme';

// Test component that uses the theme
function TestComponent() {
  const { theme, toggleMode } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-mode">{theme.mode}</div>
      <div data-testid="primary-color">{theme.colors.primary[600]}</div>
      <button onClick={toggleMode} data-testid="toggle-button">
        Toggle Mode
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    expect(screen.getByTestId('primary-color')).toHaveTextContent('#2563eb');
  });

  it('toggles between light and dark modes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');
    const modeDisplay = screen.getByTestId('theme-mode');

    // Initially light
    expect(modeDisplay).toHaveTextContent('light');

    // Toggle to dark
    fireEvent.click(toggleButton);
    expect(modeDisplay).toHaveTextContent('dark');

    // Toggle back to light
    fireEvent.click(toggleButton);
    expect(modeDisplay).toHaveTextContent('light');
  });

  it('persists theme mode in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-button');

    // Toggle to dark mode
    fireEvent.click(toggleButton);

    // Check localStorage
    expect(localStorage.getItem('theme-mode')).toBe('dark');
  });

  it('loads saved theme mode from localStorage', () => {
    // Pre-set localStorage
    localStorage.setItem('theme-mode', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('uses default mode when localStorage is empty', () => {
    render(
      <ThemeProvider defaultMode="dark">
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('throws error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('updates CSS custom properties when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const root = document.documentElement;
    
    // Check that CSS variables are set
    expect(root.style.getPropertyValue('--color-primary-600')).toBe('#2563eb');
    expect(root.getAttribute('data-theme')).toBe('light');

    // Toggle to dark mode
    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton);

    // Check that data-theme attribute is updated
    expect(root.getAttribute('data-theme')).toBe('dark');
  });
});

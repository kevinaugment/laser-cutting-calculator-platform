/**
 * Design System Showcase Page
 * Demonstrates the unified design system components and tokens
 */

import React from 'react';
import { useTheme, colors, typography, spacing } from '../theme';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export function DesignSystemPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ color: 'var(--color-neutral-900)' }}
            >
              Design System
            </h1>
            <p 
              className="text-lg"
              style={{ color: 'var(--color-neutral-600)' }}
            >
              Unified design system for Laser Cutting Calculator Platform
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: 'var(--color-neutral-800)' }}
          >
            Color Palette
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-neutral-700)' }}>
                Primary (Industrial Blue)
              </h3>
              <div className="space-y-2">
                {Object.entries(colors.primary).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-8 rounded border"
                      style={{ backgroundColor: value }}
                    />
                    <span className="text-sm font-mono" style={{ color: 'var(--color-neutral-600)' }}>
                      {key}: {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Colors */}
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-neutral-700)' }}>
                Secondary (Steel Gray)
              </h3>
              <div className="space-y-2">
                {Object.entries(colors.secondary).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-8 rounded border"
                      style={{ backgroundColor: value }}
                    />
                    <span className="text-sm font-mono" style={{ color: 'var(--color-neutral-600)' }}>
                      {key}: {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-neutral-700)' }}>
                Semantic Colors
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-600)' }}>Success</h4>
                  {Object.entries(colors.success).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 mb-1">
                      <div 
                        className="w-8 h-6 rounded border"
                        style={{ backgroundColor: value }}
                      />
                      <span className="text-xs font-mono" style={{ color: 'var(--color-neutral-600)' }}>
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-600)' }}>Warning</h4>
                  {Object.entries(colors.warning).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 mb-1">
                      <div 
                        className="w-8 h-6 rounded border"
                        style={{ backgroundColor: value }}
                      />
                      <span className="text-xs font-mono" style={{ color: 'var(--color-neutral-600)' }}>
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-600)' }}>Error</h4>
                  {Object.entries(colors.error).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3 mb-1">
                      <div 
                        className="w-8 h-6 rounded border"
                        style={{ backgroundColor: value }}
                      />
                      <span className="text-xs font-mono" style={{ color: 'var(--color-neutral-600)' }}>
                        {key}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: 'var(--color-neutral-800)' }}
          >
            Typography
          </h2>
          
          <div className="space-y-4">
            {Object.entries(typography.fontSize).map(([key, value]) => (
              <div key={key} className="flex items-baseline space-x-4">
                <span 
                  className="w-12 text-sm font-mono"
                  style={{ color: 'var(--color-neutral-500)' }}
                >
                  {key}
                </span>
                <span 
                  style={{ 
                    fontSize: value,
                    color: 'var(--color-neutral-800)',
                    fontFamily: 'var(--font-family-sans)'
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
                <span 
                  className="text-xs font-mono"
                  style={{ color: 'var(--color-neutral-400)' }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: 'var(--color-neutral-800)' }}
          >
            Spacing Scale
          </h2>
          
          <div className="space-y-3">
            {Object.entries(spacing).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-4">
                <span 
                  className="w-12 text-sm font-mono"
                  style={{ color: 'var(--color-neutral-500)' }}
                >
                  {key}
                </span>
                <div 
                  className="bg-blue-200 h-4"
                  style={{ width: value }}
                />
                <span 
                  className="text-sm font-mono"
                  style={{ color: 'var(--color-neutral-600)' }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Component Examples */}
        <section>
          <h2 
            className="text-2xl font-semibold mb-6"
            style={{ color: 'var(--color-neutral-800)' }}
          >
            Component Examples
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-neutral-700)' }}>
                Buttons
              </h3>
              <div className="space-y-3">
                <button 
                  className="px-4 py-2 rounded-md font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--color-primary-600)',
                    color: 'white',
                  }}
                >
                  Primary Button
                </button>
                <button 
                  className="px-4 py-2 rounded-md font-medium transition-colors border"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary-600)',
                    borderColor: 'var(--color-primary-600)',
                  }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--color-neutral-700)' }}>
                Cards
              </h3>
              <div 
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: 'var(--color-neutral-50)',
                  borderColor: 'var(--color-neutral-200)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <h4 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-neutral-800)' }}>
                  Card Title
                </h4>
                <p style={{ color: 'var(--color-neutral-600)' }}>
                  This is an example card using the design system tokens.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

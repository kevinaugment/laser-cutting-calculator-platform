'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { initializeLanguage } from '@/lib/i18n';
import { useLanguageDetection } from '@/lib/i18n/hooks';

interface I18nProviderProps {
  children: React.ReactNode;
}

/**
 * I18n Provider Component
 * Initializes internationalization for the entire application
 * Supports English (US), German (DE), and Japanese (JP)
 */
export default function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isLanguageDetected } = useLanguageDetection();

  useEffect(() => {
    const initI18n = async () => {
      try {
        // Initialize language detection and preferences
        initializeLanguage();
        
        // Wait for i18n to be ready
        await i18n.loadNamespaces(['common', 'calculators']);
        
        setIsInitialized(true);
        
        // Log successful initialization
        console.log('✅ I18n initialized successfully');
        console.log(`Current language: ${i18n.language}`);
        console.log(`Available languages: ${Object.keys(i18n.store.data).join(', ')}`);
        
      } catch (error) {
        console.error('❌ Failed to initialize i18n:', error);
        setIsInitialized(true); // Still render with fallback
      }
    };

    initI18n();
  }, []);

  // Show loading state while i18n is initializing
  if (!isInitialized || !isLanguageDetected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Initializing language settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

/**
 * Language Loading Component
 * Shows loading state during language changes
 */
export function LanguageLoader({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-700 dark:text-gray-300">
            Switching language...
          </span>
        </div>
      </div>
    </div>
  );
}

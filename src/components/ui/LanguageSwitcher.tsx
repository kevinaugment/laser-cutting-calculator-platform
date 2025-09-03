'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, GlobeIcon } from '@heroicons/react/24/outline';
import { 
  changeLanguage, 
  getAvailableLanguages, 
  getCurrentLanguageInfo,
  type SupportedLanguage,
  type LanguageSwitcherProps 
} from '@/lib/i18n';

/**
 * Language Switcher Component
 * Supports English (US), German (DE), and Japanese (JP) - Top 3 laser cutting markets
 */
export default function LanguageSwitcher({
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = true,
  className = '',
  onLanguageChange
}: LanguageSwitcherProps) {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const availableLanguages = getAvailableLanguages();
  const currentLanguage = getCurrentLanguageInfo();

  const handleLanguageChange = async (languageCode: SupportedLanguage) => {
    try {
      await changeLanguage(languageCode);
      setIsOpen(false);
      onLanguageChange?.(languageCode);
      
      // Announce language change for screen readers
      const announcement = t('success.language_changed', { 
        language: availableLanguages.find(lang => lang.code === languageCode)?.name 
      });
      
      // Create temporary announcement element
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;
      document.body.appendChild(announcer);
      
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block text-left ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={t('navigation.language')}
        >
          <GlobeIcon className="w-4 h-4 mr-2" />
          {showFlags && (
            <span className="mr-2 text-lg" role="img" aria-label={currentLanguage.name}>
              {currentLanguage.flag}
            </span>
          )}
          <span className="hidden sm:inline">
            {showNativeNames ? currentLanguage.nativeName : currentLanguage.name}
          </span>
          <span className="sm:hidden">
            {currentLanguage.code.split('-')[0].toUpperCase()}
          </span>
          <ChevronDownIcon className="w-4 h-4 ml-2" />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:border-gray-700">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`
                    group flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700
                    ${language.code === currentLanguage.code 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'text-gray-700 dark:text-gray-200'
                    }
                  `}
                  role="menuitem"
                  aria-current={language.code === currentLanguage.code ? 'true' : 'false'}
                >
                  {showFlags && (
                    <span className="mr-3 text-lg" role="img" aria-label={language.name}>
                      {language.flag}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {showNativeNames ? language.nativeName : language.name}
                    </span>
                    {language.market && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {language.market}
                      </span>
                    )}
                  </div>
                  {language.code === currentLanguage.code && (
                    <span className="ml-auto text-blue-600 dark:text-blue-400">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Button variant
  if (variant === 'buttons') {
    return (
      <div className={`flex space-x-1 ${className}`} role="group" aria-label={t('navigation.language')}>
        {availableLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`
              px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
              ${language.code === currentLanguage.code
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
              }
            `}
            aria-current={language.code === currentLanguage.code ? 'true' : 'false'}
            aria-label={`${t('navigation.language')}: ${language.name}`}
          >
            {showFlags && (
              <span className="mr-1 text-base" role="img" aria-label={language.name}>
                {language.flag}
              </span>
            )}
            <span className="hidden sm:inline">
              {showNativeNames ? language.nativeName : language.name}
            </span>
            <span className="sm:hidden">
              {language.code.split('-')[0].toUpperCase()}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // Flags variant
  if (variant === 'flags') {
    return (
      <div className={`flex space-x-2 ${className}`} role="group" aria-label={t('navigation.language')}>
        {availableLanguages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`
              p-2 text-2xl rounded-md transition-all duration-200 hover:scale-110
              ${language.code === currentLanguage.code
                ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md'
                : 'hover:shadow-sm'
              }
            `}
            aria-current={language.code === currentLanguage.code ? 'true' : 'false'}
            aria-label={`${t('navigation.language')}: ${language.name}`}
            title={showNativeNames ? language.nativeName : language.name}
          >
            <span role="img" aria-label={language.name}>
              {language.flag}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return null;
}

// Hook for using language switcher functionality
export function useLanguageSwitcher() {
  const { i18n } = useTranslation();
  const availableLanguages = getAvailableLanguages();
  const currentLanguage = getCurrentLanguageInfo();

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage: async (languageCode: SupportedLanguage) => {
      await changeLanguage(languageCode);
    },
    isLanguageSupported: (languageCode: string): languageCode is SupportedLanguage => {
      return availableLanguages.some(lang => lang.code === languageCode);
    }
  };
}

// Compact language switcher for mobile/small spaces
export function CompactLanguageSwitcher({ className = '' }: { className?: string }) {
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguageSwitcher();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 text-lg rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Change language"
      >
        <span role="img" aria-label={currentLanguage.name}>
          {currentLanguage.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="py-1">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  changeLanguage(language.code);
                  setIsOpen(false);
                }}
                className={`
                  flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                  ${language.code === currentLanguage.code ? 'bg-blue-50 dark:bg-blue-900' : ''}
                `}
              >
                <span className="mr-2 text-base" role="img" aria-label={language.name}>
                  {language.flag}
                </span>
                <span className="text-xs">{language.nativeName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

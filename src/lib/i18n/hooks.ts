// Custom hooks for internationalization
// Provides type-safe translation functions and utilities

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  changeLanguage,
  getCurrentLanguageInfo,
  type SupportedLanguage
} from './index';

// Simplified formatting functions
const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat('en-US', options).format(value);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

const formatPercentage = (value: number, decimals: number = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

const formatUnit = (value: number, unit: string): string => {
  const formattedValue = formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  });
  return `${formattedValue} ${unit}`;
};

/**
 * Enhanced useTranslation hook with type safety and formatting utilities
 */
export function useTranslation(namespace: 'common' | 'calculators' = 'common'): UseTranslationReturn {
  const { t: originalT, i18n } = useI18nTranslation(namespace);
  
  // Type-safe translation function with interpolation
  const t = (key: string, options?: TranslationOptions): string => {
    try {
      return originalT(key, options);
    } catch (error) {
      console.warn(`Translation key not found: ${namespace}:${key}`);
      return key; // Fallback to key if translation fails
    }
  };

  return {
    t,
    i18n: {
      language: (i18n?.language || 'en') as SupportedLanguage,
      changeLanguage: async (language: SupportedLanguage) => {
        await changeLanguage(language);
      },
      exists: (key: string, options?: { ns?: string }) => {
        return i18n?.exists(key, options) || false;
      }
    }
  };
}

/**
 * Hook for calculator-specific translations
 */
export function useCalculatorTranslation(calculatorId: string) {
  const { t } = useTranslation('calculators');
  
  const getCalculatorTitle = (): string => {
    return t(`${calculatorId}.title`);
  };
  
  const getCalculatorDescription = (): string => {
    return t(`${calculatorId}.description`);
  };
  
  const getInputLabel = (inputId: string): string => {
    return t(`${calculatorId}.inputs.${inputId}.label`);
  };
  
  const getInputHelp = (inputId: string): string => {
    return t(`${calculatorId}.inputs.${inputId}.help`);
  };
  
  const getInputPlaceholder = (inputId: string): string => {
    return t(`${calculatorId}.inputs.${inputId}.placeholder`);
  };
  
  const getResultLabel = (resultId: string): string => {
    return t(`${calculatorId}.results.${resultId}`);
  };
  
  const getValidationMessage = (messageId: string, options?: TranslationOptions): string => {
    return t(`common.validation_messages.${messageId}`, options);
  };

  return {
    t,
    getCalculatorTitle,
    getCalculatorDescription,
    getInputLabel,
    getInputHelp,
    getInputPlaceholder,
    getResultLabel,
    getValidationMessage
  };
}

/**
 * Hook for formatting numbers, currencies, and units according to current locale
 */
export function useLocaleFormatting() {
  const { i18n } = useTranslation();
  
  return {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => 
      formatNumber(value, options),
    
    formatCurrency: (value: number) => 
      formatCurrency(value),
    
    formatPercentage: (value: number, decimals?: number) => 
      formatPercentage(value, decimals),
    
    formatUnit: (value: number, unit: string) => 
      formatUnit(value, unit),
    
    // Format calculation results with appropriate precision
    formatCalculationResult: (value: number, unit?: string, precision: number = 2): string => {
      const formattedValue = formatNumber(value, {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision
      });
      
      return unit ? `${formattedValue} ${unit}` : formattedValue;
    },
    
    // Format time duration in appropriate units
    formatDuration: (minutes: number): string => {
      const { t } = useTranslation();
      
      if (minutes < 1) {
        const seconds = Math.round(minutes * 60);
        return `${seconds} ${t('units.time.seconds')}`;
      } else if (minutes < 60) {
        return `${formatNumber(minutes, { maximumFractionDigits: 1 })} ${t('units.time.minutes')}`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);
        return `${hours} ${t('units.time.hours')} ${remainingMinutes} ${t('units.time.minutes')}`;
      }
    },
    
    // Format file size
    formatFileSize: (bytes: number): string => {
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = bytes;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${formatNumber(size, { maximumFractionDigits: 1 })} ${units[unitIndex]}`;
    }
  };
}

/**
 * Hook for language detection and management
 */
export function useLanguageDetection() {
  const [detectedLanguage, setDetectedLanguage] = useState<SupportedLanguage>('en-US');
  const [isLanguageDetected, setIsLanguageDetected] = useState(false);
  
  useEffect(() => {
    // Detect language from various sources
    const detectLanguage = (): SupportedLanguage => {
      // 1. Check localStorage
      const savedLanguage = localStorage.getItem('laser-calc-language') as SupportedLanguage;
      if (savedLanguage && ['en-US', 'de-DE', 'ja-JP'].includes(savedLanguage)) {
        return savedLanguage;
      }
      
      // 2. Check browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith('de')) {
        return 'de-DE';
      } else if (browserLang.startsWith('ja')) {
        return 'ja-JP';
      }
      
      // 3. Check Accept-Language header (if available)
      const acceptLanguage = navigator.languages?.[0];
      if (acceptLanguage?.startsWith('de')) {
        return 'de-DE';
      } else if (acceptLanguage?.startsWith('ja')) {
        return 'ja-JP';
      }
      
      // 4. Default to English
      return 'en-US';
    };
    
    const detected = detectLanguage();
    setDetectedLanguage(detected);
    setIsLanguageDetected(true);
    
    // Auto-apply detected language
    changeLanguage(detected);
  }, []);
  
  return {
    detectedLanguage,
    isLanguageDetected,
    applyDetectedLanguage: () => changeLanguage(detectedLanguage)
  };
}

/**
 * Hook for managing language preferences and persistence
 */
export function useLanguagePreferences() {
  const [preferences, setPreferences] = useState({
    autoDetect: true,
    fallbackLanguage: 'en-US' as SupportedLanguage,
    showNativeNames: true,
    showFlags: true
  });
  
  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('laser-calc-language-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse language preferences:', error);
      }
    }
  }, []);
  
  const updatePreferences = (newPreferences: Partial<typeof preferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('laser-calc-language-preferences', JSON.stringify(updated));
  };
  
  return {
    preferences,
    updatePreferences
  };
}

/**
 * Hook for translation validation and debugging
 */
export function useTranslationValidation() {
  const { i18n } = useTranslation();
  
  const validateTranslationKey = (key: string, namespace: string = 'common'): boolean => {
    return i18n.exists(key, { ns: namespace });
  };
  
  const getMissingTranslations = (keys: string[], namespace: string = 'common'): string[] => {
    return keys.filter(key => !validateTranslationKey(key, namespace));
  };
  
  const logMissingTranslation = (key: string, namespace: string = 'common') => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation: ${namespace}:${key} for language: ${i18n.language}`);
    }
  };
  
  return {
    validateTranslationKey,
    getMissingTranslations,
    logMissingTranslation
  };
}

/**
 * Hook for RTL/LTR text direction (all supported languages are LTR)
 */
export function useTextDirection() {
  const currentLanguage = getCurrentLanguageInfo();
  
  // All supported languages (EN, DE, JP) are left-to-right
  const direction = 'ltr';
  const isRTL = false;
  
  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);
  
  return {
    direction,
    isRTL,
    textAlign: isRTL ? 'right' : 'left',
    marginStart: isRTL ? 'marginRight' : 'marginLeft',
    marginEnd: isRTL ? 'marginLeft' : 'marginRight'
  };
}

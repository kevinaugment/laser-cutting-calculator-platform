// Simplified Internationalization configuration for Laser Cutting Calculator Platform
// Supports: English (default) - Simplified for React 18 compatibility

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simplified translations - inline for React 18 compatibility
const translations = {
  en: {
    common: {
      title: "Laser Cutting Calculator Platform",
      loading: "Loading...",
      calculate: "Calculate",
      reset: "Reset",
      back: "Back"
    },
    calculators: {
      title: "Calculators",
      description: "Professional laser cutting calculators"
    }
  }
};

// Simplified language configuration
export const supportedLanguages = {
  'en': {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    default: true
  }
};
export type SupportedLanguage = keyof typeof supportedLanguages;

// Simplified translation resources
const resources = {
  en: translations.en
};

// Simplified i18n configuration for React 18 compatibility
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'calculators'],

    interpolation: {
      escapeValue: false // React already escapes values
    },

    react: {
      useSuspense: false // Disable suspense for React 18 compatibility
    }
  });

// Simplified language utilities
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(language);
  document.documentElement.lang = language;
};

export const getCurrentLanguageInfo = () => {
  return supportedLanguages['en'];
};

export default i18n;

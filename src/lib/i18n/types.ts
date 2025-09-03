// TypeScript type definitions for i18n translations
// Ensures type safety for translation keys across the application

import { supportedLanguages } from './index';

// Supported language codes
export type SupportedLanguage = keyof typeof supportedLanguages;

// Translation namespace types
export type TranslationNamespace = 'common' | 'calculators';

// Common translation keys structure
export interface CommonTranslations {
  navigation: {
    home: string;
    calculators: string;
    about: string;
    help: string;
    contact: string;
    language: string;
  };
  actions: {
    calculate: string;
    reset: string;
    clear: string;
    export: string;
    download: string;
    copy: string;
    share: string;
    save: string;
    load: string;
    cancel: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    edit: string;
    delete: string;
    add: string;
    remove: string;
  };
  status: {
    loading: string;
    calculating: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    completed: string;
    failed: string;
    pending: string;
    processing: string;
  };
  validation: {
    required: string;
    invalid: string;
    min: string;
    max: string;
    range: string;
    positive: string;
    integer: string;
    decimal: string;
    email: string;
    url: string;
  };
  units: {
    length: {
      mm: string;
      cm: string;
      m: string;
      inch: string;
      feet: string;
    };
    power: {
      W: string;
      kW: string;
      hp: string;
    };
    speed: {
      mm_min: string;
      m_min: string;
      ipm: string;
    };
    pressure: {
      bar: string;
      psi: string;
      kPa: string;
    };
    time: {
      seconds: string;
      minutes: string;
      hours: string;
      days: string;
    };
    temperature: {
      celsius: string;
      fahrenheit: string;
      kelvin: string;
    };
    currency: {
      usd: string;
      eur: string;
      jpy: string;
    };
  };
  materials: {
    steel: string;
    stainless_steel: string;
    aluminum: string;
    copper: string;
    brass: string;
    titanium: string;
    acrylic: string;
    wood: string;
    plastic: string;
  };
  laser_types: {
    fiber: string;
    co2: string;
    nd_yag: string;
    disk: string;
    diode: string;
  };
  gas_types: {
    oxygen: string;
    nitrogen: string;
    air: string;
    argon: string;
    helium: string;
  };
  quality_levels: {
    draft: string;
    standard: string;
    precision: string;
    ultra_precision: string;
  };
  export: {
    formats: {
      pdf: string;
      excel: string;
      csv: string;
      json: string;
    };
    filename: string;
    success: string;
    error: string;
  };
  errors: {
    network: string;
    server: string;
    validation: string;
    calculation: string;
    export: string;
    import: string;
    permission: string;
    not_found: string;
    timeout: string;
    unknown: string;
  };
  success: {
    calculation: string;
    export: string;
    import: string;
    save: string;
    copy: string;
    share: string;
  };
  help: {
    tooltip: string;
    documentation: string;
    examples: string;
    contact_support: string;
    keyboard_shortcuts: string;
    getting_started: string;
  };
  accessibility: {
    skip_to_content: string;
    close_dialog: string;
    open_menu: string;
    close_menu: string;
    expand: string;
    collapse: string;
    sort_ascending: string;
    sort_descending: string;
    loading_content: string;
    error_message: string;
    success_message: string;
    warning_message: string;
  };
  calculator: {
    categories: {
      core_engineering: string;
      quality_control: string;
      process_optimization: string;
      advanced_analysis: string;
    };
    badges: {
      standard: string;
      ai_enhanced: string;
      premium: string;
      new: string;
    };
    form: {
      inputs: string;
      results: string;
      chart: string;
      export: string;
      help: string;
    };
    results: {
      summary: string;
      details: string;
      recommendations: string;
      warnings: string;
      notes: string;
    };
  };
  footer: {
    copyright: string;
    privacy: string;
    terms: string;
    support: string;
    version: string;
  };
}

// Calculator-specific translation structure
export interface CalculatorInputTranslation {
  label: string;
  placeholder?: string;
  help: string;
}

export interface CalculatorTranslation {
  title: string;
  description: string;
  inputs: Record<string, CalculatorInputTranslation>;
  results: Record<string, string>;
}

export interface CalculatorsTranslations {
  laser_parameter_optimizer: CalculatorTranslation;
  cutting_time_estimator: CalculatorTranslation;
  material_selection_assistant: CalculatorTranslation;
  heat_affected_zone_calculator: CalculatorTranslation;
  beam_quality_calculator: CalculatorTranslation;
  cutting_quality_predictor: Omit<CalculatorTranslation, 'inputs'> & {
    results: Record<string, string>;
  };
  edge_quality_predictor: Omit<CalculatorTranslation, 'inputs'> & {
    results: Record<string, string>;
  };
  warping_risk_calculator: Omit<CalculatorTranslation, 'inputs'> & {
    results: Record<string, string>;
  };
  burn_mark_preventer: Omit<CalculatorTranslation, 'inputs'> & {
    results: Record<string, string>;
  };
  dross_formation_calculator: Omit<CalculatorTranslation, 'inputs'> & {
    results: Record<string, string>;
  };
  common: {
    form_sections: {
      material_properties: string;
      laser_settings: string;
      cutting_parameters: string;
      quality_requirements: string;
      optimization_goals: string;
    };
    result_sections: {
      primary_results: string;
      secondary_analysis: string;
      recommendations: string;
      warnings: string;
      technical_notes: string;
    };
    help_topics: {
      parameter_selection: string;
      material_properties: string;
      quality_standards: string;
      troubleshooting: string;
      best_practices: string;
    };
    validation_messages: {
      thickness_range: string;
      power_range: string;
      speed_range: string;
      pressure_range: string;
      invalid_combination: string;
      exceeds_capability: string;
    };
  };
}

// Complete translation resources type
export interface TranslationResources {
  common: CommonTranslations;
  calculators: CalculatorsTranslations;
}

// Translation key paths for type-safe access
export type CommonTranslationKey = 
  | 'navigation.home'
  | 'navigation.calculators'
  | 'navigation.about'
  | 'navigation.help'
  | 'navigation.contact'
  | 'navigation.language'
  | 'actions.calculate'
  | 'actions.reset'
  | 'actions.export'
  | 'status.loading'
  | 'status.calculating'
  | 'status.success'
  | 'status.error'
  | 'validation.required'
  | 'validation.invalid'
  | 'materials.steel'
  | 'materials.stainless_steel'
  | 'materials.aluminum'
  | 'laser_types.fiber'
  | 'laser_types.co2'
  | 'gas_types.oxygen'
  | 'gas_types.nitrogen'
  | 'quality_levels.standard'
  | 'quality_levels.precision'
  | 'calculator.categories.core_engineering'
  | 'calculator.categories.quality_control'
  | 'calculator.badges.standard'
  | 'calculator.badges.ai_enhanced';

export type CalculatorTranslationKey = 
  | 'laser_parameter_optimizer.title'
  | 'laser_parameter_optimizer.description'
  | 'laser_parameter_optimizer.inputs.material_type.label'
  | 'laser_parameter_optimizer.inputs.thickness.label'
  | 'laser_parameter_optimizer.results.optimal_power'
  | 'cutting_time_estimator.title'
  | 'cutting_time_estimator.inputs.cutting_length.label'
  | 'cutting_time_estimator.results.total_time'
  | 'common.validation_messages.thickness_range'
  | 'common.validation_messages.power_range';

// Language detection and preference types
export interface LanguagePreference {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  market?: string;
  default?: boolean;
}

// Translation interpolation options
export interface TranslationOptions {
  min?: number;
  max?: number;
  value?: number;
  version?: string;
  count?: number;
  [key: string]: any;
}

// Custom hook return types
export interface UseTranslationReturn {
  t: (key: string, options?: TranslationOptions) => string;
  i18n: {
    language: SupportedLanguage;
    changeLanguage: (language: SupportedLanguage) => Promise<void>;
    exists: (key: string, options?: { ns?: string }) => boolean;
  };
}

// Language switcher component props
export interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'flags';
  showFlags?: boolean;
  showNativeNames?: boolean;
  className?: string;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

// Translation validation types
export interface TranslationValidationResult {
  isValid: boolean;
  missingKeys: string[];
  extraKeys: string[];
  errors: string[];
}

// Export utility types for components
export type TranslationFunction = (key: string, options?: TranslationOptions) => string;
export type LanguageChangeFunction = (language: SupportedLanguage) => Promise<void>;

// Declare module augmentation for react-i18next
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: TranslationResources;
  }
}

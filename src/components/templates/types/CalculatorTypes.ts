// Calculator Template Types
export interface CalculatorConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  tags: string[];
  version: string;
}

export interface CalculatorMetadata {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  lastUpdated: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface CalculatorPageProps {
  config: CalculatorConfig;
  metadata: CalculatorMetadata;
  breadcrumbs: BreadcrumbItem[];
  children?: React.ReactNode;
}

// Input Parameter Types
export interface InputParameter {
  id: string;
  name: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'boolean' | 'range';
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  tooltip?: string;
  validation?: ValidationRule[];
  unit?: UnitConfig;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'range' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface UnitConfig {
  primary: string;
  alternatives: string[];
  converter: (value: number, from: string, to: string) => number;
}

// Input Group Types
export interface InputGroup {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  parameters: InputParameter[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface InputTabConfig {
  id: string;
  label: string;
  icon?: string;
  groups: InputGroup[];
}

// Calculation Types
export interface CalculationInput {
  [key: string]: any;
}

export interface CalculationResult {
  success: boolean;
  data?: any;
  error?: string;
  warnings?: string[];
  metadata?: {
    calculationTime: number;
    version: string;
    timestamp: string;
  };
}

export interface CalculationService {
  calculate: (input: CalculationInput) => Promise<CalculationResult>;
  validate: (input: CalculationInput) => ValidationResult;
  getDefaultValues: () => CalculationInput;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// Event Handler Types
export interface CalculatorEventHandlers {
  onCalculate?: (input: CalculationInput) => void;
  onInputChange?: (field: string, value: any) => void;
  onValidationError?: (errors: ValidationError[]) => void;
  onExport?: (format: string, data: any) => void;
  onShare?: (url: string) => void;
  onReset?: () => void;
}

// Template Configuration
export interface TemplateConfig {
  showFormulaExplanation?: boolean;
  showRelatedTools?: boolean;
  showExportTools?: boolean;
  showBreadcrumbs?: boolean;
  enableRealTimeCalculation?: boolean;
  enableInputValidation?: boolean;
  customSections?: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  position: 'before-input' | 'after-input' | 'before-results' | 'after-results';
  props?: any;
}

// Theme and Styling
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderRadius: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface StyleConfig {
  theme?: ThemeConfig;
  customClasses?: {
    container?: string;
    header?: string;
    input?: string;
    results?: string;
    footer?: string;
  };
}

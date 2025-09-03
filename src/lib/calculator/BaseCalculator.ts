// Base Calculator Interface and Types
// Unified architecture for all 20 core calculators

import { z } from 'zod';
import Decimal from 'decimal.js';

// Configure Decimal.js for high precision calculations
Decimal.config({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21
});

// Base input field configuration
export interface BaseInputField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'boolean';
  required: boolean;
  placeholder?: string;
  help?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  validation?: z.ZodSchema;
}

// Base calculator configuration
export interface BaseCalculatorConfig {
  id: string;
  title: string;
  description: string;
  category: 'Core Engineering' | 'Quality Control' | 'Process Optimization' | 'Advanced Analysis';
  badge: 'Standard' | 'AI Enhanced' | 'Premium' | 'New';
  iconName: string;
  inputs: BaseInputField[];
  resultType: 'price' | 'time' | 'parameters' | 'selection' | 'analysis';
  version: string;
  lastUpdated: string;
}

// Base calculation result structure
export interface BaseCalculationResult {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
  warnings?: string[];
  recommendations?: string[];
  metadata: {
    calculationTime: number; // milliseconds
    timestamp: string;
    version: string;
    inputHash: string;
  };
}

// Base validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

// Base calculator state
export interface BaseCalculatorState {
  inputs: Record<string, any>;
  results: BaseCalculationResult | null;
  isCalculating: boolean;
  validationErrors: ValidationResult;
  history: Array<{
    inputs: Record<string, any>;
    results: BaseCalculationResult;
    timestamp: string;
  }>;
}

// Base calculator interface that all calculators must implement
export interface IBaseCalculator {
  // Configuration
  readonly config: BaseCalculatorConfig;
  
  // Core methods
  validateInputs(inputs: Record<string, any>): ValidationResult;
  calculate(inputs: Record<string, any>): Promise<BaseCalculationResult>;
  formatResult(result: any, format: 'display' | 'export' | 'api'): any;
  
  // Utility methods
  getInputSchema(): z.ZodSchema;
  getDefaultInputs(): Record<string, any>;
  getExampleInputs(): Record<string, any>;
  
  // Export methods
  exportToPDF(results: BaseCalculationResult): Promise<Blob>;
  exportToExcel(results: BaseCalculationResult): Promise<Blob>;
  exportToCSV(results: BaseCalculationResult): Promise<string>;
}

// Abstract base calculator class
export abstract class BaseCalculator implements IBaseCalculator {
  abstract readonly config: BaseCalculatorConfig;
  private _configValidated = false;

  constructor() {
    // Config validation will happen on first use
  }

  private ensureConfigValid(): void {
    if (this._configValidated) return;

    if (!this.config?.id || !this.config?.title) {
      throw new Error(`Calculator must have id and title. Got: ${JSON.stringify(this.config)}`);
    }

    if (!this.config.inputs || this.config.inputs.length === 0) {
      throw new Error('Calculator must have at least one input field');
    }

    this._configValidated = true;
  }
  
  // Input validation using Zod schemas
  validateInputs(inputs: Record<string, any>): ValidationResult {
    this.ensureConfigValid();

    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    try {
      const schema = this.getInputSchema();
      schema.parse(inputs);
    } catch (error) {
      if (error instanceof z.ZodError) {
        result.isValid = false;
        result.errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
      }
    }
    
    // Additional custom validation
    const customValidation = this.customValidation(inputs);
    result.errors.push(...customValidation.errors);
    result.warnings.push(...customValidation.warnings);
    
    if (result.errors.length > 0) {
      result.isValid = false;
    }
    
    return result;
  }
  
  // Abstract methods that must be implemented by each calculator
  abstract calculate(inputs: Record<string, any>): Promise<BaseCalculationResult>;
  abstract getInputSchema(): z.ZodSchema;
  
  // Default implementations that can be overridden
  customValidation(inputs: Record<string, any>): Pick<ValidationResult, 'errors' | 'warnings'> {
    return { errors: [], warnings: [] };
  }
  
  getDefaultInputs(): Record<string, any> {
    this.ensureConfigValid();

    const defaults: Record<string, any> = {};

    this.config.inputs.forEach(input => {
      switch (input.type) {
        case 'number':
          defaults[input.id] = input.min || 0;
          break;
        case 'select':
          defaults[input.id] = input.options?.[0]?.value || '';
          break;
        case 'boolean':
          defaults[input.id] = false;
          break;
        default:
          defaults[input.id] = '';
      }
    });
    
    return defaults;
  }
  
  getExampleInputs(): Record<string, any> {
    this.ensureConfigValid();
    // Override in specific calculators to provide meaningful examples
    return this.getDefaultInputs();
  }
  
  formatResult(result: any, format: 'display' | 'export' | 'api'): any {
    switch (format) {
      case 'display':
        return this.formatForDisplay(result);
      case 'export':
        return this.formatForExport(result);
      case 'api':
        return this.formatForAPI(result);
      default:
        return result;
    }
  }
  
  protected formatForDisplay(result: any): any {
    // Format numbers for display with appropriate precision
    const formatted = { ...result };
    
    Object.keys(formatted).forEach(key => {
      const value = formatted[key];
      if (typeof value === 'number') {
        formatted[key] = new Decimal(value).toFixed(2);
      }
    });
    
    return formatted;
  }
  
  protected formatForExport(result: any): any {
    // Format for Excel/CSV export
    return {
      ...result,
      exportTimestamp: new Date().toISOString(),
      calculatorId: this.config.id,
      calculatorVersion: this.config.version
    };
  }
  
  protected formatForAPI(result: any): any {
    // Format for API response
    return {
      calculator: this.config.id,
      version: this.config.version,
      result,
      timestamp: new Date().toISOString()
    };
  }
  
  // Export methods (basic implementations)
  async exportToPDF(results: BaseCalculationResult): Promise<Blob> {
    // Basic PDF export - override for custom formatting
    const content = JSON.stringify(results, null, 2);
    return new Blob([content], { type: 'application/pdf' });
  }
  
  async exportToExcel(results: BaseCalculationResult): Promise<Blob> {
    // Basic Excel export - override for custom formatting
    const content = JSON.stringify(results, null, 2);
    return new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  async exportToCSV(results: BaseCalculationResult): Promise<string> {
    // Basic CSV export - override for custom formatting
    if (!results.data) return '';
    
    const headers = Object.keys(results.data);
    const values = Object.values(results.data);
    
    return `${headers.join(',')}\n${values.join(',')}`;
  }
  
  // Utility methods for calculations
  protected createDecimal(value: number | string): Decimal {
    return new Decimal(value);
  }
  
  protected calculateWithPrecision(operation: () => Decimal): number {
    try {
      const result = operation();
      return result.toNumber();
    } catch (error) {
      throw new Error(`Calculation error: ${error}`);
    }
  }
  
  protected generateInputHash(inputs: Record<string, any>): string {
    // Generate hash for caching and comparison
    const sortedInputs = Object.keys(inputs)
      .sort()
      .reduce((acc, key) => {
        acc[key] = inputs[key];
        return acc;
      }, {} as Record<string, any>);
    
    return btoa(JSON.stringify(sortedInputs));
  }
  
  protected createSuccessResult(data: Record<string, any>, inputs: Record<string, any>): BaseCalculationResult {
    return {
      success: true,
      data,
      metadata: {
        calculationTime: 0, // Will be set by wrapper
        timestamp: new Date().toISOString(),
        version: this.config.version,
        inputHash: this.generateInputHash(inputs)
      }
    };
  }
  
  protected createErrorResult(error: string, inputs: Record<string, any>): BaseCalculationResult {
    return {
      success: false,
      error,
      metadata: {
        calculationTime: 0,
        timestamp: new Date().toISOString(),
        version: this.config.version,
        inputHash: this.generateInputHash(inputs)
      }
    };
  }
}

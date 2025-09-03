/**
 * Base Calculator Module
 * 
 * Abstract base class that provides common functionality for all calculator modules.
 * Implements the CalculatorModule interface with sensible defaults.
 */

import { 
  CalculatorModule, 
  ModuleMetadata, 
  ModuleStatus,
  ModuleError 
} from '../types/calculator-module';
import { CalculatorInputs, CalculatorResults } from '../types/calculator';

export abstract class BaseCalculatorModule implements CalculatorModule {
  protected _status: ModuleStatus;
  protected _initialized: boolean = false;
  protected _startTime: number = 0;

  constructor(public readonly metadata: ModuleMetadata) {
    this._status = {
      loaded: false,
      initialized: false,
      healthy: true,
      lastError: undefined,
      loadTime: 0,
      memoryUsage: 0
    };
  }

  /**
   * Initialize the calculator module
   * Override this method to add custom initialization logic
   */
  async initialize(): Promise<void> {
    try {
      this._startTime = performance.now();
      
      console.log(`🔧 Initializing calculator module: ${this.metadata.name}`);
      
      // Call custom initialization
      await this.onInitialize();
      
      this._status.loaded = true;
      this._status.initialized = true;
      this._status.healthy = true;
      this._status.loadTime = performance.now() - this._startTime;
      this._initialized = true;
      
      console.log(`✅ Calculator module initialized: ${this.metadata.name} (${this._status.loadTime.toFixed(2)}ms)`);
    } catch (error) {
      this._status.healthy = false;
      this._status.lastError = error instanceof Error ? error : new Error(String(error));
      
      console.error(`❌ Failed to initialize calculator module: ${this.metadata.name}`, error);
      throw new ModuleError(
        `Failed to initialize module ${this.metadata.name}`,
        this.metadata.id,
        'INIT_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Destroy the calculator module and clean up resources
   */
  async destroy(): Promise<void> {
    try {
      console.log(`🔧 Destroying calculator module: ${this.metadata.name}`);
      
      // Call custom cleanup
      await this.onDestroy();
      
      this._status.loaded = false;
      this._status.initialized = false;
      this._initialized = false;
      
      console.log(`✅ Calculator module destroyed: ${this.metadata.name}`);
    } catch (error) {
      this._status.lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`❌ Error destroying calculator module: ${this.metadata.name}`, error);
      throw error;
    }
  }

  /**
   * Main calculation method - must be implemented by subclasses
   */
  abstract calculate(inputs: CalculatorInputs): Promise<CalculatorResults> | CalculatorResults;

  /**
   * Validate inputs before calculation
   * Override this method to add custom validation logic
   */
  validateInputs(inputs: CalculatorInputs): boolean {
    try {
      // Basic validation
      if (!inputs || typeof inputs !== 'object') {
        return false;
      }

      // Call custom validation
      return this.onValidateInputs(inputs);
    } catch (error) {
      console.error(`❌ Input validation error in ${this.metadata.name}:`, error);
      return false;
    }
  }

  /**
   * Get current module status
   */
  getStatus(): ModuleStatus {
    // Update memory usage if available
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      this._status.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    return { ...this._status };
  }

  /**
   * Get JSON schema for inputs (optional)
   */
  getSchema?(): object {
    return this.onGetSchema?.() || {};
  }

  /**
   * Get example inputs (optional)
   */
  getExamples?(): CalculatorInputs[] {
    return this.onGetExamples?.() || [];
  }

  /**
   * Get documentation (optional)
   */
  getDocumentation?(): string {
    return this.onGetDocumentation?.() || `Documentation for ${this.metadata.name}`;
  }

  /**
   * Handle errors
   */
  onError?(error: Error): void {
    this._status.lastError = error;
    this._status.healthy = false;
    console.error(`❌ Error in calculator module ${this.metadata.name}:`, error);
  }

  /**
   * Handle warnings
   */
  onWarning?(warning: string): void {
    console.warn(`⚠️ Warning in calculator module ${this.metadata.name}: ${warning}`);
  }

  // Protected methods for subclasses to override

  /**
   * Custom initialization logic - override in subclasses
   */
  protected async onInitialize(): Promise<void> {
    // Default: no custom initialization
  }

  /**
   * Custom cleanup logic - override in subclasses
   */
  protected async onDestroy(): Promise<void> {
    // Default: no custom cleanup
  }

  /**
   * Custom input validation - override in subclasses
   */
  protected onValidateInputs(inputs: CalculatorInputs): boolean {
    // Default: basic validation passed
    return true;
  }

  /**
   * Custom schema definition - override in subclasses
   */
  protected onGetSchema?(): object;

  /**
   * Custom examples - override in subclasses
   */
  protected onGetExamples?(): CalculatorInputs[];

  /**
   * Custom documentation - override in subclasses
   */
  protected onGetDocumentation?(): string;

  // Utility methods for subclasses

  /**
   * Check if module is ready for calculations
   */
  protected isReady(): boolean {
    return this._initialized && this._status.healthy;
  }

  /**
   * Ensure module is ready before calculation
   */
  protected ensureReady(): void {
    if (!this.isReady()) {
      throw new ModuleError(
        `Module ${this.metadata.name} is not ready for calculations`,
        this.metadata.id,
        'NOT_READY'
      );
    }
  }

  /**
   * Create a standardized error response
   */
  protected createErrorResult(error: Error): CalculatorResults {
    return {
      summary: {
        totalCost: 0,
        totalTime: 0,
        efficiency: 0,
        recommendations: [`Error: ${error.message}`]
      }
    };
  }

  /**
   * Log calculation performance
   */
  protected logPerformance(operation: string, startTime: number): void {
    const duration = performance.now() - startTime;
    console.log(`⏱️ ${this.metadata.name} - ${operation}: ${duration.toFixed(2)}ms`);
  }

  /**
   * Validate required fields in inputs
   */
  protected validateRequiredFields(inputs: CalculatorInputs, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
      if (!(field in inputs) || inputs[field] === undefined || inputs[field] === null) {
        console.error(`❌ Missing required field: ${field}`);
        return false;
      }
    }
    return true;
  }

  /**
   * Validate numeric fields
   */
  protected validateNumericFields(inputs: CalculatorInputs, numericFields: string[]): boolean {
    for (const field of numericFields) {
      if (field in inputs) {
        const value = inputs[field];
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
          console.error(`❌ Invalid numeric value for field: ${field}`);
          return false;
        }
      }
    }
    return true;
  }
}

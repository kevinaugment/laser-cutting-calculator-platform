/**
 * Calculator Module System - Type Definitions
 * 
 * Standardized interfaces for the modular calculator system
 */

import { CalculatorInputs, CalculatorResults } from './calculator';

/**
 * Module metadata for registration and discovery
 */
export interface ModuleMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'cost' | 'time' | 'parameters' | 'quality' | 'business' | 'advanced';
  tags: string[];
  author?: string;
  dependencies?: string[];
  aiEnhanced?: boolean;
  priority?: number; // Loading priority (1-10, higher = earlier)
}

/**
 * Module configuration and settings
 */
export interface ModuleConfig {
  enabled: boolean;
  autoLoad: boolean;
  lazyLoad: boolean;
  errorHandling: 'strict' | 'graceful' | 'silent';
  retryAttempts?: number;
  timeout?: number;
}

/**
 * Module health and status information
 */
export interface ModuleStatus {
  loaded: boolean;
  initialized: boolean;
  healthy: boolean;
  lastError?: Error;
  loadTime?: number;
  memoryUsage?: number;
}

/**
 * Calculator module interface - all calculators must implement this
 */
export interface CalculatorModule {
  // Module identification
  readonly metadata: ModuleMetadata;
  
  // Module lifecycle
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  
  // Core calculation functionality
  calculate(inputs: CalculatorInputs): Promise<CalculatorResults> | CalculatorResults;
  
  // Validation and health checks
  validateInputs(inputs: CalculatorInputs): boolean;
  getStatus(): ModuleStatus;
  
  // Optional advanced features
  getSchema?(): object; // JSON schema for inputs
  getExamples?(): CalculatorInputs[];
  getDocumentation?(): string;
  
  // Event handlers
  onError?(error: Error): void;
  onWarning?(warning: string): void;
}

/**
 * Module loader interface for dynamic loading
 */
export interface ModuleLoader {
  loadModule(moduleId: string): Promise<CalculatorModule>;
  unloadModule(moduleId: string): Promise<void>;
  reloadModule(moduleId: string): Promise<CalculatorModule>;
  getLoadedModules(): string[];
  getModuleStatus(moduleId: string): ModuleStatus | null;
}

/**
 * Module registry for managing all calculator modules
 */
export interface ModuleRegistry {
  // Registration
  register(module: CalculatorModule, config?: ModuleConfig): Promise<void>;
  unregister(moduleId: string): Promise<void>;
  
  // Discovery
  getModule(moduleId: string): CalculatorModule | null;
  getAllModules(): CalculatorModule[];
  getModulesByCategory(category: string): CalculatorModule[];
  getModulesByTag(tag: string): CalculatorModule[];
  
  // Status and health
  getRegistryStatus(): {
    totalModules: number;
    loadedModules: number;
    healthyModules: number;
    errors: string[];
  };
  
  // Configuration
  updateConfig(moduleId: string, config: Partial<ModuleConfig>): Promise<void>;
  getConfig(moduleId: string): ModuleConfig | null;
}

/**
 * Module dependency resolver
 */
export interface DependencyResolver {
  resolveDependencies(moduleId: string): Promise<string[]>;
  checkCircularDependencies(moduleId: string): boolean;
  getLoadOrder(moduleIds: string[]): string[];
}

/**
 * Module event system
 */
export interface ModuleEventEmitter {
  on(event: ModuleEvent, handler: (data: any) => void): void;
  off(event: ModuleEvent, handler: (data: any) => void): void;
  emit(event: ModuleEvent, data: any): void;
}

export type ModuleEvent = 
  | 'module:loading'
  | 'module:loaded'
  | 'module:error'
  | 'module:unloaded'
  | 'registry:updated'
  | 'dependency:resolved'
  | 'dependency:failed';

/**
 * Module factory for creating calculator instances
 */
export interface ModuleFactory {
  createModule(metadata: ModuleMetadata): CalculatorModule;
  createFromConfig(config: object): CalculatorModule;
  validateModule(module: CalculatorModule): boolean;
}

/**
 * Performance monitoring for modules
 */
export interface ModulePerformanceMonitor {
  startTiming(moduleId: string, operation: string): void;
  endTiming(moduleId: string, operation: string): number;
  getMetrics(moduleId: string): {
    averageCalculationTime: number;
    totalCalculations: number;
    errorRate: number;
    memoryUsage: number;
  };
}

/**
 * Module cache for performance optimization
 */
export interface ModuleCache {
  get(key: string): any;
  set(key: string, value: any, ttl?: number): void;
  invalidate(key: string): void;
  clear(): void;
  getStats(): {
    hits: number;
    misses: number;
    size: number;
  };
}

/**
 * Error types for module system
 */
export class ModuleError extends Error {
  constructor(
    message: string,
    public moduleId: string,
    public code: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'ModuleError';
  }
}

export class DependencyError extends ModuleError {
  constructor(message: string, moduleId: string, public dependencies: string[]) {
    super(message, moduleId, 'DEPENDENCY_ERROR');
    this.name = 'DependencyError';
  }
}

export class LoadError extends ModuleError {
  constructor(message: string, moduleId: string, cause?: Error) {
    super(message, moduleId, 'LOAD_ERROR', cause);
    this.name = 'LoadError';
  }
}

/**
 * Module system configuration
 */
export interface ModuleSystemConfig {
  autoLoadModules: boolean;
  enableLazyLoading: boolean;
  enableCaching: boolean;
  enablePerformanceMonitoring: boolean;
  maxConcurrentLoads: number;
  defaultTimeout: number;
  errorHandling: 'strict' | 'graceful';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

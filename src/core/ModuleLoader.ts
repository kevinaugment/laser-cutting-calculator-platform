/**
 * Dynamic Module Loader
 * 
 * Handles dynamic loading, unloading, and reloading of calculator modules
 * with error handling, caching, and performance monitoring.
 */

import { 
  ModuleLoader, 
  CalculatorModule, 
  ModuleStatus,
  LoadError,
  ModuleEvent
} from '../types/calculator-module';

export interface LoaderConfig {
  enableCaching: boolean;
  enableRetry: boolean;
  maxRetryAttempts: number;
  retryDelay: number;
  timeout: number;
  enablePerformanceMonitoring: boolean;
}

export class DynamicModuleLoader implements ModuleLoader {
  private loadedModules = new Map<string, CalculatorModule>();
  private moduleCache = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<CalculatorModule>>();
  private config: LoaderConfig;
  private eventHandlers = new Map<ModuleEvent, ((data: any) => void)[]>();

  constructor(config: Partial<LoaderConfig> = {}) {
    this.config = {
      enableCaching: true,
      enableRetry: true,
      maxRetryAttempts: 3,
      retryDelay: 1000,
      timeout: 10000,
      enablePerformanceMonitoring: true,
      ...config
    };

    console.log('🔧 Dynamic Module Loader initialized', this.config);
  }

  /**
   * Load a calculator module dynamically
   */
  async loadModule(moduleId: string): Promise<CalculatorModule> {
    // Check if already loaded
    if (this.loadedModules.has(moduleId)) {
      console.log(`📦 Module ${moduleId} already loaded`);
      return this.loadedModules.get(moduleId)!;
    }

    // Check if currently loading
    if (this.loadingPromises.has(moduleId)) {
      console.log(`⏳ Module ${moduleId} is currently loading, waiting...`);
      return this.loadingPromises.get(moduleId)!;
    }

    // Start loading
    const loadingPromise = this.performLoad(moduleId);
    this.loadingPromises.set(moduleId, loadingPromise);

    try {
      const module = await loadingPromise;
      this.loadedModules.set(moduleId, module);
      this.emit('module:loaded', { moduleId, module });
      return module;
    } catch (error) {
      this.emit('module:error', { moduleId, error });
      throw error;
    } finally {
      this.loadingPromises.delete(moduleId);
    }
  }

  /**
   * Unload a calculator module
   */
  async unloadModule(moduleId: string): Promise<void> {
    const module = this.loadedModules.get(moduleId);
    if (!module) {
      console.warn(`⚠️ Module ${moduleId} is not loaded`);
      return;
    }

    try {
      console.log(`🔧 Unloading module: ${moduleId}`);
      
      // Call module's destroy method
      await module.destroy();
      
      // Remove from loaded modules
      this.loadedModules.delete(moduleId);
      
      // Clear cache if enabled
      if (this.config.enableCaching) {
        this.moduleCache.delete(moduleId);
      }
      
      this.emit('module:unloaded', { moduleId });
      console.log(`✅ Module unloaded: ${moduleId}`);
    } catch (error) {
      console.error(`❌ Error unloading module ${moduleId}:`, error);
      throw new LoadError(`Failed to unload module ${moduleId}`, moduleId, error as Error);
    }
  }

  /**
   * Reload a calculator module
   */
  async reloadModule(moduleId: string): Promise<CalculatorModule> {
    console.log(`🔄 Reloading module: ${moduleId}`);
    
    // Unload if currently loaded
    if (this.loadedModules.has(moduleId)) {
      await this.unloadModule(moduleId);
    }
    
    // Clear cache
    this.moduleCache.delete(moduleId);
    
    // Load again
    return this.loadModule(moduleId);
  }

  /**
   * Get list of loaded module IDs
   */
  getLoadedModules(): string[] {
    return Array.from(this.loadedModules.keys());
  }

  /**
   * Get status of a specific module
   */
  getModuleStatus(moduleId: string): ModuleStatus | null {
    const module = this.loadedModules.get(moduleId);
    return module ? module.getStatus() : null;
  }

  /**
   * Perform the actual module loading with retry logic
   */
  private async performLoad(moduleId: string): Promise<CalculatorModule> {
    this.emit('module:loading', { moduleId });
    
    let lastError: Error | null = null;
    const maxAttempts = this.config.enableRetry ? this.config.maxRetryAttempts : 1;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔧 Loading module ${moduleId} (attempt ${attempt}/${maxAttempts})`);
        
        const startTime = performance.now();
        const module = await this.loadModuleImplementation(moduleId);
        const loadTime = performance.now() - startTime;

        if (this.config.enablePerformanceMonitoring) {
          console.log(`⏱️ Module ${moduleId} loaded in ${loadTime.toFixed(2)}ms`);
        }

        // Initialize the module
        await module.initialize();

        console.log(`✅ Module loaded successfully: ${moduleId}`);
        return module;

      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Attempt ${attempt} failed for module ${moduleId}:`, error);

        if (attempt < maxAttempts) {
          console.log(`⏳ Retrying in ${this.config.retryDelay}ms...`);
          await this.delay(this.config.retryDelay);
        }
      }
    }

    throw new LoadError(
      `Failed to load module ${moduleId} after ${maxAttempts} attempts`,
      moduleId,
      lastError || undefined
    );
  }

  /**
   * Load module implementation - this is where the actual dynamic import happens
   */
  private async loadModuleImplementation(moduleId: string): Promise<CalculatorModule> {
    // Check cache first
    if (this.config.enableCaching && this.moduleCache.has(moduleId)) {
      console.log(`📦 Loading module ${moduleId} from cache`);
      const ModuleClass = this.moduleCache.get(moduleId);
      return new ModuleClass();
    }

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new LoadError(`Module loading timeout: ${moduleId}`, moduleId));
      }, this.config.timeout);
    });

    // Dynamic import with timeout
    const importPromise = this.dynamicImport(moduleId);
    
    try {
      const moduleExports = await Promise.race([importPromise, timeoutPromise]);
      
      // Extract the calculator class
      const ModuleClass = this.extractModuleClass(moduleExports, moduleId);
      
      // Cache if enabled
      if (this.config.enableCaching) {
        this.moduleCache.set(moduleId, ModuleClass);
      }
      
      // Create instance
      return new ModuleClass();
      
    } catch (error) {
      throw new LoadError(`Failed to import module ${moduleId}`, moduleId, error as Error);
    }
  }

  /**
   * Perform dynamic import based on module ID
   */
  private async dynamicImport(moduleId: string): Promise<any> {
    // Map module ID to file path
    const modulePath = this.getModulePath(moduleId);
    
    console.log(`📦 Importing module from: ${modulePath}`);
    
    // Dynamic import
    return import(modulePath);
  }

  /**
   * Map module ID to file path
   */
  private getModulePath(moduleId: string): string {
    // Convert module ID to file path
    // New modules are in ../modules/calculators/

    const pathMap: Record<string, string> = {
      // New modular calculators
      'gas-consumption-calculator': '../modules/calculators/GasConsumptionCalculator',
      'cutting-time-estimator': '../modules/calculators/CuttingTimeEstimator',
      'laser-parameter-optimizer': '../modules/calculators/LaserParameterOptimizer',

      // Legacy calculators (if needed)
      'batch-processing-calculator': '../services/calculators/batchProcessingCalculator',
      'heat-affected-zone-calculator': '../services/calculators/heatAffectedZoneCalculator',
      'material-selection-assistant': '../services/calculators/materialSelectionAssistant',
      // Add more mappings as needed
    };

    const path = pathMap[moduleId];
    if (!path) {
      throw new LoadError(`Unknown module ID: ${moduleId}`, moduleId);
    }

    return path;
  }

  /**
   * Extract calculator class from module exports
   */
  private extractModuleClass(moduleExports: any, moduleId: string): any {
    console.log(`🔍 Extracting module class for ${moduleId}`, Object.keys(moduleExports));

    // Try different export patterns

    // 1. Try class export first (new modules)
    const className = this.getCalculatorClassName(moduleId);
    if (moduleExports[className]) {
      console.log(`✅ Found class export: ${className}`);
      return moduleExports[className];
    }

    // 2. Try default export
    if (moduleExports.default) {
      console.log(`✅ Found default export`);
      return moduleExports.default;
    }

    // 3. Try named export (calculator instance) - legacy
    const calculatorName = this.getCalculatorInstanceName(moduleId);
    if (moduleExports[calculatorName]) {
      console.log(`✅ Found instance export: ${calculatorName}`);
      // If it's an instance, get its constructor
      const instance = moduleExports[calculatorName];
      return instance.constructor;
    }

    // 4. Log available exports for debugging
    console.error(`❌ No valid calculator class found in module ${moduleId}`);
    console.error(`Available exports:`, Object.keys(moduleExports));

    throw new LoadError(`No valid calculator class found in module ${moduleId}`, moduleId);
  }

  /**
   * Get expected calculator instance name from module ID
   */
  private getCalculatorInstanceName(moduleId: string): string {
    // Convert 'gas-consumption-calculator' to 'gasConsumptionCalculator'
    return moduleId.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Get expected calculator class name from module ID
   */
  private getCalculatorClassName(moduleId: string): string {
    // Convert 'gas-consumption-calculator' to 'GasConsumptionCalculator'
    return moduleId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Utility method for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Event system
   */
  private emit(event: ModuleEvent, data: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`❌ Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Add event listener
   */
  on(event: ModuleEvent, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * Remove event listener
   */
  off(event: ModuleEvent, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Get loader statistics
   */
  getStats() {
    return {
      loadedModules: this.loadedModules.size,
      cachedModules: this.moduleCache.size,
      currentlyLoading: this.loadingPromises.size,
      config: this.config
    };
  }

  /**
   * Clear all loaded modules and cache
   */
  async clearAll(): Promise<void> {
    console.log('🔧 Clearing all loaded modules...');

    // Unload all modules
    const moduleIds = Array.from(this.loadedModules.keys());
    for (const moduleId of moduleIds) {
      try {
        await this.unloadModule(moduleId);
      } catch (error) {
        console.error(`❌ Error unloading module ${moduleId}:`, error);
      }
    }

    // Clear cache
    this.moduleCache.clear();

    console.log('✅ All modules cleared');
  }
}

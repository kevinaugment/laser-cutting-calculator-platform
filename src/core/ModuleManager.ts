/**
 * Module Manager
 * 
 * Central orchestrator for the entire module system, coordinating
 * loading, registration, dependency resolution, and lifecycle management.
 */

import { 
  CalculatorModule, 
  ModuleConfig,
  ModuleSystemConfig,
  ModuleEvent,
  ModuleError
} from '../types/calculator-module';

import { DynamicModuleLoader } from './ModuleLoader';
import { CalculatorModuleRegistry } from './ModuleRegistry';
import { ModuleDependencyResolver } from './DependencyResolver';

export class ModuleManager {
  private loader: DynamicModuleLoader;
  private registry: CalculatorModuleRegistry;
  private dependencyResolver: ModuleDependencyResolver;
  private config: ModuleSystemConfig;
  private eventHandlers = new Map<ModuleEvent, ((data: any) => void)[]>();
  private initialized = false;

  constructor(config: Partial<ModuleSystemConfig> = {}) {
    this.config = {
      autoLoadModules: true,
      enableLazyLoading: true,
      enableCaching: true,
      enablePerformanceMonitoring: true,
      maxConcurrentLoads: 5,
      defaultTimeout: 10000,
      errorHandling: 'graceful',
      logLevel: 'info',
      ...config
    };

    // Initialize components
    this.loader = new DynamicModuleLoader({
      enableCaching: this.config.enableCaching,
      enableRetry: true,
      maxRetryAttempts: 3,
      retryDelay: 1000,
      timeout: this.config.defaultTimeout,
      enablePerformanceMonitoring: this.config.enablePerformanceMonitoring
    });

    this.registry = new CalculatorModuleRegistry();
    this.dependencyResolver = new ModuleDependencyResolver();

    // Set up event forwarding
    this.setupEventForwarding();

    console.log('🔧 Module Manager initialized', this.config);
  }

  /**
   * Initialize the module system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('⚠️ Module Manager already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing Module Manager...');
      
      this.emit('system:initializing', {});
      
      // Auto-load modules if enabled
      if (this.config.autoLoadModules) {
        await this.autoLoadModules();
      }
      
      this.initialized = true;
      this.emit('system:initialized', {});
      
      console.log('✅ Module Manager initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Module Manager:', error);
      this.emit('system:error', { error });
      throw error;
    }
  }

  /**
   * Load a calculator module with dependency resolution
   */
  async loadModule(moduleId: string): Promise<CalculatorModule> {
    try {
      console.log(`🔧 Loading module with dependencies: ${moduleId}`);
      
      // Resolve dependencies first
      const dependencies = await this.dependencyResolver.resolveDependencies(moduleId);
      
      // Load dependencies in order
      for (const depId of dependencies) {
        if (!this.registry.getModule(depId)) {
          console.log(`📦 Loading dependency: ${depId}`);
          await this.loader.loadModule(depId);
        }
      }
      
      // Load the target module
      const module = await this.loader.loadModule(moduleId);
      
      // Register with dependency resolver
      this.dependencyResolver.registerModule(module.metadata);
      
      // Register in registry
      await this.registry.register(module);
      
      console.log(`✅ Module loaded successfully: ${moduleId}`);
      return module;
      
    } catch (error) {
      console.error(`❌ Failed to load module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Unload a calculator module
   */
  async unloadModule(moduleId: string): Promise<void> {
    try {
      console.log(`🔧 Unloading module: ${moduleId}`);
      
      // Check for dependents
      const dependents = this.dependencyResolver.getDependents(moduleId);
      if (dependents.length > 0) {
        console.warn(`⚠️ Module ${moduleId} has dependents:`, dependents);
        
        if (this.config.errorHandling === 'strict') {
          throw new ModuleError(
            `Cannot unload module ${moduleId} - it has dependents: ${dependents.join(', ')}`,
            moduleId,
            'HAS_DEPENDENTS'
          );
        }
      }
      
      // Unregister from registry
      await this.registry.unregister(moduleId);
      
      // Unload from loader
      await this.loader.unloadModule(moduleId);
      
      // Unregister from dependency resolver
      this.dependencyResolver.unregisterModule(moduleId);
      
      console.log(`✅ Module unloaded: ${moduleId}`);
      
    } catch (error) {
      console.error(`❌ Failed to unload module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Get a calculator module
   */
  getModule(moduleId: string): CalculatorModule | null {
    return this.registry.getModule(moduleId);
  }

  /**
   * Get all loaded modules
   */
  getAllModules(): CalculatorModule[] {
    return this.registry.getAllModules();
  }

  /**
   * Get modules by category
   */
  getModulesByCategory(category: string): CalculatorModule[] {
    return this.registry.getModulesByCategory(category);
  }

  /**
   * Search modules
   */
  searchModules(query: string): CalculatorModule[] {
    return this.registry.searchModules(query);
  }

  /**
   * Auto-load predefined modules
   */
  private async autoLoadModules(): Promise<void> {
    console.log('🔧 Auto-loading predefined modules...');
    
    // Define core modules to auto-load
    const coreModules = [
      'gas-consumption-calculator',
      'cutting-time-estimator',
      'laser-parameter-optimizer'
    ];
    
    const loadPromises = coreModules.map(async (moduleId) => {
      try {
        await this.loadModule(moduleId);
      } catch (error) {
        console.error(`❌ Failed to auto-load module ${moduleId}:`, error);
        
        if (this.config.errorHandling === 'strict') {
          throw error;
        }
      }
    });
    
    await Promise.allSettled(loadPromises);
    console.log('✅ Auto-loading completed');
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    const registryStatus = this.registry.getRegistryStatus();
    const loaderStats = this.loader.getStats();
    const dependencyStats = this.dependencyResolver.getStats();
    const dependencyValidation = this.dependencyResolver.validateAllDependencies();
    
    return {
      initialized: this.initialized,
      config: this.config,
      registry: registryStatus,
      loader: loaderStats,
      dependencies: dependencyStats,
      dependencyValidation,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate system health
   */
  async validateSystem(): Promise<{ healthy: boolean; issues: string[] }> {
    console.log('🔍 Validating module system health...');
    
    const issues: string[] = [];
    
    try {
      // Check dependency validation
      const depValidation = this.dependencyResolver.validateAllDependencies();
      if (!depValidation.valid) {
        issues.push(...depValidation.errors);
      }
      
      // Check module health
      const modules = this.registry.getAllModules();
      for (const module of modules) {
        const status = module.getStatus();
        if (!status.healthy && status.lastError) {
          issues.push(`Module ${module.metadata.id}: ${status.lastError.message}`);
        }
      }
      
      // Check registry status
      const registryStatus = this.registry.getRegistryStatus();
      if (registryStatus.errors.length > 0) {
        issues.push(...registryStatus.errors);
      }
      
      const healthy = issues.length === 0;
      
      if (healthy) {
        console.log('✅ Module system is healthy');
      } else {
        console.warn('⚠️ Module system has issues:', issues);
      }
      
      return { healthy, issues };
      
    } catch (error) {
      console.error('❌ Error validating system:', error);
      return { 
        healthy: false, 
        issues: [`System validation error: ${error}`] 
      };
    }
  }

  /**
   * Reload all modules
   */
  async reloadAllModules(): Promise<void> {
    console.log('🔄 Reloading all modules...');
    
    const moduleIds = this.loader.getLoadedModules();
    
    for (const moduleId of moduleIds) {
      try {
        await this.loader.reloadModule(moduleId);
      } catch (error) {
        console.error(`❌ Failed to reload module ${moduleId}:`, error);
        
        if (this.config.errorHandling === 'strict') {
          throw error;
        }
      }
    }
    
    console.log('✅ All modules reloaded');
  }

  /**
   * Shutdown the module system
   */
  async shutdown(): Promise<void> {
    console.log('🔧 Shutting down Module Manager...');
    
    try {
      this.emit('system:shutting_down', {});
      
      // Clear all modules
      await this.registry.clearAll();
      await this.loader.clearAll();
      this.dependencyResolver.clear();
      
      this.initialized = false;
      this.emit('system:shutdown', {});
      
      console.log('✅ Module Manager shutdown complete');
      
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      throw error;
    }
  }

  /**
   * Event system
   */
  on(event: ModuleEvent, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: ModuleEvent, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

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
   * Set up event forwarding from components
   */
  private setupEventForwarding(): void {
    // Forward loader events
    this.loader.on('module:loading', (data) => this.emit('module:loading', data));
    this.loader.on('module:loaded', (data) => this.emit('module:loaded', data));
    this.loader.on('module:error', (data) => this.emit('module:error', data));
    this.loader.on('module:unloaded', (data) => this.emit('module:unloaded', data));
  }
}

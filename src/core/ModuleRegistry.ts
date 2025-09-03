/**
 * Module Registry
 * 
 * Central registry for managing all calculator modules with configuration,
 * discovery, health monitoring, and lifecycle management.
 */

import { 
  ModuleRegistry, 
  CalculatorModule, 
  ModuleConfig,
  ModuleMetadata,
  ModuleError
} from '../types/calculator-module';

interface RegisteredModule {
  module: CalculatorModule;
  config: ModuleConfig;
  registeredAt: Date;
  lastAccessed: Date;
}

export class CalculatorModuleRegistry implements ModuleRegistry {
  private modules = new Map<string, RegisteredModule>();
  private defaultConfig: ModuleConfig = {
    enabled: true,
    autoLoad: true,
    lazyLoad: false,
    errorHandling: 'graceful',
    retryAttempts: 3,
    timeout: 10000
  };

  constructor() {
    console.log('🔧 Calculator Module Registry initialized');
  }

  /**
   * Register a calculator module
   */
  async register(module: CalculatorModule, config?: ModuleConfig): Promise<void> {
    const moduleId = module.metadata.id;
    
    try {
      console.log(`📝 Registering module: ${moduleId}`);
      
      // Validate module
      this.validateModule(module);
      
      // Merge with default config
      const finalConfig: ModuleConfig = {
        ...this.defaultConfig,
        ...config
      };
      
      // Check for conflicts
      if (this.modules.has(moduleId)) {
        console.warn(`⚠️ Module ${moduleId} is already registered, replacing...`);
        await this.unregister(moduleId);
      }
      
      // Register module
      const registeredModule: RegisteredModule = {
        module,
        config: finalConfig,
        registeredAt: new Date(),
        lastAccessed: new Date()
      };
      
      this.modules.set(moduleId, registeredModule);
      
      console.log(`✅ Module registered: ${moduleId}`, {
        name: module.metadata.name,
        version: module.metadata.version,
        category: module.metadata.category,
        config: finalConfig
      });
      
    } catch (error) {
      console.error(`❌ Failed to register module ${moduleId}:`, error);
      throw new ModuleError(
        `Failed to register module ${moduleId}`,
        moduleId,
        'REGISTRATION_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Unregister a calculator module
   */
  async unregister(moduleId: string): Promise<void> {
    const registeredModule = this.modules.get(moduleId);
    if (!registeredModule) {
      console.warn(`⚠️ Module ${moduleId} is not registered`);
      return;
    }

    try {
      console.log(`🔧 Unregistering module: ${moduleId}`);
      
      // Destroy module if it's initialized
      if (registeredModule.module.getStatus().initialized) {
        await registeredModule.module.destroy();
      }
      
      // Remove from registry
      this.modules.delete(moduleId);
      
      console.log(`✅ Module unregistered: ${moduleId}`);
      
    } catch (error) {
      console.error(`❌ Error unregistering module ${moduleId}:`, error);
      throw new ModuleError(
        `Failed to unregister module ${moduleId}`,
        moduleId,
        'UNREGISTRATION_ERROR',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Get a specific module
   */
  getModule(moduleId: string): CalculatorModule | null {
    const registeredModule = this.modules.get(moduleId);
    if (registeredModule) {
      registeredModule.lastAccessed = new Date();
      return registeredModule.module;
    }
    return null;
  }

  /**
   * Get all registered modules
   */
  getAllModules(): CalculatorModule[] {
    return Array.from(this.modules.values()).map(rm => rm.module);
  }

  /**
   * Get modules by category
   */
  getModulesByCategory(category: string): CalculatorModule[] {
    return Array.from(this.modules.values())
      .filter(rm => rm.module.metadata.category === category)
      .map(rm => rm.module);
  }

  /**
   * Get modules by tag
   */
  getModulesByTag(tag: string): CalculatorModule[] {
    return Array.from(this.modules.values())
      .filter(rm => rm.module.metadata.tags.includes(tag))
      .map(rm => rm.module);
  }

  /**
   * Get registry status and health information
   */
  getRegistryStatus() {
    const modules = Array.from(this.modules.values());
    const errors: string[] = [];
    
    let loadedModules = 0;
    let healthyModules = 0;
    
    for (const registeredModule of modules) {
      const status = registeredModule.module.getStatus();
      
      if (status.loaded) {
        loadedModules++;
      }
      
      if (status.healthy) {
        healthyModules++;
      } else if (status.lastError) {
        errors.push(`${registeredModule.module.metadata.id}: ${status.lastError.message}`);
      }
    }
    
    return {
      totalModules: this.modules.size,
      loadedModules,
      healthyModules,
      errors
    };
  }

  /**
   * Update module configuration
   */
  async updateConfig(moduleId: string, config: Partial<ModuleConfig>): Promise<void> {
    const registeredModule = this.modules.get(moduleId);
    if (!registeredModule) {
      throw new ModuleError(`Module ${moduleId} not found`, moduleId, 'NOT_FOUND');
    }

    console.log(`🔧 Updating config for module: ${moduleId}`, config);
    
    // Merge with existing config
    registeredModule.config = {
      ...registeredModule.config,
      ...config
    };
    
    console.log(`✅ Config updated for module: ${moduleId}`);
  }

  /**
   * Get module configuration
   */
  getConfig(moduleId: string): ModuleConfig | null {
    const registeredModule = this.modules.get(moduleId);
    return registeredModule ? { ...registeredModule.config } : null;
  }

  /**
   * Get enabled modules only
   */
  getEnabledModules(): CalculatorModule[] {
    return Array.from(this.modules.values())
      .filter(rm => rm.config.enabled)
      .map(rm => rm.module);
  }

  /**
   * Get modules that should auto-load
   */
  getAutoLoadModules(): CalculatorModule[] {
    return Array.from(this.modules.values())
      .filter(rm => rm.config.enabled && rm.config.autoLoad)
      .map(rm => rm.module);
  }

  /**
   * Get modules sorted by priority
   */
  getModulesByPriority(): CalculatorModule[] {
    return Array.from(this.modules.values())
      .sort((a, b) => (b.module.metadata.priority || 0) - (a.module.metadata.priority || 0))
      .map(rm => rm.module);
  }

  /**
   * Search modules by name or description
   */
  searchModules(query: string): CalculatorModule[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.modules.values())
      .filter(rm => {
        const metadata = rm.module.metadata;
        return metadata.name.toLowerCase().includes(lowerQuery) ||
               metadata.description.toLowerCase().includes(lowerQuery) ||
               metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      })
      .map(rm => rm.module);
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const modules = Array.from(this.modules.values());
    const categories = new Map<string, number>();
    const tags = new Map<string, number>();
    
    for (const registeredModule of modules) {
      const metadata = registeredModule.module.metadata;
      
      // Count by category
      categories.set(metadata.category, (categories.get(metadata.category) || 0) + 1);
      
      // Count by tags
      for (const tag of metadata.tags) {
        tags.set(tag, (tags.get(tag) || 0) + 1);
      }
    }
    
    return {
      totalModules: this.modules.size,
      enabledModules: this.getEnabledModules().length,
      autoLoadModules: this.getAutoLoadModules().length,
      categoryCounts: Object.fromEntries(categories),
      tagCounts: Object.fromEntries(tags),
      oldestRegistration: modules.length > 0 ? 
        Math.min(...modules.map(rm => rm.registeredAt.getTime())) : null,
      newestRegistration: modules.length > 0 ? 
        Math.max(...modules.map(rm => rm.registeredAt.getTime())) : null
    };
  }

  /**
   * Validate module before registration
   */
  private validateModule(module: CalculatorModule): void {
    if (!module) {
      throw new Error('Module cannot be null or undefined');
    }
    
    if (!module.metadata) {
      throw new Error('Module must have metadata');
    }
    
    if (!module.metadata.id) {
      throw new Error('Module must have an ID');
    }
    
    if (!module.metadata.name) {
      throw new Error('Module must have a name');
    }
    
    if (!module.metadata.version) {
      throw new Error('Module must have a version');
    }
    
    if (typeof module.calculate !== 'function') {
      throw new Error('Module must implement calculate method');
    }
    
    if (typeof module.validateInputs !== 'function') {
      throw new Error('Module must implement validateInputs method');
    }
    
    if (typeof module.getStatus !== 'function') {
      throw new Error('Module must implement getStatus method');
    }
  }

  /**
   * Clear all registered modules
   */
  async clearAll(): Promise<void> {
    console.log('🔧 Clearing all registered modules...');
    
    const moduleIds = Array.from(this.modules.keys());
    for (const moduleId of moduleIds) {
      try {
        await this.unregister(moduleId);
      } catch (error) {
        console.error(`❌ Error unregistering module ${moduleId}:`, error);
      }
    }
    
    console.log('✅ All modules cleared from registry');
  }
}

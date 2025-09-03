/**
 * Module Initializer
 * 
 * Handles the registration and initialization of all calculator modules
 * in the new modular system.
 */

import { ModuleManager } from '../core/ModuleManager';
import { CalculatorModule } from '../types/calculator-module';

// Import all calculator modules
import { GasConsumptionCalculator } from './calculators/GasConsumptionCalculator';
import { CuttingTimeEstimator } from './calculators/CuttingTimeEstimator';
import { LaserParameterOptimizer } from './calculators/LaserParameterOptimizer';

export class ModuleInitializer {
  private moduleManager: ModuleManager;
  private registeredModules = new Map<string, CalculatorModule>();

  constructor(moduleManager: ModuleManager) {
    this.moduleManager = moduleManager;
  }

  /**
   * Register all available calculator modules
   */
  async registerAllModules(): Promise<void> {
    console.log('🔧 Registering all calculator modules...');

    try {
      // Register core modules
      await this.registerCoreModules();
      
      // Register advanced modules
      await this.registerAdvancedModules();
      
      console.log(`✅ Successfully registered ${this.registeredModules.size} modules`);
      
    } catch (error) {
      console.error('❌ Failed to register modules:', error);
      throw error;
    }
  }

  /**
   * Register core calculator modules
   */
  private async registerCoreModules(): Promise<void> {
    console.log('📦 Registering core modules...');

    // Gas Consumption Calculator
    try {
      const gasCalculator = new GasConsumptionCalculator();
      await this.registerModule(gasCalculator, {
        enabled: true,
        autoLoad: true,
        lazyLoad: false,
        errorHandling: 'graceful'
      });
    } catch (error) {
      console.error('❌ Failed to register Gas Consumption Calculator:', error);
    }

    // Cutting Time Estimator
    try {
      const timeEstimator = new CuttingTimeEstimator();
      await this.registerModule(timeEstimator, {
        enabled: true,
        autoLoad: true,
        lazyLoad: false,
        errorHandling: 'graceful'
      });
    } catch (error) {
      console.error('❌ Failed to register Cutting Time Estimator:', error);
    }

    console.log('✅ Core modules registered');
  }

  /**
   * Register advanced calculator modules
   */
  private async registerAdvancedModules(): Promise<void> {
    console.log('📦 Registering advanced modules...');

    // Laser Parameter Optimizer
    try {
      const paramOptimizer = new LaserParameterOptimizer();
      await this.registerModule(paramOptimizer, {
        enabled: true,
        autoLoad: true,
        lazyLoad: false,
        errorHandling: 'graceful'
      });
    } catch (error) {
      console.error('❌ Failed to register Laser Parameter Optimizer:', error);
    }

    console.log('✅ Advanced modules registered');
  }

  /**
   * Register a single module with the module manager
   */
  private async registerModule(module: CalculatorModule, config: any): Promise<void> {
    try {
      console.log(`📝 Registering module: ${module.metadata.name}`);
      
      // Register with dependency resolver first
      this.moduleManager['dependencyResolver'].registerModule(module.metadata);
      
      // Register with module registry
      await this.moduleManager['registry'].register(module, config);
      
      // Track locally
      this.registeredModules.set(module.metadata.id, module);
      
      console.log(`✅ Module registered: ${module.metadata.name}`);
      
    } catch (error) {
      console.error(`❌ Failed to register module ${module.metadata.name}:`, error);
      throw error;
    }
  }

  /**
   * Initialize all registered modules
   */
  async initializeAllModules(): Promise<void> {
    console.log('🚀 Initializing all registered modules...');

    let successCount = 0;
    let errorCount = 0;

    for (const [moduleId, module] of this.registeredModules) {
      try {
        console.log(`🔧 Initializing module: ${module.metadata.name}`);
        await module.initialize();
        successCount++;
        console.log(`✅ Module initialized: ${module.metadata.name}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to initialize module ${module.metadata.name}:`, error);
      }
    }

    console.log(`📊 Module initialization complete: ${successCount} success, ${errorCount} errors`);
  }

  /**
   * Get initialization status
   */
  getInitializationStatus() {
    const modules = Array.from(this.registeredModules.values());
    
    const status = {
      totalModules: modules.length,
      initializedModules: 0,
      healthyModules: 0,
      moduleDetails: [] as any[]
    };

    for (const module of modules) {
      const moduleStatus = module.getStatus();
      
      if (moduleStatus.initialized) {
        status.initializedModules++;
      }
      
      if (moduleStatus.healthy) {
        status.healthyModules++;
      }

      status.moduleDetails.push({
        id: module.metadata.id,
        name: module.metadata.name,
        version: module.metadata.version,
        category: module.metadata.category,
        initialized: moduleStatus.initialized,
        healthy: moduleStatus.healthy,
        loadTime: moduleStatus.loadTime,
        lastError: moduleStatus.lastError?.message
      });
    }

    return status;
  }

  /**
   * Test all modules with example inputs
   */
  async testAllModules(): Promise<void> {
    console.log('🧪 Testing all modules with example inputs...');

    for (const [moduleId, module] of this.registeredModules) {
      try {
        console.log(`🧪 Testing module: ${module.metadata.name}`);
        
        // Get example inputs
        const examples = module.getExamples?.() || [];
        
        if (examples.length === 0) {
          console.warn(`⚠️ No examples available for ${module.metadata.name}`);
          continue;
        }

        // Test with first example
        const testInput = examples[0];
        console.log(`🔧 Testing with input:`, testInput);
        
        const result = await module.calculate(testInput);
        console.log(`✅ Test successful for ${module.metadata.name}:`, {
          totalCost: result.summary?.totalCost,
          totalTime: result.summary?.totalTime,
          efficiency: result.summary?.efficiency
        });
        
      } catch (error) {
        console.error(`❌ Test failed for ${module.metadata.name}:`, error);
      }
    }

    console.log('🧪 Module testing complete');
  }

  /**
   * Get registered modules by category
   */
  getModulesByCategory(category: string): CalculatorModule[] {
    return Array.from(this.registeredModules.values())
      .filter(module => module.metadata.category === category);
  }

  /**
   * Get all registered modules
   */
  getAllModules(): CalculatorModule[] {
    return Array.from(this.registeredModules.values());
  }

  /**
   * Get module by ID
   */
  getModule(moduleId: string): CalculatorModule | undefined {
    return this.registeredModules.get(moduleId);
  }

  /**
   * Shutdown all modules
   */
  async shutdownAllModules(): Promise<void> {
    console.log('🔧 Shutting down all modules...');

    for (const [moduleId, module] of this.registeredModules) {
      try {
        await module.destroy();
        console.log(`✅ Module shutdown: ${module.metadata.name}`);
      } catch (error) {
        console.error(`❌ Error shutting down ${module.metadata.name}:`, error);
      }
    }

    this.registeredModules.clear();
    console.log('✅ All modules shutdown complete');
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus() {
    const initStatus = this.getInitializationStatus();
    const moduleManagerStatus = this.moduleManager.getSystemStatus();

    return {
      moduleInitializer: initStatus,
      moduleManager: moduleManagerStatus,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Create and configure a module initializer
 */
export async function createModuleInitializer(moduleManager: ModuleManager): Promise<ModuleInitializer> {
  const initializer = new ModuleInitializer(moduleManager);
  
  try {
    // Register all modules
    await initializer.registerAllModules();
    
    // Initialize all modules
    await initializer.initializeAllModules();
    
    // Test all modules
    await initializer.testAllModules();
    
    console.log('✅ Module initializer setup complete');
    return initializer;
    
  } catch (error) {
    console.error('❌ Failed to setup module initializer:', error);
    throw error;
  }
}

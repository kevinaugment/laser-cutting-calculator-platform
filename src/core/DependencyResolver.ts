/**
 * Dependency Resolver
 * 
 * Handles module dependency resolution, circular dependency detection,
 * and optimal loading order calculation.
 */

import { 
  DependencyResolver, 
  DependencyError,
  ModuleMetadata 
} from '../types/calculator-module';

export class ModuleDependencyResolver implements DependencyResolver {
  private dependencyGraph = new Map<string, string[]>();
  private moduleMetadata = new Map<string, ModuleMetadata>();

  constructor() {
    console.log('🔧 Module Dependency Resolver initialized');
  }

  /**
   * Register module metadata for dependency resolution
   */
  registerModule(metadata: ModuleMetadata): void {
    this.moduleMetadata.set(metadata.id, metadata);
    this.dependencyGraph.set(metadata.id, metadata.dependencies || []);
    
    console.log(`📝 Registered module dependencies: ${metadata.id}`, metadata.dependencies);
  }

  /**
   * Unregister module from dependency tracking
   */
  unregisterModule(moduleId: string): void {
    this.moduleMetadata.delete(moduleId);
    this.dependencyGraph.delete(moduleId);
    
    // Remove this module from other modules' dependencies
    for (const [id, deps] of this.dependencyGraph.entries()) {
      const index = deps.indexOf(moduleId);
      if (index > -1) {
        deps.splice(index, 1);
      }
    }
    
    console.log(`🗑️ Unregistered module dependencies: ${moduleId}`);
  }

  /**
   * Resolve all dependencies for a module
   */
  async resolveDependencies(moduleId: string): Promise<string[]> {
    console.log(`🔍 Resolving dependencies for: ${moduleId}`);
    
    const visited = new Set<string>();
    const resolved = new Set<string>();
    const resolving = new Set<string>();
    
    const resolveDependency = (id: string): void => {
      if (resolved.has(id)) {
        return; // Already resolved
      }
      
      if (resolving.has(id)) {
        throw new DependencyError(
          `Circular dependency detected involving module: ${id}`,
          moduleId,
          Array.from(resolving)
        );
      }
      
      if (!this.dependencyGraph.has(id)) {
        throw new DependencyError(
          `Module not found: ${id}`,
          moduleId,
          [id]
        );
      }
      
      resolving.add(id);
      visited.add(id);
      
      const dependencies = this.dependencyGraph.get(id) || [];
      for (const depId of dependencies) {
        resolveDependency(depId);
      }
      
      resolving.delete(id);
      resolved.add(id);
    };
    
    try {
      resolveDependency(moduleId);
      
      // Remove the target module from its own dependencies
      resolved.delete(moduleId);
      
      const result = Array.from(resolved);
      console.log(`✅ Dependencies resolved for ${moduleId}:`, result);
      
      return result;
    } catch (error) {
      console.error(`❌ Failed to resolve dependencies for ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Check for circular dependencies
   */
  checkCircularDependencies(moduleId: string): boolean {
    console.log(`🔍 Checking circular dependencies for: ${moduleId}`);
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCircularDependency = (id: string): boolean => {
      if (recursionStack.has(id)) {
        return true; // Circular dependency found
      }
      
      if (visited.has(id)) {
        return false; // Already checked
      }
      
      visited.add(id);
      recursionStack.add(id);
      
      const dependencies = this.dependencyGraph.get(id) || [];
      for (const depId of dependencies) {
        if (hasCircularDependency(depId)) {
          return true;
        }
      }
      
      recursionStack.delete(id);
      return false;
    };
    
    const hasCircular = hasCircularDependency(moduleId);
    
    if (hasCircular) {
      console.warn(`⚠️ Circular dependency detected for: ${moduleId}`);
    } else {
      console.log(`✅ No circular dependencies for: ${moduleId}`);
    }
    
    return hasCircular;
  }

  /**
   * Get optimal loading order for multiple modules
   */
  getLoadOrder(moduleIds: string[]): string[] {
    console.log(`🔍 Calculating load order for modules:`, moduleIds);
    
    // Collect all modules and their dependencies
    const allModules = new Set<string>();
    const addModuleAndDeps = (moduleId: string) => {
      if (allModules.has(moduleId)) {
        return;
      }
      
      allModules.add(moduleId);
      const dependencies = this.dependencyGraph.get(moduleId) || [];
      for (const depId of dependencies) {
        addModuleAndDeps(depId);
      }
    };
    
    for (const moduleId of moduleIds) {
      addModuleAndDeps(moduleId);
    }
    
    // Topological sort
    const result: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();
    
    const visit = (moduleId: string) => {
      if (visited.has(moduleId)) {
        return;
      }
      
      if (visiting.has(moduleId)) {
        throw new DependencyError(
          `Circular dependency detected in load order calculation`,
          moduleId,
          Array.from(visiting)
        );
      }
      
      visiting.add(moduleId);
      
      const dependencies = this.dependencyGraph.get(moduleId) || [];
      for (const depId of dependencies) {
        if (allModules.has(depId)) {
          visit(depId);
        }
      }
      
      visiting.delete(moduleId);
      visited.add(moduleId);
      result.push(moduleId);
    };
    
    try {
      for (const moduleId of allModules) {
        visit(moduleId);
      }
      
      // Sort by priority if available
      result.sort((a, b) => {
        const metaA = this.moduleMetadata.get(a);
        const metaB = this.moduleMetadata.get(b);
        const priorityA = metaA?.priority || 0;
        const priorityB = metaB?.priority || 0;
        return priorityB - priorityA; // Higher priority first
      });
      
      console.log(`✅ Load order calculated:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ Failed to calculate load order:`, error);
      throw error;
    }
  }

  /**
   * Get dependency tree for a module
   */
  getDependencyTree(moduleId: string): any {
    const buildTree = (id: string, visited = new Set<string>()): any => {
      if (visited.has(id)) {
        return { id, circular: true };
      }
      
      visited.add(id);
      const dependencies = this.dependencyGraph.get(id) || [];
      const children = dependencies.map(depId => buildTree(depId, new Set(visited)));
      visited.delete(id);
      
      return {
        id,
        name: this.moduleMetadata.get(id)?.name || id,
        dependencies: children
      };
    };
    
    return buildTree(moduleId);
  }

  /**
   * Get modules that depend on a specific module
   */
  getDependents(moduleId: string): string[] {
    const dependents: string[] = [];
    
    for (const [id, dependencies] of this.dependencyGraph.entries()) {
      if (dependencies.includes(moduleId)) {
        dependents.push(id);
      }
    }
    
    return dependents;
  }

  /**
   * Validate all dependencies in the system
   */
  validateAllDependencies(): { valid: boolean; errors: string[] } {
    console.log('🔍 Validating all module dependencies...');
    
    const errors: string[] = [];
    
    for (const [moduleId, dependencies] of this.dependencyGraph.entries()) {
      // Check if all dependencies exist
      for (const depId of dependencies) {
        if (!this.dependencyGraph.has(depId)) {
          errors.push(`Module ${moduleId} depends on non-existent module: ${depId}`);
        }
      }
      
      // Check for circular dependencies
      try {
        if (this.checkCircularDependencies(moduleId)) {
          errors.push(`Circular dependency detected for module: ${moduleId}`);
        }
      } catch (error) {
        errors.push(`Error checking dependencies for ${moduleId}: ${error}`);
      }
    }
    
    const valid = errors.length === 0;
    
    if (valid) {
      console.log('✅ All dependencies are valid');
    } else {
      console.error('❌ Dependency validation failed:', errors);
    }
    
    return { valid, errors };
  }

  /**
   * Get dependency statistics
   */
  getStats() {
    const totalModules = this.dependencyGraph.size;
    let totalDependencies = 0;
    let maxDependencies = 0;
    let modulesWithDependencies = 0;
    
    for (const dependencies of this.dependencyGraph.values()) {
      totalDependencies += dependencies.length;
      maxDependencies = Math.max(maxDependencies, dependencies.length);
      if (dependencies.length > 0) {
        modulesWithDependencies++;
      }
    }
    
    return {
      totalModules,
      totalDependencies,
      averageDependencies: totalModules > 0 ? totalDependencies / totalModules : 0,
      maxDependencies,
      modulesWithDependencies,
      independentModules: totalModules - modulesWithDependencies
    };
  }

  /**
   * Clear all dependency information
   */
  clear(): void {
    this.dependencyGraph.clear();
    this.moduleMetadata.clear();
    console.log('🗑️ Dependency resolver cleared');
  }
}

/**
 * Memory System Higher-Order Component
 * Enhances components with memory system functionality
 */

import React, { ComponentType, useCallback, useEffect } from 'react';
import { useMemorySystem, MemorySystemState, MemorySystemActions, MemorySystemConfig } from '../../hooks/useMemorySystem';
import { MemoryQuickAccess } from './MemorySystemPanel';

// ============================================================================
// HOC Props Interface
// ============================================================================

export interface WithMemorySystemProps {
  memorySystem: {
    state: MemorySystemState;
    actions: MemorySystemActions;
  };
  onMemoryParametersApply?: (parameters: Record<string, any>) => void;
}

// ============================================================================
// HOC Configuration
// ============================================================================

export interface WithMemorySystemOptions extends MemorySystemConfig {
  showQuickAccess?: boolean;
  quickAccessPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  autoSaveCalculations?: boolean;
  autoSaveDelay?: number;
}

const DEFAULT_OPTIONS: Required<WithMemorySystemOptions> = {
  calculatorType: '',
  autoSave: true,
  autoLoad: true,
  enablePresets: true,
  enableHistory: true,
  enablePreferences: true,
  historyPageSize: 20,
  presetsPageSize: 20,
  showQuickAccess: true,
  quickAccessPosition: 'top-right',
  autoSaveCalculations: true,
  autoSaveDelay: 1000,
};

// ============================================================================
// Higher-Order Component
// ============================================================================

export function withMemorySystem<P extends object>(
  WrappedComponent: ComponentType<P & WithMemorySystemProps>,
  options: WithMemorySystemOptions = {}
) {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };

  const WithMemorySystemComponent = (props: P) => {
    const [memoryState, memoryActions] = useMemorySystem(finalOptions);

    // Auto-save functionality
    const handleAutoSave = useCallback(async (
      calculatorType: string,
      calculatorName: string,
      inputs: Record<string, any>,
      outputs: Record<string, any>,
      context?: any
    ) => {
      if (finalOptions.autoSaveCalculations && finalOptions.enableHistory) {
        try {
          await memoryActions.saveCalculation(
            calculatorType,
            calculatorName,
            inputs,
            outputs,
            context
          );
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, [memoryActions, finalOptions.autoSaveCalculations, finalOptions.enableHistory]);

    // Parameter application handler
    const handleParametersApply = useCallback((parameters: Record<string, any>) => {
      // This will be passed to the wrapped component
      if (props && typeof props === 'object' && 'onMemoryParametersApply' in props) {
        const onApply = (props as any).onMemoryParametersApply;
        if (typeof onApply === 'function') {
          onApply(parameters);
        }
      }
    }, [props]);

    // Enhanced props with memory system
    const enhancedProps = {
      ...props,
      memorySystem: {
        state: memoryState,
        actions: memoryActions,
      },
      onMemoryParametersApply: handleParametersApply,
    } as P & WithMemorySystemProps;

    return (
      <div className="relative">
        <WrappedComponent {...enhancedProps} />
        
        {/* Quick Access Widget */}
        {finalOptions.showQuickAccess && (
          <div className={`absolute z-40 ${getQuickAccessPositionClasses(finalOptions.quickAccessPosition)}`}>
            <MemoryQuickAccess
              calculatorType={finalOptions.calculatorType}
              onParametersApply={handleParametersApply}
              className="shadow-lg"
            />
          </div>
        )}
      </div>
    );
  };

  WithMemorySystemComponent.displayName = `withMemorySystem(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithMemorySystemComponent;
}

// ============================================================================
// Utility Functions
// ============================================================================

function getQuickAccessPositionClasses(position: string): string {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    default:
      return 'top-4 right-4';
  }
}

// ============================================================================
// Memory-Enhanced Calculator Component
// ============================================================================

export interface MemoryEnhancedCalculatorProps {
  calculatorType: string;
  calculatorName: string;
  children: React.ReactNode;
  onCalculationComplete?: (inputs: Record<string, any>, outputs: Record<string, any>) => void;
  onParametersChange?: (parameters: Record<string, any>) => void;
  className?: string;
}

export function MemoryEnhancedCalculator({
  calculatorType,
  calculatorName,
  children,
  onCalculationComplete,
  onParametersChange,
  className = '',
}: MemoryEnhancedCalculatorProps) {
  const [memoryState, memoryActions] = useMemorySystem({
    calculatorType,
    autoSave: true,
    autoLoad: true,
  });

  // Handle calculation completion with auto-save
  const handleCalculationComplete = useCallback(async (
    inputs: Record<string, any>,
    outputs: Record<string, any>
  ) => {
    // Call original handler
    onCalculationComplete?.(inputs, outputs);

    // Auto-save to memory system
    try {
      await memoryActions.saveCalculation(
        calculatorType,
        calculatorName,
        inputs,
        outputs,
        {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }
      );
    } catch (error) {
      console.error('Failed to save calculation:', error);
    }
  }, [onCalculationComplete, memoryActions, calculatorType, calculatorName]);

  // Handle parameter application from presets
  const handleParametersApply = useCallback((parameters: Record<string, any>) => {
    onParametersChange?.(parameters);
  }, [onParametersChange]);

  return (
    <div className={`memory-enhanced-calculator ${className}`}>
      <div className="relative">
        {/* Calculator Content */}
        <div className="calculator-content">
          {children}
        </div>

        {/* Memory Quick Access */}
        <div className="absolute top-4 right-4 z-40">
          <MemoryQuickAccess
            calculatorType={calculatorType}
            onParametersApply={handleParametersApply}
            className="shadow-lg"
          />
        </div>

        {/* Memory Status Indicator */}
        {(memoryState.history.loading || memoryState.presets.loading) && (
          <div className="absolute top-4 left-4 z-40">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                <span className="text-sm text-gray-600">Syncing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Indicator */}
        {(memoryState.history.error || memoryState.presets.error) && (
          <div className="absolute top-4 left-4 z-40">
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-600">Memory Error</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Memory System Provider Component
// ============================================================================

export interface MemorySystemProviderProps {
  children: React.ReactNode;
  config?: MemorySystemConfig;
}

const MemorySystemContext = React.createContext<{
  state: MemorySystemState;
  actions: MemorySystemActions;
} | null>(null);

export function MemorySystemProvider({ children, config = {} }: MemorySystemProviderProps) {
  const [state, actions] = useMemorySystem(config);

  const contextValue = {
    state,
    actions,
  };

  return (
    <MemorySystemContext.Provider value={contextValue}>
      {children}
    </MemorySystemContext.Provider>
  );
}

// Hook to use memory system context
export function useMemorySystemContext() {
  const context = React.useContext(MemorySystemContext);
  if (!context) {
    throw new Error('useMemorySystemContext must be used within a MemorySystemProvider');
  }
  return context;
}

// ============================================================================
// Convenience HOCs
// ============================================================================

/**
 * HOC for calculator components with memory system
 */
export function withCalculatorMemory<P extends object>(
  WrappedComponent: ComponentType<P & WithMemorySystemProps>,
  calculatorType: string
) {
  return withMemorySystem(WrappedComponent, {
    calculatorType,
    autoSaveCalculations: true,
    showQuickAccess: true,
    quickAccessPosition: 'top-right',
  });
}

/**
 * HOC for read-only components with memory system
 */
export function withReadOnlyMemory<P extends object>(
  WrappedComponent: ComponentType<P & WithMemorySystemProps>,
  calculatorType?: string
) {
  return withMemorySystem(WrappedComponent, {
    calculatorType,
    autoSave: false,
    autoSaveCalculations: false,
    showQuickAccess: false,
  });
}

/**
 * HOC for preset-only components
 */
export function withPresetMemory<P extends object>(
  WrappedComponent: ComponentType<P & WithMemorySystemProps>,
  calculatorType?: string
) {
  return withMemorySystem(WrappedComponent, {
    calculatorType,
    enableHistory: false,
    enablePreferences: false,
    enablePresets: true,
    showQuickAccess: true,
    quickAccessPosition: 'top-right',
  });
}

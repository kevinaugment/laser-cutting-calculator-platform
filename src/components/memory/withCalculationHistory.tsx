/**
 * Higher-Order Component for Calculation History
 * Adds automatic history tracking to calculator components
 */

import React, { useCallback, useEffect, useState } from 'react';
import { CalculationContext } from '../../types/memory';
import { useCalculationHistory } from '../../hooks/useCalculationHistory';
import { CalculationHistoryPanel } from './CalculationHistoryPanel';

export interface WithHistoryProps {
  showHistory?: boolean;
  onHistoryToggle?: (show: boolean) => void;
  calculatorType: string;
  calculatorName: string;
  autoSave?: boolean;
  context?: Partial<CalculationContext>;
}

export interface HistoryEnhancedProps {
  saveToHistory: (inputs: Record<string, any>, outputs: Record<string, any>) => Promise<string>;
  restoreFromHistory: (inputs: Record<string, any>) => void;
  historyPanel: React.ReactNode;
  historyStats: {
    totalCalculations: number;
    averageExecutionTime: number;
  } | null;
}

/**
 * Higher-order component that adds calculation history functionality
 */
export function withCalculationHistory<P extends object>(
  WrappedComponent: React.ComponentType<P & HistoryEnhancedProps>
) {
  return function WithCalculationHistoryComponent(
    props: P & WithHistoryProps
  ) {
    const {
      showHistory = false,
      onHistoryToggle,
      calculatorType,
      calculatorName,
      autoSave = true,
      context,
      ...restProps
    } = props;

    const [isHistoryVisible, setIsHistoryVisible] = useState(showHistory);
    const [state, actions] = useCalculationHistory({
      autoLoad: true,
      pageSize: 10,
      enableStats: true,
    });

    // Handle history visibility toggle
    const handleHistoryToggle = useCallback((show: boolean) => {
      setIsHistoryVisible(show);
      onHistoryToggle?.(show);
    }, [onHistoryToggle]);

    // Save calculation to history
    const saveToHistory = useCallback(async (
      inputs: Record<string, any>,
      outputs: Record<string, any>
    ): Promise<string> => {
      try {
        const id = await actions.saveCalculation(
          calculatorType,
          calculatorName,
          inputs,
          outputs,
          context
        );
        return id;
      } catch (error) {
        console.error('Failed to save calculation to history:', error);
        throw error;
      }
    }, [actions, calculatorType, calculatorName, context]);

    // Restore calculation from history
    const restoreFromHistory = useCallback((inputs: Record<string, any>) => {
      // This will be handled by the wrapped component
      // The component should implement logic to restore inputs
      console.log('Restoring calculation from history:', inputs);
    }, []);

    // History panel component
    const historyPanel = (
      <CalculationHistoryPanel
        calculatorType={calculatorType}
        onRecordRestore={(record) => {
          restoreFromHistory(record.inputs);
        }}
        className="mt-6"
      />
    );

    // History statistics
    const historyStats = state.stats ? {
      totalCalculations: state.stats.totalRecords,
      averageExecutionTime: state.stats.averageExecutionTime,
    } : null;

    // Enhanced props to pass to wrapped component
    const enhancedProps: HistoryEnhancedProps = {
      saveToHistory,
      restoreFromHistory,
      historyPanel: isHistoryVisible ? historyPanel : null,
      historyStats,
    };

    return (
      <div className="calculator-with-history">
        {/* Calculator Component */}
        <WrappedComponent
          {...(restProps as P)}
          {...enhancedProps}
        />

        {/* History Toggle Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handleHistoryToggle(!isHistoryVisible)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isHistoryVisible ? 'Hide History' : 'Show History'}
            {historyStats && (
              <span className="ml-1 px-2 py-1 bg-gray-100 text-xs rounded">
                {historyStats.totalCalculations}
              </span>
            )}
          </button>
        </div>

        {/* History Panel */}
        {isHistoryVisible && historyPanel}
      </div>
    );
  };
}

/**
 * Hook for calculator components to easily integrate history functionality
 */
export function useCalculatorHistory(
  calculatorType: string,
  calculatorName: string,
  context?: Partial<CalculationContext>
) {
  const [state, actions] = useCalculationHistory({
    autoLoad: false,
    pageSize: 5,
    enableStats: false,
  });

  // Auto-save function that can be called after calculations
  const autoSave = useCallback(async (
    inputs: Record<string, any>,
    outputs: Record<string, any>
  ) => {
    try {
      await actions.saveCalculation(
        calculatorType,
        calculatorName,
        inputs,
        outputs,
        context
      );
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [actions, calculatorType, calculatorName, context]);

  // Get recent calculations for this calculator type
  const getRecentCalculations = useCallback(async (limit: number = 5) => {
    await actions.filterByCalculator(calculatorType);
    return state.records.slice(0, limit);
  }, [actions, calculatorType, state.records]);

  return {
    autoSave,
    getRecentCalculations,
    historyState: state,
    historyActions: actions,
  };
}

/**
 * Component for displaying a compact history widget
 */
export interface CalculationHistoryWidgetProps {
  calculatorType: string;
  onRecordSelect?: (record: any) => void;
  maxRecords?: number;
  className?: string;
}

export function CalculationHistoryWidget({
  calculatorType,
  onRecordSelect,
  maxRecords = 3,
  className = '',
}: CalculationHistoryWidgetProps) {
  const [state, actions] = useCalculationHistory({
    autoLoad: true,
    pageSize: maxRecords,
    enableStats: false,
  });

  useEffect(() => {
    actions.filterByCalculator(calculatorType);
  }, [calculatorType, actions]);

  if (state.loading) {
    return (
      <div className={`calculation-history-widget ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="space-y-2">
            {[...Array(maxRecords)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state.records.length === 0) {
    return (
      <div className={`calculation-history-widget ${className}`}>
        <div className="text-center text-gray-500 py-4">
          <svg className="w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">No recent calculations</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`calculation-history-widget ${className}`}>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Calculations</h4>
      <div className="space-y-2">
        {state.records.slice(0, maxRecords).map((record) => (
          <div
            key={record.id}
            className="p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onRecordSelect?.(record)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-600 truncate">
                  {new Date(record.timestamp).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-900 mt-1">
                  {Object.entries(record.inputs).slice(0, 2).map(([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="p-1 text-gray-400 hover:text-primary-600"
                title="Restore calculation"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

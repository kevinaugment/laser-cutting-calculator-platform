'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCalculatorTranslation, useLocaleFormatting } from '@/lib/i18n/hooks';
import { 
  BaseCalculatorConfig, 
  BaseCalculationResult, 
  BaseCalculatorState,
  ValidationResult,
  IBaseCalculator 
} from '@/lib/calculator/BaseCalculator';

// Props interfaces for each component
export interface BaseCalculatorProps {
  calculator: IBaseCalculator;
  initialInputs?: Record<string, any>;
  onCalculationComplete?: (result: BaseCalculationResult) => void;
  onInputChange?: (inputs: Record<string, any>) => void;
}

export interface CalculatorFormProps {
  config: BaseCalculatorConfig;
  inputs: Record<string, any>;
  validationErrors: ValidationResult;
  isCalculating: boolean;
  onChange: (field: string, value: any) => void;
  onCalculate: () => void;
  onReset: () => void;
}

export interface CalculatorResultsProps {
  config: BaseCalculatorConfig;
  results: BaseCalculationResult | null;
  isCalculating: boolean;
}

export interface CalculatorChartProps {
  config: BaseCalculatorConfig;
  results: BaseCalculationResult | null;
  chartType?: 'bar' | 'line' | 'pie' | 'radar';
}

export interface CalculatorExportProps {
  config: BaseCalculatorConfig;
  results: BaseCalculationResult | null;
  calculator: IBaseCalculator;
}

export interface CalculatorHelpProps {
  config: BaseCalculatorConfig;
}

/**
 * Main Calculator Container Component
 * Manages state and orchestrates all calculator components
 */
export function BaseCalculatorContainer({ 
  calculator, 
  initialInputs,
  onCalculationComplete,
  onInputChange 
}: BaseCalculatorProps) {
  const { t } = useTranslation('common');
  const calculatorT = useCalculatorTranslation(calculator.config.id);
  
  // Calculator state
  const [state, setState] = useState<BaseCalculatorState>({
    inputs: initialInputs || calculator.getDefaultInputs(),
    results: null,
    isCalculating: false,
    validationErrors: { isValid: true, errors: [], warnings: [] },
    history: []
  });

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: any) => {
    const newInputs = { ...state.inputs, [field]: value };
    
    setState(prev => ({
      ...prev,
      inputs: newInputs,
      validationErrors: calculator.validateInputs(newInputs)
    }));
    
    onInputChange?.(newInputs);
  }, [state.inputs, calculator, onInputChange]);

  // Handle calculation
  const handleCalculate = useCallback(async () => {
    const validation = calculator.validateInputs(state.inputs);
    
    if (!validation.isValid) {
      setState(prev => ({ ...prev, validationErrors: validation }));
      return;
    }

    setState(prev => ({ ...prev, isCalculating: true }));

    try {
      const startTime = performance.now();
      const result = await calculator.calculate(state.inputs);
      const endTime = performance.now();
      
      // Update calculation time in metadata
      result.metadata.calculationTime = endTime - startTime;
      
      setState(prev => ({
        ...prev,
        results: result,
        isCalculating: false,
        history: [
          ...prev.history.slice(-9), // Keep last 10 calculations
          {
            inputs: state.inputs,
            results: result,
            timestamp: new Date().toISOString()
          }
        ]
      }));
      
      onCalculationComplete?.(result);
      
    } catch (error) {
      const errorResult: BaseCalculationResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Calculation failed',
        metadata: {
          calculationTime: 0,
          timestamp: new Date().toISOString(),
          version: calculator.config.version,
          inputHash: ''
        }
      };
      
      setState(prev => ({
        ...prev,
        results: errorResult,
        isCalculating: false
      }));
    }
  }, [calculator, state.inputs, onCalculationComplete]);

  // Handle reset
  const handleReset = useCallback(() => {
    const defaultInputs = calculator.getDefaultInputs();
    setState(prev => ({
      ...prev,
      inputs: defaultInputs,
      results: null,
      validationErrors: { isValid: true, errors: [], warnings: [] }
    }));
    onInputChange?.(defaultInputs);
  }, [calculator, onInputChange]);

  // Load example inputs
  const handleLoadExample = useCallback(() => {
    const exampleInputs = calculator.getExampleInputs();
    setState(prev => ({
      ...prev,
      inputs: exampleInputs,
      validationErrors: calculator.validateInputs(exampleInputs)
    }));
    onInputChange?.(exampleInputs);
  }, [calculator, onInputChange]);

  return (
    <div className="calculator-container max-w-7xl mx-auto p-6 space-y-6">
      {/* Calculator Header */}
      <div className="calculator-header bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {calculatorT.getCalculatorTitle()}
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              {calculatorT.getCalculatorDescription()}
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${calculator.config.badge === 'AI Enhanced' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }
              `}>
                {calculator.config.badge}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {calculator.config.category}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleLoadExample}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {t('actions.load_example')}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {t('actions.reset')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="calculator-form">
          <CalculatorForm
            config={calculator.config}
            inputs={state.inputs}
            validationErrors={state.validationErrors}
            isCalculating={state.isCalculating}
            onChange={handleInputChange}
            onCalculate={handleCalculate}
            onReset={handleReset}
          />
        </div>

        {/* Results */}
        <div className="calculator-results">
          <CalculatorResults
            config={calculator.config}
            results={state.results}
            isCalculating={state.isCalculating}
          />
        </div>
      </div>

      {/* Chart and Export */}
      {state.results && state.results.success && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="calculator-chart">
            <CalculatorChart
              config={calculator.config}
              results={state.results}
            />
          </div>
          
          <div className="calculator-export">
            <CalculatorExport
              config={calculator.config}
              results={state.results}
              calculator={calculator}
            />
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="calculator-help">
        <CalculatorHelp config={calculator.config} />
      </div>
    </div>
  );
}

/**
 * Calculator Form Component
 * Renders input fields with validation
 */
export function CalculatorForm({
  config,
  inputs,
  validationErrors,
  isCalculating,
  onChange,
  onCalculate,
  onReset
}: CalculatorFormProps) {
  const { t } = useTranslation('common');
  const calculatorT = useCalculatorTranslation(config.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('calculator.form.inputs')}
      </h2>
      
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onCalculate(); }}>
        {config.inputs.map((input) => (
          <div key={input.id} className="form-field">
            <label 
              htmlFor={input.id}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {calculatorT.getInputLabel(input.id)}
              {input.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {input.type === 'number' && (
              <div className="relative">
                <input
                  type="number"
                  id={input.id}
                  value={inputs[input.id] || ''}
                  onChange={(e) => onChange(input.id, parseFloat(e.target.value) || 0)}
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  placeholder={calculatorT.getInputPlaceholder(input.id)}
                  className={`
                    block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${validationErrors.errors.some(e => e.field === input.id)
                      ? 'border-red-300 text-red-900 placeholder-red-300'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    dark:bg-gray-700 dark:text-white
                  `}
                  aria-describedby={`${input.id}-help`}
                />
                {input.unit && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {input.unit}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {input.type === 'select' && (
              <select
                id={input.id}
                value={inputs[input.id] || ''}
                onChange={(e) => onChange(input.id, e.target.value)}
                className={`
                  block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${validationErrors.errors.some(e => e.field === input.id)
                    ? 'border-red-300'
                    : 'border-gray-300 dark:border-gray-600'
                  }
                  dark:bg-gray-700 dark:text-white
                `}
                aria-describedby={`${input.id}-help`}
              >
                <option value="">{calculatorT.getInputPlaceholder(input.id)}</option>
                {input.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {/* Help text */}
            <p id={`${input.id}-help`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {calculatorT.getInputHelp(input.id)}
            </p>
            
            {/* Validation errors */}
            {validationErrors.errors
              .filter(error => error.field === input.id)
              .map((error, index) => (
                <p key={index} className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {error.message}
                </p>
              ))
            }
          </div>
        ))}
        
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isCalculating || !validationErrors.isValid}
            className={`
              flex-1 px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isCalculating || !validationErrors.isValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              }
            `}
          >
            {isCalculating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('status.calculating')}
              </div>
            ) : (
              t('actions.calculate')
            )}
          </button>
          
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {t('actions.reset')}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Calculator Results Component
 * Displays calculation results with formatting
 */
export function CalculatorResults({
  config,
  results,
  isCalculating
}: CalculatorResultsProps) {
  const { t } = useTranslation('common');
  const calculatorT = useCalculatorTranslation(config.id);
  const { formatCalculationResult } = useLocaleFormatting();

  if (isCalculating) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('status.calculating')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('calculator.form.results')}
        </h2>
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Enter parameters and click Calculate to see results
          </p>
        </div>
      </div>
    );
  }

  if (!results.success) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('calculator.form.results')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {t('status.error')}
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {results.error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('calculator.form.results')}
      </h2>

      {/* Primary Results */}
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-3">
            {t('calculator.results.summary')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.data && Object.entries(results.data).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {calculatorT.getResultLabel(key)}:
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {typeof value === 'number'
                    ? formatCalculationResult(value, '', 2)
                    : String(value)
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {results.warnings && results.warnings.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              {t('calculator.results.warnings')}
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              {results.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              {t('calculator.results.recommendations')}
            </h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              {results.recommendations.map((recommendation, index) => (
                <li key={index}>• {recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <span>Calculation time: {results.metadata.calculationTime.toFixed(1)}ms</span>
            <span>Version: {results.metadata.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculator Chart Component
 * Displays visual representation of results
 */
export function CalculatorChart({
  config,
  results,
  chartType = 'bar'
}: CalculatorChartProps) {
  const { t } = useTranslation('common');

  if (!results || !results.success || !results.data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('calculator.form.chart')}
        </h2>
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Chart will appear after calculation
          </p>
        </div>
      </div>
    );
  }

  // Extract numeric data for charting
  const chartData = Object.entries(results.data)
    .filter(([_, value]) => typeof value === 'number')
    .map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: value as number
    }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('calculator.form.chart')}
      </h2>

      {chartData.length > 0 ? (
        <div className="h-64">
          {/* Simple bar chart representation */}
          <div className="space-y-3">
            {chartData.map((item, index) => {
              const maxValue = Math.max(...chartData.map(d => d.value));
              const percentage = (item.value / maxValue) * 100;

              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate">
                    {item.label}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm font-medium text-gray-900 dark:text-white text-right">
                    {item.value.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No numeric data available for charting
        </p>
      )}
    </div>
  );
}

/**
 * Calculator Export Component
 * Handles data export in various formats
 */
export function CalculatorExport({
  config,
  results,
  calculator
}: CalculatorExportProps) {
  const { t } = useTranslation('common');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!results || !results.success) return;

    setIsExporting(true);
    setExportStatus(null);

    try {
      let blob: Blob | null = null;
      let filename = '';

      switch (format) {
        case 'pdf':
          blob = await calculator.exportToPDF(results);
          filename = `${config.id}-results.pdf`;
          break;
        case 'excel':
          blob = await calculator.exportToExcel(results);
          filename = `${config.id}-results.xlsx`;
          break;
        case 'csv':
          const csvData = await calculator.exportToCSV(results);
          blob = new Blob([csvData], { type: 'text/csv' });
          filename = `${config.id}-results.csv`;
          break;
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setExportStatus(t('export.success'));
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus(t('export.error'));
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleCopyResults = async () => {
    if (!results || !results.success) return;

    try {
      const textData = JSON.stringify(results.data, null, 2);
      await navigator.clipboard.writeText(textData);
      setExportStatus(t('success.copy'));
      setTimeout(() => setExportStatus(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      setExportStatus('Failed to copy to clipboard');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('calculator.form.export')}
      </h2>

      {results && results.success ? (
        <div className="space-y-4">
          {/* Export buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('export.formats.pdf')}
            </button>

            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('export.formats.excel')}
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('export.formats.csv')}
            </button>

            <button
              onClick={handleCopyResults}
              disabled={isExporting}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {t('actions.copy')}
            </button>
          </div>

          {/* Export status */}
          {exportStatus && (
            <div className={`p-3 rounded-md text-sm ${
              exportStatus.includes('success') || exportStatus.includes('Copied')
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              {exportStatus}
            </div>
          )}

          {/* Export info */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Export includes calculation inputs, results, and metadata.</p>
            <p>Timestamp: {new Date(results.metadata.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Complete calculation to enable export options
        </p>
      )}
    </div>
  );
}

/**
 * Calculator Help Component
 * Displays help documentation and usage guidelines
 */
export function CalculatorHelp({ config }: CalculatorHelpProps) {
  const { t } = useTranslation('common');
  const calculatorT = useCalculatorTranslation(config.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'parameters' | 'examples' | 'troubleshooting'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'parameters', label: 'Parameters', icon: '⚙️' },
    { id: 'examples', label: 'Examples', icon: '💡' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: '🔧' }
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('calculator.form.help')}
      </h2>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="prose dark:prose-invert max-w-none">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                About This Calculator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {calculatorT.getCalculatorDescription()}
              </p>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                Key Features
              </h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>High-precision calculations using decimal.js</li>
                <li>Real-time input validation</li>
                <li>Multiple export formats (PDF, Excel, CSV)</li>
                <li>Multi-language support (EN, DE, JP)</li>
                <li>Professional engineering standards compliance</li>
              </ul>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                Category: {config.category}
              </h4>
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${config.badge === 'AI Enhanced'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }
              `}>
                {config.badge}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'parameters' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Input Parameters
            </h3>
            <div className="space-y-4">
              {config.inputs.map((input) => (
                <div key={input.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {calculatorT.getInputLabel(input.id)}
                      {input.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {input.type}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                    {calculatorT.getInputHelp(input.id)}
                  </p>

                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {input.unit && <div>Unit: {input.unit}</div>}
                    {input.min !== undefined && <div>Minimum: {input.min}</div>}
                    {input.max !== undefined && <div>Maximum: {input.max}</div>}
                    {input.step && <div>Step: {input.step}</div>}
                    {input.options && (
                      <div>
                        Options: {input.options.map(opt => opt.label).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Usage Examples
            </h3>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                💡 Quick Start
              </h4>
              <ol className="list-decimal list-inside text-blue-800 dark:text-blue-300 space-y-1 text-sm">
                <li>Fill in the required parameters (marked with *)</li>
                <li>Review optional parameters for more accurate results</li>
                <li>Click "Calculate" to generate results</li>
                <li>Review recommendations and warnings</li>
                <li>Export results if needed</li>
              </ol>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                ✅ Best Practices
              </h4>
              <ul className="list-disc list-inside text-green-800 dark:text-green-300 space-y-1 text-sm">
                <li>Use the "Load Example" button to see typical values</li>
                <li>Pay attention to validation warnings</li>
                <li>Consider recommendations for optimal results</li>
                <li>Save or export important calculations</li>
                <li>Verify results with actual testing when possible</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'troubleshooting' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Troubleshooting Guide
            </h3>

            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  ❌ Validation Errors
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  If you see red error messages under input fields:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  <li>Check that all required fields are filled</li>
                  <li>Ensure values are within the specified ranges</li>
                  <li>Verify that numeric inputs contain only numbers</li>
                  <li>Make sure selected options are valid</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  ⚠️ Calculation Warnings
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  Yellow warning messages indicate:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  <li>Parameter combinations that may not be optimal</li>
                  <li>Results that are outside typical ranges</li>
                  <li>Conditions that require special attention</li>
                  <li>Recommendations for better results</li>
                </ul>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  🔧 Common Issues
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-900 dark:text-white">Export not working:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Ensure popup blockers are disabled and calculation is complete
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Slow calculations:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Complex calculations may take a few seconds, especially for optimization
                    </span>
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Unexpected results:</strong>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      Double-check input values and units, consider using example values
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                📞 Need More Help?
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                If you continue to experience issues, please contact our support team with:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-sm mt-2 space-y-1">
                <li>Calculator name and version</li>
                <li>Input values you're using</li>
                <li>Error messages or unexpected behavior</li>
                <li>Browser and device information</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

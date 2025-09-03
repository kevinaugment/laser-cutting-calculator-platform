/**
 * CalculatorLayout Component
 * Shared layout wrapper for all calculators with preset functionality
 */

import React, { ReactNode } from 'react';
import { useTheme } from '../../theme';
import { PresetManager } from '../presets';
import { PresetParameters } from '../../types/preset';

export interface CalculatorLayoutProps<T extends PresetParameters = PresetParameters> {
  children: ReactNode;
  calculatorType: string;
  currentParameters: T;
  onPresetLoad: (parameters: T) => void;
  onParametersChange: (parameters: T) => void;
  showPresets?: boolean;
  presetPosition?: 'top' | 'side' | 'bottom';
  className?: string;
}

export function CalculatorLayout<T extends PresetParameters = PresetParameters>({
  children,
  calculatorType,
  currentParameters,
  onPresetLoad,
  onParametersChange,
  showPresets = true,
  presetPosition = 'top',
  className = '',
}: CalculatorLayoutProps<T>) {
  const { theme } = useTheme();

  // Handle preset loading
  const handlePresetLoad = (preset: any) => {
    onPresetLoad(preset.parameters);
  };

  // Render preset manager based on position
  const renderPresetManager = () => {
    if (!showPresets) return null;

    return (
      <PresetManager
        calculatorType={calculatorType}
        currentParameters={currentParameters}
        onPresetLoad={handlePresetLoad}
        onParametersChange={onParametersChange}
        compact={presetPosition !== 'side'}
        showAdvanced={presetPosition === 'side'}
        className={getPresetManagerClassName()}
      />
    );
  };

  // Get CSS classes for preset manager based on position
  const getPresetManagerClassName = () => {
    switch (presetPosition) {
      case 'top':
        return 'mb-6';
      case 'bottom':
        return 'mt-6';
      case 'side':
        return 'h-full';
      default:
        return '';
    }
  };

  // Render layout based on preset position
  if (presetPosition === 'side') {
    return (
      <div className={`calculator-layout-side ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Main Calculator Content */}
          <div className="lg:col-span-3">
            <div 
              className="h-full rounded-lg border"
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                borderColor: 'var(--color-neutral-200)',
              }}
            >
              {children}
            </div>
          </div>

          {/* Preset Manager Sidebar */}
          <div className="lg:col-span-1">
            <div 
              className="h-full rounded-lg border"
              style={{
                backgroundColor: 'var(--color-neutral-50)',
                borderColor: 'var(--color-neutral-200)',
              }}
            >
              {renderPresetManager()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layout (top/bottom preset position)
  return (
    <div className={`calculator-layout ${className}`}>
      {presetPosition === 'top' && renderPresetManager()}
      
      <div 
        className="calculator-content"
        style={{
          backgroundColor: 'var(--color-neutral-50)',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--color-neutral-200)',
        }}
      >
        {children}
      </div>
      
      {presetPosition === 'bottom' && renderPresetManager()}
    </div>
  );
}

// Higher-order component for easy calculator wrapping
export function withPresets<T extends PresetParameters = PresetParameters>(
  CalculatorComponent: React.ComponentType<any>,
  calculatorType: string,
  options: {
    presetPosition?: 'top' | 'side' | 'bottom';
    showPresets?: boolean;
    parameterExtractor?: (props: any) => T;
    parameterInjector?: (props: any, parameters: T) => any;
  } = {}
) {
  const {
    presetPosition = 'top',
    showPresets = true,
    parameterExtractor = (props) => props.inputs || {},
    parameterInjector = (props, parameters) => ({ ...props, inputs: parameters }),
  } = options;

  return function WrappedCalculator(props: any) {
    const [currentParameters, setCurrentParameters] = React.useState<T>(
      parameterExtractor(props)
    );

    // Handle preset loading
    const handlePresetLoad = (parameters: T) => {
      setCurrentParameters(parameters);
      // If the calculator has an onInputChange callback, use it
      if (props.onInputChange) {
        Object.entries(parameters).forEach(([key, value]) => {
          props.onInputChange(key, value);
        });
      }
    };

    // Handle parameter changes
    const handleParametersChange = (parameters: T) => {
      setCurrentParameters(parameters);
    };

    // Update current parameters when props change
    React.useEffect(() => {
      const newParameters = parameterExtractor(props);
      setCurrentParameters(newParameters);
    }, [props]);

    return (
      <CalculatorLayout
        calculatorType={calculatorType}
        currentParameters={currentParameters}
        onPresetLoad={handlePresetLoad}
        onParametersChange={handleParametersChange}
        showPresets={showPresets}
        presetPosition={presetPosition}
      >
        <CalculatorComponent {...parameterInjector(props, currentParameters)} />
      </CalculatorLayout>
    );
  };
}

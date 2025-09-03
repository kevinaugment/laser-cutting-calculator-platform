/**
 * ProductionCapacityCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { ProductionCapacityPresetParameters } from '../../../types/preset';
import ProductionCapacityCalculator from './index';

const ProductionCapacityCalculatorWithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: ProductionCapacityPresetParameters = {
    {
    machineCount: 1,
    workingHours: 8,
    efficiency: 0.85,
    downtime: 0.1,
  }
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'production-capacity',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: ProductionCapacityPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="production-capacity"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <ProductionCapacityCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default ProductionCapacityCalculatorWithPresets;
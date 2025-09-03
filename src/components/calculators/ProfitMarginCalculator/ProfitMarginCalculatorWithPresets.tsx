/**
 * ProfitMarginCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { ProfitMarginCalculatorPresetParameters } from '../../../types/preset';
import ProfitMarginCalculator from './index';

const ProfitMarginCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: ProfitMarginCalculatorPresetParameters = {
    totalCost: 100,
    targetMargin: 0.3,
    marketPrice: 150,
    competitionLevel: 'medium',
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'profit-margin',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: ProfitMarginCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="profit-margin"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <ProfitMarginCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default ProfitMarginCalculatorWithPresets;
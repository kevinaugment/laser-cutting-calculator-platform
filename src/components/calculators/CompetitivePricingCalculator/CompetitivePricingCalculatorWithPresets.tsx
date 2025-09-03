/**
 * CompetitivePricingCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { CompetitivePricingCalculatorPresetParameters } from '../../../types/preset';
import CompetitivePricingCalculator from './index';

const CompetitivePricingCalculatorWithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: CompetitivePricingCalculatorPresetParameters = {
    baseCost: 100,
    margin: 0.3,
    competitorPrice: 150,
    marketFactor: 1.0,
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: 'competitive-pricing',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: CompetitivePricingCalculatorPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="competitive-pricing"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <CompetitivePricingCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default CompetitivePricingCalculatorWithPresets;
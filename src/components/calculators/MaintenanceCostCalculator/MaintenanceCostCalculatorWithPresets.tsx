/**
 * MaintenanceCostCalculator with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { MaintenanceCostPresetParameters } from '../../../types/preset';
import MaintenanceCostCalculator from './index';

const MaintenanceCostCalculatorWithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: MaintenanceCostPresetParameters = {
    {
    machineValue: 500000,
    operatingHours: 2000,
    maintenanceRate: 0.05,
    consumables: 1000,
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
    calculatorType: 'maintenance-cost',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: MaintenanceCostPresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="maintenance-cost"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <MaintenanceCostCalculator 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default MaintenanceCostCalculatorWithPresets;
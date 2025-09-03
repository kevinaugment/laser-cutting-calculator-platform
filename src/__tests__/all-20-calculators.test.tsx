/**
 * Comprehensive test suite for all 20 core calculators
 * Tests import capability and basic component structure
 * Based on CORE_CALCULATORS_API.md specification
 */

import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock i18n to avoid translation errors
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Mock i18n hooks
vi.mock('@/lib/i18n/hooks', () => ({
  useCalculatorTranslation: () => ({
    getCalculatorTitle: () => 'Test Calculator',
    getCalculatorDescription: () => 'Test Description'
  }),
  useLocaleFormatting: () => ({
    formatNumber: (num: number) => num.toString(),
    formatCurrency: (num: number) => `$${num}`
  })
}));

// 20 Core Calculators based on CORE_CALCULATORS_API.md
const coreCalculators = {
  // Epic 1: Core Engineering (5)
  epic1: [
    { id: 'laser-cutting-cost', name: 'Laser Cutting Cost Calculator' },
    { id: 'cutting-time-estimator', name: 'Cutting Time Estimator' },
    { id: 'laser-parameter-optimizer', name: 'Laser Parameter Optimizer' },
    { id: 'material-selection-assistant', name: 'Material Selection Assistant' },
    { id: 'gas-consumption-calculator', name: 'Gas Consumption Calculator' }
  ],
  // Epic 2: Quality Control (5)
  epic2: [
    { id: 'edge-quality-predictor', name: 'Edge Quality Predictor' },
    { id: 'warping-risk-calculator', name: 'Warping Risk Calculator' },
    { id: 'burn-mark-preventer', name: 'Burn Mark Preventer' },
    { id: 'dross-formation-calculator', name: 'Dross Formation Calculator' },
    { id: 'tolerance-stack-calculator', name: 'Tolerance Stack Calculator' }
  ],
  // Epic 3: Process Optimization (5)
  epic3: [
    { id: 'focus-height-calculator', name: 'Focus Height Calculator' },
    { id: 'gas-pressure-setting-guide', name: 'Gas Pressure Setting Guide' },
    { id: 'frequency-setting-assistant', name: 'Frequency Setting Assistant' },
    { id: 'multiple-pass-calculator', name: 'Multiple Pass Calculator' },
    { id: 'power-speed-matching', name: 'Power-Speed Matching' }
  ],
  // Epic 4: Advanced Analysis (5)
  epic4: [
    { id: 'sensitivity-analysis-calculator', name: 'Sensitivity Analysis Calculator' },
    { id: 'process-optimization-engine', name: 'Process Optimization Engine' },
    { id: 'predictive-quality-model', name: 'Predictive Quality Model' },
    { id: 'cost-benefit-analyzer', name: 'Cost-Benefit Analyzer' },
    { id: 'performance-benchmarking-tool', name: 'Performance Benchmarking Tool' }
  ]
};

describe('All 20 Core Calculators Import Tests', () => {
  describe('Epic 1: Core Engineering Calculators', () => {
    coreCalculators.epic1.forEach(calculator => {
      it(`should import ${calculator.name} (${calculator.id}) without errors`, async () => {
        let importPath = '';
        
        // Determine import path based on calculator structure
        if (calculator.id === 'laser-cutting-cost') {
          importPath = '@/components/calculators/LaserCuttingCostCalculator';
        } else if (calculator.id === 'gas-consumption-calculator') {
          importPath = '@/components/calculators/GasConsumptionCalculator';
        } else {
          importPath = `@/features/calculators/${calculator.id}`;
        }
        
        try {
          const CalculatorComponent = await import(importPath);
          expect(CalculatorComponent.default).toBeDefined();
          expect(typeof CalculatorComponent.default).toBe('function');
        } catch (error) {
          throw new Error(`Failed to import ${calculator.name}: ${error}`);
        }
      });
    });
  });

  describe('Epic 2: Quality Control Calculators', () => {
    coreCalculators.epic2.forEach(calculator => {
      it(`should import ${calculator.name} (${calculator.id}) without errors`, async () => {
        const importPath = `@/features/calculators/${calculator.id}`;
        
        try {
          const CalculatorComponent = await import(importPath);
          expect(CalculatorComponent.default).toBeDefined();
          expect(typeof CalculatorComponent.default).toBe('function');
        } catch (error) {
          throw new Error(`Failed to import ${calculator.name}: ${error}`);
        }
      });
    });
  });

  describe('Epic 3: Process Optimization Calculators', () => {
    coreCalculators.epic3.forEach(calculator => {
      it(`should import ${calculator.name} (${calculator.id}) without errors`, async () => {
        const importPath = `@/features/calculators/${calculator.id}`;
        
        try {
          const CalculatorComponent = await import(importPath);
          expect(CalculatorComponent.default).toBeDefined();
          expect(typeof CalculatorComponent.default).toBe('function');
        } catch (error) {
          throw new Error(`Failed to import ${calculator.name}: ${error}`);
        }
      });
    });
  });

  describe('Epic 4: Advanced Analysis Calculators', () => {
    coreCalculators.epic4.forEach(calculator => {
      it(`should import ${calculator.name} (${calculator.id}) without errors`, async () => {
        const importPath = `@/features/calculators/${calculator.id}`;
        
        try {
          const CalculatorComponent = await import(importPath);
          expect(CalculatorComponent.default).toBeDefined();
          expect(typeof CalculatorComponent.default).toBe('function');
        } catch (error) {
          throw new Error(`Failed to import ${calculator.name}: ${error}`);
        }
      });
    });
  });

  it('should have exactly 20 core calculators total', () => {
    const totalCalculators = 
      coreCalculators.epic1.length + 
      coreCalculators.epic2.length + 
      coreCalculators.epic3.length + 
      coreCalculators.epic4.length;
    
    expect(totalCalculators).toBe(20);
  });
});

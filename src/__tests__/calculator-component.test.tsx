/**
 * Test to verify calculator components can render without errors
 * This is a basic smoke test to identify Component Error issues
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('Calculator Component Smoke Tests', () => {
  it('should import cost-benefit-analyzer component without errors', async () => {
    // Test if we can import the component
    const CostBenefitAnalyzer = await import('@/features/calculators/cost-benefit-analyzer');
    expect(CostBenefitAnalyzer.default).toBeDefined();
  });

  it('should import laser-cutting-cost component without errors', async () => {
    // Test if we can import the component
    const LaserCuttingCost = await import('@/components/calculators/LaserCuttingCostCalculator');
    expect(LaserCuttingCost.default).toBeDefined();
  });

  it('should import cutting-time-estimator component without errors', async () => {
    // Test if we can import the component
    const CuttingTimeEstimator = await import('@/components/calculators/CuttingTimeEstimator');
    expect(CuttingTimeEstimator.default).toBeDefined();
  });

  it('should render a simple test component', () => {
    const TestComponent = () => <div data-testid="test">Test Component</div>;
    render(<TestComponent />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });
});

/**
 * Pricing System Tests
 * Tests for pricing configuration and feature gating
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PricingTier } from '../../types/billing';
import { 
  getPricingPlan, 
  getUsageLimits, 
  hasFeatureAccess, 
  hasCalculatorAccess,
  formatPrice,
  calculateYearlyDiscount,
  ALL_CALCULATORS,
  CALCULATOR_IDS
} from '../../config/pricing';
import { FeatureGate } from '../../components/billing/FeatureGate';
import PricingPage from '../../pages/PricingPage';

// Test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

describe('Pricing Configuration', () => {
  describe('Pricing Plans', () => {
    it('should have correct pricing plan structure', () => {
      const freePlan = getPricingPlan(PricingTier.FREE);
      const proPlan = getPricingPlan(PricingTier.PRO);
      const enterprisePlan = getPricingPlan(PricingTier.ENTERPRISE);

      // Free plan
      expect(freePlan.id).toBe(PricingTier.FREE);
      expect(freePlan.prices.monthly).toBe(0);
      expect(freePlan.prices.yearly).toBe(0);
      expect(freePlan.trialDays).toBe(0);

      // Pro plan
      expect(proPlan.id).toBe(PricingTier.PRO);
      expect(proPlan.prices.monthly).toBe(19);
      expect(proPlan.prices.yearly).toBe(182); // 20% discount
      expect(proPlan.trialDays).toBe(14);
      expect(proPlan.popular).toBe(true);

      // Enterprise plan
      expect(enterprisePlan.id).toBe(PricingTier.ENTERPRISE);
      expect(enterprisePlan.prices.monthly).toBe(99);
      expect(enterprisePlan.prices.yearly).toBe(950); // 20% discount
      expect(enterprisePlan.trialDays).toBe(14);
    });

    it('should have correct usage limits', () => {
      const freeLimits = getUsageLimits(PricingTier.FREE);
      const proLimits = getUsageLimits(PricingTier.PRO);
      const enterpriseLimits = getUsageLimits(PricingTier.ENTERPRISE);

      // Free tier limits
      expect(freeLimits.calculationsPerMonth).toBe(10);
      expect(freeLimits.exportsPerMonth).toBe(5);
      expect(freeLimits.calculatorAccess).toEqual(CALCULATOR_IDS.CORE);

      // Pro tier limits
      expect(proLimits.calculationsPerMonth).toBe('unlimited');
      expect(proLimits.exportsPerMonth).toBe('unlimited');
      expect(proLimits.calculatorAccess).toEqual(ALL_CALCULATORS);

      // Enterprise tier limits
      expect(enterpriseLimits.calculationsPerMonth).toBe('unlimited');
      expect(enterpriseLimits.apiCallsPerMonth).toBe('unlimited');
      expect(enterpriseLimits.calculatorAccess).toEqual(ALL_CALCULATORS);
    });
  });

  describe('Feature Access Control', () => {
    it('should correctly determine feature access by tier', () => {
      // Free tier should not have premium features
      expect(hasFeatureAccess(PricingTier.FREE, 'parameter_presets')).toBe(false);
      expect(hasFeatureAccess(PricingTier.FREE, 'calculation_history')).toBe(false);
      expect(hasFeatureAccess(PricingTier.FREE, 'team_collaboration')).toBe(false);

      // Pro tier should have pro features but not enterprise features
      expect(hasFeatureAccess(PricingTier.PRO, 'parameter_presets')).toBe(true);
      expect(hasFeatureAccess(PricingTier.PRO, 'calculation_history')).toBe(true);
      expect(hasFeatureAccess(PricingTier.PRO, 'team_collaboration')).toBe(false);
      expect(hasFeatureAccess(PricingTier.PRO, 'api_access')).toBe(false);

      // Enterprise tier should have all features
      expect(hasFeatureAccess(PricingTier.ENTERPRISE, 'parameter_presets')).toBe(true);
      expect(hasFeatureAccess(PricingTier.ENTERPRISE, 'team_collaboration')).toBe(true);
      expect(hasFeatureAccess(PricingTier.ENTERPRISE, 'api_access')).toBe(true);
      expect(hasFeatureAccess(PricingTier.ENTERPRISE, 'sso_integration')).toBe(true);
    });

    it('should correctly determine calculator access by tier', () => {
      // Free tier should only have core calculators
      expect(hasCalculatorAccess(PricingTier.FREE, 'laser-cutting-cost')).toBe(true);
      expect(hasCalculatorAccess(PricingTier.FREE, 'cutting-time-estimator')).toBe(true);
      expect(hasCalculatorAccess(PricingTier.FREE, 'edge-quality-predictor')).toBe(false);

      // Pro and Enterprise should have all calculators
      expect(hasCalculatorAccess(PricingTier.PRO, 'edge-quality-predictor')).toBe(true);
      expect(hasCalculatorAccess(PricingTier.ENTERPRISE, 'edge-quality-predictor')).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('should format prices correctly', () => {
      expect(formatPrice(0)).toBe('$0');
      expect(formatPrice(19)).toBe('$19');
      expect(formatPrice(99)).toBe('$99');
      expect(formatPrice(182)).toBe('$182');
    });

    it('should calculate yearly discount correctly', () => {
      const monthlyPrice = 19;
      const yearlyDiscount = calculateYearlyDiscount(monthlyPrice);
      const expectedSavings = (monthlyPrice * 12) - (monthlyPrice * 12 * 0.8);
      
      expect(yearlyDiscount).toBe(Math.round(expectedSavings));
    });
  });

  describe('Calculator Categories', () => {
    it('should have correct calculator counts', () => {
      expect(CALCULATOR_IDS.CORE).toHaveLength(5);
      expect(CALCULATOR_IDS.QUALITY).toHaveLength(7);
      expect(CALCULATOR_IDS.PROCESS).toHaveLength(8);
      expect(CALCULATOR_IDS.ADVANCED).toHaveLength(7);
      expect(ALL_CALCULATORS).toHaveLength(27);
    });

    it('should have no duplicate calculator IDs', () => {
      const allIds = ALL_CALCULATORS;
      const uniqueIds = [...new Set(allIds)];
      expect(allIds).toHaveLength(uniqueIds.length);
    });
  });
});

describe('FeatureGate Component', () => {
  it('should render children when user has access', () => {
    render(
      <TestWrapper>
        <FeatureGate feature="basic_feature" userTier={PricingTier.PRO}>
          <div data-testid="protected-content">Protected Content</div>
        </FeatureGate>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should show upgrade prompt when user lacks access', () => {
    render(
      <TestWrapper>
        <FeatureGate feature="parameter_presets" userTier={PricingTier.FREE}>
          <div data-testid="protected-content">Protected Content</div>
        </FeatureGate>
      </TestWrapper>
    );

    expect(screen.getByText('Premium Feature')).toBeInTheDocument();
    expect(screen.getByText(/Upgrade to Professional/)).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    render(
      <TestWrapper>
        <FeatureGate 
          feature="parameter_presets" 
          userTier={PricingTier.FREE}
          fallback={<div data-testid="custom-fallback">Custom Fallback</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </FeatureGate>
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Premium Feature')).not.toBeInTheDocument();
  });
});

describe('PricingPage Component', () => {
  it('should render pricing page without errors', () => {
    render(
      <TestWrapper>
        <PricingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Choose Your Perfect Plan')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('should display correct pricing information', () => {
    render(
      <TestWrapper>
        <PricingPage />
      </TestWrapper>
    );

    // Check for pricing display
    expect(screen.getByText('$0')).toBeInTheDocument(); // Free tier
    expect(screen.getByText('$19')).toBeInTheDocument(); // Pro monthly
    expect(screen.getByText('$99')).toBeInTheDocument(); // Enterprise monthly
  });

  it('should show feature comparison table', () => {
    render(
      <TestWrapper>
        <PricingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Feature Comparison')).toBeInTheDocument();
    expect(screen.getByText('Core Calculators')).toBeInTheDocument();
    expect(screen.getByText('Monthly Calculations')).toBeInTheDocument();
    expect(screen.getByText('Export Formats')).toBeInTheDocument();
  });

  it('should display FAQ section', () => {
    render(
      <TestWrapper>
        <PricingPage />
      </TestWrapper>
    );

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('Can I change plans anytime?')).toBeInTheDocument();
    expect(screen.getByText('Is there a free trial?')).toBeInTheDocument();
  });
});

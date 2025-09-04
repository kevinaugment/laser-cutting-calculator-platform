/**
 * Onboarding System Tests
 * Tests for the complete onboarding system
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  OnboardingProvider,
  useOnboarding,
  welcomeTour,
  allTours
} from '../../components/onboarding';

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider tours={allTours} autoStart={false}>
      {children}
    </OnboardingProvider>
  );
}

// Test component that uses onboarding
function TestOnboardingComponent() {
  const { state, actions, currentTourData, currentStepData } = useOnboarding();
  
  return (
    <div>
      <div data-testid="onboarding-state">
        {JSON.stringify({
          isActive: state.isActive,
          currentTour: state.currentTour,
          currentStep: state.currentStep,
          completedTours: state.completedTours,
        })}
      </div>
      
      <button 
        data-testid="start-welcome-tour" 
        onClick={() => actions.startTour('welcome')}
      >
        Start Welcome Tour
      </button>
      
      <button 
        data-testid="next-step" 
        onClick={actions.nextStep}
      >
        Next Step
      </button>
      
      <button 
        data-testid="skip-tour" 
        onClick={actions.skipTour}
      >
        Skip Tour
      </button>
      
      {currentTourData && (
        <div data-testid="current-tour-info">
          Tour: {currentTourData.name}
        </div>
      )}
      
      {currentStepData && (
        <div data-testid="current-step-info">
          Step: {currentStepData.title}
        </div>
      )}
    </div>
  );
}

describe('Onboarding System', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Mock console methods
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('OnboardingProvider', () => {
    it('should provide initial state correctly', () => {
      render(
        <TestWrapper>
          <TestOnboardingComponent />
        </TestWrapper>
      );

      const stateElement = screen.getByTestId('onboarding-state');
      const state = JSON.parse(stateElement.textContent || '{}');

      expect(state.isActive).toBe(false);
      expect(state.currentTour).toBe(null);
      expect(state.currentStep).toBe(0);
      expect(state.completedTours).toEqual([]);
    });

    it('should start a tour when requested', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TestOnboardingComponent />
        </TestWrapper>
      );

      const startButton = screen.getByTestId('start-welcome-tour');
      await user.click(startButton);

      await waitFor(() => {
        const stateElement = screen.getByTestId('onboarding-state');
        const state = JSON.parse(stateElement.textContent || '{}');
        
        expect(state.isActive).toBe(true);
        expect(state.currentTour).toBe('welcome');
        expect(state.currentStep).toBe(0);
      });

      expect(screen.getByTestId('current-tour-info')).toHaveTextContent('Tour: Welcome Tour');
      expect(screen.getByTestId('current-step-info')).toHaveTextContent('Step: Welcome to Laser Cutting Calculator!');
    });

    it('should advance to next step', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TestOnboardingComponent />
        </TestWrapper>
      );

      // Start tour
      await user.click(screen.getByTestId('start-welcome-tour'));
      
      // Go to next step
      await user.click(screen.getByTestId('next-step'));

      await waitFor(() => {
        const stateElement = screen.getByTestId('onboarding-state');
        const state = JSON.parse(stateElement.textContent || '{}');
        
        expect(state.currentStep).toBe(1);
      });
    });

    it('should skip tour when requested', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TestOnboardingComponent />
        </TestWrapper>
      );

      // Start tour
      await user.click(screen.getByTestId('start-welcome-tour'));
      
      // Skip tour
      await user.click(screen.getByTestId('skip-tour'));

      await waitFor(() => {
        const stateElement = screen.getByTestId('onboarding-state');
        const state = JSON.parse(stateElement.textContent || '{}');
        
        expect(state.isActive).toBe(false);
        expect(state.currentTour).toBe(null);
      });
    });

    it('should persist state to localStorage', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <TestOnboardingComponent />
        </TestWrapper>
      );

      await user.click(screen.getByTestId('start-welcome-tour'));

      await waitFor(() => {
        const savedState = localStorage.getItem('laser-calc-onboarding-state');
        expect(savedState).toBeTruthy();
        
        const parsedState = JSON.parse(savedState || '{}');
        expect(parsedState.currentTour).toBe('welcome');
      });
    });
  });

  // Note: UI component tests are skipped for now due to MUI dependency complexity
  // The core OnboardingProvider functionality is tested above

  describe('Integration Tests', () => {
    it('should handle tour completion flow', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <TestOnboardingComponent />
        </TestWrapper>
      );

      // Start tour
      await user.click(screen.getByTestId('start-welcome-tour'));

      // Complete all steps programmatically
      const totalSteps = welcomeTour.steps.length;
      for (let i = 0; i < totalSteps; i++) {
        await user.click(screen.getByTestId('next-step'));
        await waitFor(() => {
          // Wait for state to update
        });
      }

      // Tour should be completed
      await waitFor(() => {
        const stateElement = screen.getByTestId('onboarding-state');
        const state = JSON.parse(stateElement.textContent || '{}');

        expect(state.isActive).toBe(false);
        expect(state.completedTours).toContain('welcome');
      });
    });
  });
});

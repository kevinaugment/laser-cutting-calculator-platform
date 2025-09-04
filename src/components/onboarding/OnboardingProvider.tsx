/**
 * Onboarding Provider
 * React Context provider for user onboarding system
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Onboarding step definition
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll' | 'wait';
  duration?: number; // Auto-advance after duration (ms)
  skippable?: boolean;
  required?: boolean;
}

// Onboarding tour definition
export interface OnboardingTour {
  id: string;
  name: string;
  description: string;
  steps: OnboardingStep[];
  category?: 'welcome' | 'calculator' | 'feature' | 'advanced';
  priority?: number;
  prerequisites?: string[]; // Other tour IDs that should be completed first
}

// Onboarding state
export interface OnboardingState {
  isActive: boolean;
  currentTour: string | null;
  currentStep: number;
  completedTours: string[];
  skippedTours: string[];
  userPreferences: {
    showOnboarding: boolean;
    autoAdvance: boolean;
    showHints: boolean;
    tourSpeed: 'slow' | 'normal' | 'fast';
  };
  analytics: {
    startTime: number | null;
    completionRate: number;
    dropOffStep: number | null;
  };
}

// Onboarding actions
export interface OnboardingActions {
  startTour: (tourId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  resetTour: (tourId: string) => void;
  resetAllTours: () => void;
  updatePreferences: (preferences: Partial<OnboardingState['userPreferences']>) => void;
  setShowOnboarding: (show: boolean) => void;
}

// Context type
export interface OnboardingContextType {
  state: OnboardingState;
  actions: OnboardingActions;
  tours: OnboardingTour[];
  currentTourData: OnboardingTour | null;
  currentStepData: OnboardingStep | null;
}

// Default state
const defaultState: OnboardingState = {
  isActive: false,
  currentTour: null,
  currentStep: 0,
  completedTours: [],
  skippedTours: [],
  userPreferences: {
    showOnboarding: true,
    autoAdvance: false,
    showHints: true,
    tourSpeed: 'normal',
  },
  analytics: {
    startTime: null,
    completionRate: 0,
    dropOffStep: null,
  },
};

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider props
interface OnboardingProviderProps {
  children: ReactNode;
  tours?: OnboardingTour[];
  autoStart?: boolean;
  persistState?: boolean;
}

// Storage key for persistence
const STORAGE_KEY = 'laser-calc-onboarding-state';

export function OnboardingProvider({ 
  children, 
  tours = [], 
  autoStart = true,
  persistState = true 
}: OnboardingProviderProps) {
  // Initialize state from localStorage if persistence is enabled
  const [state, setState] = useState<OnboardingState>(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedState = JSON.parse(saved);
          return { ...defaultState, ...parsedState };
        }
      } catch (error) {
        console.warn('Failed to load onboarding state from localStorage:', error);
      }
    }
    return defaultState;
  });

  // Persist state to localStorage
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn('Failed to save onboarding state to localStorage:', error);
      }
    }
  }, [state, persistState]);

  // Get current tour data
  const currentTourData = state.currentTour 
    ? tours.find(tour => tour.id === state.currentTour) || null
    : null;

  // Get current step data
  const currentStepData = currentTourData && currentTourData.steps[state.currentStep] 
    ? currentTourData.steps[state.currentStep]
    : null;

  // Actions
  const startTour = useCallback((tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) {
      console.warn(`Tour with id "${tourId}" not found`);
      return;
    }

    // Check prerequisites
    if (tour.prerequisites) {
      const unmetPrerequisites = tour.prerequisites.filter(
        prereq => !state.completedTours.includes(prereq)
      );
      if (unmetPrerequisites.length > 0) {
        console.warn(`Prerequisites not met for tour "${tourId}":`, unmetPrerequisites);
        return;
      }
    }

    setState(prev => ({
      ...prev,
      isActive: true,
      currentTour: tourId,
      currentStep: 0,
      analytics: {
        ...prev.analytics,
        startTime: Date.now(),
        dropOffStep: null,
      },
    }));
  }, [tours, state.completedTours]);

  const nextStep = useCallback(() => {
    if (!currentTourData) return;

    const nextStepIndex = state.currentStep + 1;
    if (nextStepIndex >= currentTourData.steps.length) {
      // Tour completed
      completeTour();
    } else {
      setState(prev => ({
        ...prev,
        currentStep: nextStepIndex,
      }));
    }
  }, [currentTourData, state.currentStep]);

  const previousStep = useCallback(() => {
    if (state.currentStep > 0) {
      setState(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
    }
  }, [state.currentStep]);

  const skipStep = useCallback(() => {
    if (currentStepData?.skippable !== false) {
      nextStep();
    }
  }, [currentStepData, nextStep]);

  const skipTour = useCallback(() => {
    if (!state.currentTour) return;

    setState(prev => ({
      ...prev,
      isActive: false,
      currentTour: null,
      currentStep: 0,
      skippedTours: [...prev.skippedTours, state.currentTour!],
      analytics: {
        ...prev.analytics,
        dropOffStep: prev.currentStep,
      },
    }));
  }, [state.currentTour, state.currentStep]);

  const completeTour = useCallback(() => {
    if (!state.currentTour) return;

    const completionRate = currentTourData 
      ? ((state.currentStep + 1) / currentTourData.steps.length) * 100
      : 0;

    setState(prev => ({
      ...prev,
      isActive: false,
      currentTour: null,
      currentStep: 0,
      completedTours: [...prev.completedTours, state.currentTour!],
      analytics: {
        ...prev.analytics,
        completionRate,
      },
    }));
  }, [state.currentTour, currentTourData, state.currentStep]);

  const resetTour = useCallback((tourId: string) => {
    setState(prev => ({
      ...prev,
      completedTours: prev.completedTours.filter(id => id !== tourId),
      skippedTours: prev.skippedTours.filter(id => id !== tourId),
    }));
  }, []);

  const resetAllTours = useCallback(() => {
    setState(prev => ({
      ...prev,
      completedTours: [],
      skippedTours: [],
      isActive: false,
      currentTour: null,
      currentStep: 0,
    }));
  }, []);

  const updatePreferences = useCallback((preferences: Partial<OnboardingState['userPreferences']>) => {
    setState(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        ...preferences,
      },
    }));
  }, []);

  const setShowOnboarding = useCallback((show: boolean) => {
    updatePreferences({ showOnboarding: show });
  }, [updatePreferences]);

  // Auto-start welcome tour for new users
  useEffect(() => {
    if (autoStart && 
        state.userPreferences.showOnboarding && 
        state.completedTours.length === 0 && 
        state.skippedTours.length === 0 &&
        !state.isActive &&
        tours.length > 0) {
      
      // Find welcome tour or first tour
      const welcomeTour = tours.find(tour => tour.category === 'welcome') || tours[0];
      if (welcomeTour) {
        // Delay to allow page to load
        setTimeout(() => startTour(welcomeTour.id), 1000);
      }
    }
  }, [autoStart, state, tours, startTour]);

  // Context value
  const contextValue: OnboardingContextType = {
    state,
    actions: {
      startTour,
      nextStep,
      previousStep,
      skipStep,
      skipTour,
      completeTour,
      resetTour,
      resetAllTours,
      updatePreferences,
      setShowOnboarding,
    },
    tours,
    currentTourData,
    currentStepData,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook to use onboarding context
export function useOnboarding(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// Utility hook for checking if a tour is completed
export function useTourCompleted(tourId: string): boolean {
  const { state } = useOnboarding();
  return state.completedTours.includes(tourId);
}

// Utility hook for checking if onboarding should be shown
export function useShouldShowOnboarding(): boolean {
  const { state } = useOnboarding();
  return state.userPreferences.showOnboarding && 
         state.completedTours.length === 0 && 
         state.skippedTours.length === 0;
}

/**
 * Onboarding Components Export
 * Unified export for all onboarding-related components
 */

// Core onboarding components
export { OnboardingProvider, useOnboarding, useTourCompleted, useShouldShowOnboarding } from './OnboardingProvider';
export { GuidedTour } from './GuidedTour';
export { WelcomeOverlay } from './WelcomeOverlay';
export { HelpCenter } from './HelpCenter';
export { FeedbackWidget } from './FeedbackWidget';

// Tour configuration
export { 
  allTours, 
  welcomeTour, 
  costCategoryTour, 
  firstCalculatorTour, 
  advancedFeaturesTour, 
  mobileTour,
  getTourById,
  getToursByCategory,
  getNextRecommendedTour
} from './tourConfig';

// Types
export type { 
  OnboardingStep, 
  OnboardingTour, 
  OnboardingState, 
  OnboardingActions, 
  OnboardingContextType 
} from './OnboardingProvider';

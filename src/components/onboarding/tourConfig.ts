/**
 * Tour Configuration
 * Defines all onboarding tours and their steps
 */

import { OnboardingTour } from './OnboardingProvider';

// Welcome tour for new users
export const welcomeTour: OnboardingTour = {
  id: 'welcome',
  name: 'Welcome Tour',
  description: 'Get started with the Laser Cutting Calculator platform',
  category: 'welcome',
  priority: 1,
  steps: [
    {
      id: 'welcome-intro',
      title: 'Welcome to Laser Cutting Calculator!',
      description: 'This quick tour will show you the key features of our platform. You can navigate using the arrow keys or buttons.',
      position: 'center',
      skippable: true,
    },
    {
      id: 'navigation-header',
      title: 'Main Navigation',
      description: 'Use the header navigation to access different sections of the platform. The logo always takes you back to the home page.',
      target: 'header nav, .MuiAppBar-root, [role="banner"]',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'calculator-categories',
      title: 'Calculator Categories',
      description: 'Our 27 calculators are organized into 4 main categories. Each category focuses on a specific aspect of laser cutting operations.',
      target: '.calculator-categories, .category-grid, [data-testid="category-grid"]',
      position: 'top',
      skippable: true,
    },
    {
      id: 'cost-category',
      title: 'Cost & Pricing Analysis',
      description: 'Start here for cost calculations, pricing analysis, and financial planning. Includes 6 specialized calculators for comprehensive cost management.',
      target: '[data-category="cost"], .cost-hub-card, [href*="cost"]',
      position: 'right',
      skippable: true,
    },
    {
      id: 'time-category',
      title: 'Time & Efficiency Optimization',
      description: 'Optimize your production workflow with time estimation, capacity planning, and efficiency calculators.',
      target: '[data-category="time"], .time-hub-card, [href*="time"]',
      position: 'left',
      skippable: true,
    },
    {
      id: 'search-feature',
      title: 'Quick Search',
      description: 'Use the search bar to quickly find any calculator. Try typing "cost" or "time" to see suggestions.',
      target: '[data-testid="search-input"], .search-bar, input[placeholder*="search"]',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'help-center',
      title: 'Help & Support',
      description: 'Access comprehensive help documentation, tutorials, and support resources anytime you need assistance.',
      target: '[data-testid="help-button"], .help-button, [aria-label*="help"]',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'welcome-complete',
      title: 'You\'re Ready to Go!',
      description: 'That\'s the basics! Click on any calculator category to start exploring. You can always access help or restart this tour from the menu.',
      position: 'center',
      skippable: false,
    },
  ],
};

// Cost calculator category tour
export const costCategoryTour: OnboardingTour = {
  id: 'cost-category',
  name: 'Cost & Pricing Calculators',
  description: 'Learn about cost analysis and pricing calculators',
  category: 'calculator',
  priority: 2,
  prerequisites: ['welcome'],
  steps: [
    {
      id: 'cost-intro',
      title: 'Cost & Pricing Analysis',
      description: 'These 6 calculators help you analyze costs, set competitive prices, and maximize profitability.',
      position: 'center',
      skippable: true,
    },
    {
      id: 'laser-cutting-cost',
      title: 'Laser Cutting Cost Calculator',
      description: 'The most comprehensive cost calculator. Input material, labor, and overhead costs to get detailed breakdowns.',
      target: '[data-calculator="laser-cutting-cost"], .calculator-card[data-id*="cost"]',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'competitive-pricing',
      title: 'Competitive Pricing Analyzer',
      description: 'Analyze market positioning and set competitive prices based on industry benchmarks.',
      target: '[data-calculator="competitive-pricing"], .calculator-card[data-id*="pricing"]',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'cost-features',
      title: 'Key Features',
      description: 'All cost calculators include: detailed breakdowns, sensitivity analysis, export options, and saving capabilities.',
      position: 'center',
      skippable: true,
    },
  ],
};

// First calculator usage tour
export const firstCalculatorTour: OnboardingTour = {
  id: 'first-calculator',
  name: 'Using Your First Calculator',
  description: 'Learn how to use calculators effectively',
  category: 'feature',
  priority: 3,
  steps: [
    {
      id: 'calculator-interface',
      title: 'Calculator Interface',
      description: 'Each calculator has a clean, intuitive interface with input fields on the left and results on the right.',
      target: '.calculator-container, .calculator-layout',
      position: 'top',
      skippable: true,
    },
    {
      id: 'input-parameters',
      title: 'Input Parameters',
      description: 'Fill in the required parameters. Hover over field labels for helpful tooltips and explanations.',
      target: '.input-section, .parameter-inputs, [data-testid="input-section"]',
      position: 'right',
      skippable: true,
    },
    {
      id: 'unit-conversion',
      title: 'Unit Conversion',
      description: 'Switch between metric and imperial units using the unit selector. All calculations update automatically.',
      target: '.unit-selector, [data-testid="unit-selector"]',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'calculate-button',
      title: 'Calculate Results',
      description: 'Click Calculate to run the calculation. Results appear instantly with detailed breakdowns.',
      target: '.calculate-button, [data-testid="calculate-button"]',
      position: 'top',
      skippable: true,
    },
    {
      id: 'results-section',
      title: 'Results & Analysis',
      description: 'View detailed results, charts, and recommendations. Use the tabs to explore different aspects of the analysis.',
      target: '.results-section, [data-testid="results-section"]',
      position: 'left',
      skippable: true,
    },
    {
      id: 'export-save',
      title: 'Export & Save',
      description: 'Export results to PDF, Excel, or CSV. Save calculations to your history for future reference.',
      target: '.export-buttons, [data-testid="export-section"]',
      position: 'top',
      skippable: true,
    },
  ],
};

// Advanced features tour
export const advancedFeaturesTour: OnboardingTour = {
  id: 'advanced-features',
  name: 'Advanced Features',
  description: 'Discover advanced platform features',
  category: 'advanced',
  priority: 4,
  prerequisites: ['welcome', 'first-calculator'],
  steps: [
    {
      id: 'calculation-history',
      title: 'Calculation History',
      description: 'Access all your saved calculations, search through them, and organize by project or date.',
      target: '[data-testid="history-button"], .history-section',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'parameter-presets',
      title: 'Parameter Presets',
      description: 'Save frequently used parameter combinations as presets for quick access in future calculations.',
      target: '[data-testid="presets-button"], .presets-section',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'comparison-mode',
      title: 'Comparison Mode',
      description: 'Compare multiple calculation scenarios side-by-side to make informed decisions.',
      target: '[data-testid="compare-button"], .comparison-mode',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'optimization-suggestions',
      title: 'AI Optimization',
      description: 'Get intelligent suggestions for parameter optimization based on your calculation history and industry best practices.',
      target: '.optimization-panel, [data-testid="optimization-suggestions"]',
      position: 'left',
      skippable: true,
    },
  ],
};

// Mobile-specific tour
export const mobileTour: OnboardingTour = {
  id: 'mobile-tour',
  name: 'Mobile Experience',
  description: 'Learn about mobile-specific features',
  category: 'feature',
  priority: 5,
  steps: [
    {
      id: 'mobile-navigation',
      title: 'Mobile Navigation',
      description: 'Use the hamburger menu to access all features. The interface adapts perfectly to your mobile device.',
      target: '.mobile-menu-button, [data-testid="mobile-menu"]',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'touch-interactions',
      title: 'Touch Interactions',
      description: 'Tap, swipe, and pinch to interact with charts and results. All features are optimized for touch.',
      position: 'center',
      skippable: true,
    },
    {
      id: 'offline-mode',
      title: 'Offline Mode',
      description: 'The app works offline! Your calculations and data are saved locally and sync when you\'re back online.',
      position: 'center',
      skippable: true,
    },
  ],
};

// Export all tours
export const allTours: OnboardingTour[] = [
  welcomeTour,
  costCategoryTour,
  firstCalculatorTour,
  advancedFeaturesTour,
  mobileTour,
];

// Helper function to get tour by ID
export function getTourById(tourId: string): OnboardingTour | undefined {
  return allTours.find(tour => tour.id === tourId);
}

// Helper function to get tours by category
export function getToursByCategory(category: OnboardingTour['category']): OnboardingTour[] {
  return allTours.filter(tour => tour.category === category);
}

// Helper function to get next recommended tour
export function getNextRecommendedTour(completedTours: string[]): OnboardingTour | null {
  // Find tours that haven't been completed and have met prerequisites
  const availableTours = allTours.filter(tour => {
    if (completedTours.includes(tour.id)) return false;
    
    if (tour.prerequisites) {
      return tour.prerequisites.every(prereq => completedTours.includes(prereq));
    }
    
    return true;
  });

  // Sort by priority and return the first one
  availableTours.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  return availableTours[0] || null;
}

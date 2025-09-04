import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './theme';
import { OnboardingProvider, GuidedTour, WelcomeOverlay, FeedbackWidget, allTours } from './components/onboarding';
import AppRouter from './router/AppRouter';

function App() {
  console.log('🚀 Laser Cutting Calculator Platform - Full Version with 27 Core Calculators');

  return (
    <HelmetProvider>
      <ThemeProvider>
        <OnboardingProvider tours={allTours} autoStart={true} persistState={true}>
          <AppRouter />
          <GuidedTour />
          <WelcomeOverlay />
          <FeedbackWidget />
        </OnboardingProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

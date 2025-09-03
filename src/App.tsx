import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './theme';
import AppRouter from './router/AppRouter';

function App() {
  console.log('🚀 Laser Cutting Calculator Platform - Full Version with 27 Core Calculators');

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

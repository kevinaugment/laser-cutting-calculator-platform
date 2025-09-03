import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './router/AppRouter';

function App() {
  console.log('🚀 Laser Cutting Calculator Platform - Full Version with 27 Core Calculators');

  return (
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
  );
}

export default App;

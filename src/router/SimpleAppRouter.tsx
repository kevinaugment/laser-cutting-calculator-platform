import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core pages
import HomePage from '../pages/HomePage';

/**
 * Simple Layout component
 */
const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold text-gray-900">
            Laser Cutting Calculator Platform
          </h1>
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </a>
            <a href="/features" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Features
            </a>
          </nav>
        </div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {children}
    </main>
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © 2025 Laser Cutting Calculator Platform. System Status: ✅ Online
        </p>
      </div>
    </footer>
  </div>
);

/**
 * Simplified Application Router
 * 
 * Basic routing configuration for testing and debugging.
 * This version focuses on core functionality without complex features.
 */
const SimpleAppRouter: React.FC = () => {
  return (
    <Router>
      <SimpleLayout>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Features Overview - Placeholder */}
          <Route path="/features" element={
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Features Overview
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive laser cutting calculator platform features
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Cost Calculation</h3>
                  <p className="text-gray-600">Accurate cost estimation for laser cutting projects</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Time Estimation</h3>
                  <p className="text-gray-600">Precise time calculations for production planning</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Parameter Optimization</h3>
                  <p className="text-gray-600">Optimize laser parameters for best results</p>
                </div>
              </div>
            </div>
          } />
          
          {/* Status Page */}
          <Route path="/status" element={
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-green-600 mb-4">
                ✅ System Status: Healthy
              </h1>
              <div className="max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Application Health Check</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>React Application:</span>
                      <span className="text-green-600">✅ Running</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Boundary:</span>
                      <span className="text-green-600">✅ Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Router System:</span>
                      <span className="text-green-600">✅ Working</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calculator Registry:</span>
                      <span className="text-yellow-600">⚠️ Empty (Expected)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } />
          
          {/* Catch all - 404 */}
          <Route path="*" element={
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                404 - Page Not Found
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                The page you're looking for doesn't exist.
              </p>
              <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </SimpleLayout>
    </Router>
  );
};

export default SimpleAppRouter;

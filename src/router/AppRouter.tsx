import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Critical pages - loaded immediately
import HomePage from '../pages/HomePage';

// Non-critical pages - lazy loaded
const FeaturesPage = lazy(() => import('../pages/FeaturesPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const LearnPage = lazy(() => import('../pages/LearnPage'));
const HubPage = lazy(() => import('../pages/HubPage'));
const EpicHubPage = lazy(() => import('../pages/EpicHubPage'));
const CalculatorsPage = lazy(() => import('../pages/CalculatorsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const HealthCheckPage = lazy(() => import('../pages/HealthCheckPage'));
import { preloadCoreCalculators, createLazyCalculatorRoutes } from './LazyCalculatorRoutes';

// Page loading fallback component
const PageLoadingFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoadingSpinner
      size="lg"
      text="Loading page..."
      className="text-blue-600"
    />
  </div>
);

const AppRouter: React.FC = () => {
  // 预加载核心计算器组件
  useEffect(() => {
    // 延迟预加载，避免影响首页加载
    const timer = setTimeout(() => {
      preloadCoreCalculators();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />

          {/* Features Page - Lazy Loaded */}
          <Route path="/features" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <FeaturesPage />
            </Suspense>
          } />

          {/* Pricing Page - Lazy Loaded */}
          <Route path="/pricing" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <PricingPage />
            </Suspense>
          } />

          {/* Blog Page - Lazy Loaded */}
          <Route path="/blog" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <BlogPage />
            </Suspense>
          } />

          {/* All Calculators Page - Lazy Loaded */}
          <Route path="/calculators" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <CalculatorsPage />
            </Suspense>
          } />

          {/* Contact Page - Lazy Loaded */}
          <Route path="/contact" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <ContactPage />
            </Suspense>
          } />

          {/* Health Check Page - Lazy Loaded */}
          <Route path="/health" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <HealthCheckPage />
            </Suspense>
          } />

          {/* Calculator Pages - Lazy Loaded */}
          {createLazyCalculatorRoutes()}
          
          {/* Epic Hub Pages - Lazy Loaded */}
          <Route path="/epic/:epicId" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <EpicHubPage />
            </Suspense>
          } />

          {/* Legacy Hub Pages - Lazy Loaded */}
          <Route path="/hub/cost-pricing" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <HubPage hubType="cost-pricing" />
            </Suspense>
          } />
          <Route path="/hub/time-efficiency" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <HubPage hubType="time-efficiency" />
            </Suspense>
          } />
          <Route path="/hub/parameters-settings" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <HubPage hubType="parameters-settings" />
            </Suspense>
          } />
          <Route path="/hub/quality-optimization" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <HubPage hubType="quality-optimization" />
            </Suspense>
          } />
          <Route path="/hub/business-roi" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <HubPage hubType="business-roi" />
            </Suspense>
          } />

          {/* Learn Pages - Lazy Loaded */}
          <Route path="/learn/:calculatorId" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <LearnPage />
            </Suspense>
          } />

          {/* 404 Page - Lazy Loaded */}
          <Route path="*" element={
            <Suspense fallback={<PageLoadingFallback />}>
              <NotFoundPage />
            </Suspense>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;

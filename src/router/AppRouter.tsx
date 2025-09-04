import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import FeaturesPage from '../pages/FeaturesPage';
import LearnPage from '../pages/LearnPage';
import HubPage from '../pages/HubPage';
import EpicHubPage from '../pages/EpicHubPage';
import CalculatorsPage from '../pages/CalculatorsPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';
import HealthCheck from '../components/HealthCheck';
import { preloadCoreCalculators, createLazyCalculatorRoutes } from './LazyCalculatorRoutes';

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

          {/* Features Page */}
          <Route path="/features" element={<FeaturesPage />} />

          {/* All Calculators Page */}
          <Route path="/calculators" element={<CalculatorsPage />} />

          {/* Contact Page */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Health Check Page */}
          <Route path="/health" element={<HealthCheck />} />

          {/* Calculator Pages - Lazy Loaded */}
          {createLazyCalculatorRoutes()}
          
          {/* Epic Hub Pages - 20 Core Calculators */}
          <Route path="/epic/:epicId" element={<EpicHubPage />} />

          {/* Legacy Hub Pages */}
          <Route path="/hub/cost-pricing" element={<HubPage hubType="cost-pricing" />} />
          <Route path="/hub/time-efficiency" element={<HubPage hubType="time-efficiency" />} />
          <Route path="/hub/parameters-settings" element={<HubPage hubType="parameters-settings" />} />
          <Route path="/hub/quality-optimization" element={<HubPage hubType="quality-optimization" />} />
          <Route path="/hub/business-roi" element={<HubPage hubType="business-roi" />} />

          {/* Learn Pages */}
          <Route path="/learn/:calculatorId" element={<LearnPage />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Calculator,
  DollarSign,
  Clock,
  Settings,
  Layers,
  ChevronRight,
  Zap,
  Wrench,
  Shield,
  Globe,
  FileText,
  BarChart3,
  Users,
  Lock,
  Database,
  Activity,
  Wind,
  Target,
  AlertTriangle,
  Droplets,
  Ruler,
  Focus,
  Gauge,
  Radio,
  Repeat,
  Cpu,
  Brain,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

// Language options - English only website
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
];

// Navigation configuration - 20 Core Calculators organized by Epic
const navigationConfig = {
  calculators: [
    // Epic 1: Core Engineering Calculators (5个)
    { id: 'laser-cutting-cost', name: 'Cost Calculator', path: '/calculator/laser-cutting-cost', icon: 'DollarSign', description: 'Calculate cutting costs', category: 'Core Engineering' },
    { id: 'cutting-time-estimator', name: 'Time Estimator', path: '/calculator/cutting-time-estimator', icon: 'Clock', description: 'Estimate cutting time', category: 'Core Engineering' },
    { id: 'laser-parameter-optimizer', name: 'Parameter Optimizer', path: '/calculator/laser-parameter-optimizer', icon: 'Settings', description: 'Optimize cutting parameters', category: 'Core Engineering' },
    { id: 'material-selection-assistant', name: 'Material Selector', path: '/calculator/material-selection-assistant', icon: 'Layers', description: 'Select optimal materials', category: 'Core Engineering' },
    { id: 'gas-consumption-calculator', name: 'Gas Consumption', path: '/calculator/gas-consumption-calculator', icon: 'Wind', description: 'Calculate gas consumption', category: 'Core Engineering' },

    // Epic 2: Quality Control Calculators (5个)
    { id: 'edge-quality-predictor', name: 'Edge Quality', path: '/calculator/edge-quality-predictor', icon: 'Target', description: 'Predict edge quality', category: 'Quality Control' },
    { id: 'warping-risk-calculator', name: 'Warping Risk', path: '/calculator/warping-risk-calculator', icon: 'AlertTriangle', description: 'Calculate warping risk', category: 'Quality Control' },
    { id: 'burn-mark-preventer', name: 'Burn Mark Prevention', path: '/calculator/burn-mark-preventer', icon: 'Shield', description: 'Prevent burn marks', category: 'Quality Control' },
    { id: 'dross-formation-calculator', name: 'Dross Formation', path: '/calculator/dross-formation-calculator', icon: 'Droplets', description: 'Calculate dross formation', category: 'Quality Control' },
    { id: 'tolerance-stack-calculator', name: 'Tolerance Stack', path: '/calculator/tolerance-stack-calculator', icon: 'Ruler', description: 'Calculate tolerance stack', category: 'Quality Control' },

    // Epic 3: Process Optimization Calculators (5个)
    { id: 'focus-height-calculator', name: 'Focus Height', path: '/calculator/focus-height-calculator', icon: 'Focus', description: 'Calculate optimal focus height', category: 'Process Optimization' },
    { id: 'gas-pressure-setting-guide', name: 'Gas Pressure Guide', path: '/calculator/gas-pressure-setting-guide', icon: 'Gauge', description: 'Gas pressure settings', category: 'Process Optimization' },
    { id: 'frequency-setting-assistant', name: 'Frequency Assistant', path: '/calculator/frequency-setting-assistant', icon: 'Radio', description: 'Frequency settings', category: 'Process Optimization' },
    { id: 'multiple-pass-calculator', name: 'Multiple Pass', path: '/calculator/multiple-pass-calculator', icon: 'Repeat', description: 'Multiple pass calculations', category: 'Process Optimization' },
    { id: 'power-speed-matching', name: 'Power-Speed Matching', path: '/calculator/power-speed-matching', icon: 'Zap', description: 'Match power and speed', category: 'Process Optimization' },

    // Epic 4: Advanced Analysis Calculators (5个)
    { id: 'sensitivity-analysis-calculator', name: 'Sensitivity Analysis', path: '/calculator/sensitivity-analysis-calculator', icon: 'BarChart3', description: 'Parameter sensitivity analysis', category: 'Advanced Analysis' },
    { id: 'process-optimization-engine', name: 'Process Optimizer', path: '/calculator/process-optimization-engine', icon: 'Cpu', description: 'AI-powered process optimization', category: 'Advanced Analysis' },
    { id: 'predictive-quality-model', name: 'Quality Predictor', path: '/calculator/predictive-quality-model', icon: 'Brain', description: 'ML-based quality prediction', category: 'Advanced Analysis' },
    { id: 'cost-benefit-analyzer', name: 'Cost-Benefit Analysis', path: '/calculator/cost-benefit-analyzer', icon: 'TrendingUp', description: 'Investment analysis', category: 'Advanced Analysis' },
    { id: 'performance-benchmarking-tool', name: 'Performance Benchmark', path: '/calculator/performance-benchmarking-tool', icon: 'Award', description: 'Performance benchmarking', category: 'Advanced Analysis' }
  ],
  maintenance: [
    { id: 'dashboard', name: 'Maintenance Dashboard', path: '/maintenance', icon: 'Activity', description: 'Overview and scheduling' },
    { id: 'preventive', name: 'Preventive Maintenance', path: '/maintenance/preventive', icon: 'Wrench', description: 'Scheduled maintenance' },
    { id: 'work-orders', name: 'Work Orders', path: '/maintenance/work-orders', icon: 'FileText', description: 'Manage work orders' },
    { id: 'reports', name: 'Reports', path: '/maintenance/reports', icon: 'BarChart3', description: 'Maintenance reports' }
  ],
  security: [
    { id: 'dashboard', name: 'Security Dashboard', path: '/security', icon: 'Shield', description: 'Security overview' },
    { id: 'compliance', name: 'Compliance', path: '/security/compliance', icon: 'Lock', description: 'Compliance management' },
    { id: 'permissions', name: 'Permissions', path: '/security/permissions', icon: 'Users', description: 'User permissions' }
  ],
  integration: [
    { id: 'dashboard', name: 'API Integration', path: '/api-integration', icon: 'Globe', description: 'Integration overview' },
    { id: 'endpoints', name: 'Endpoints', path: '/api-integration/endpoints', icon: 'Database', description: 'API endpoints' },
    { id: 'sync-jobs', name: 'Sync Jobs', path: '/api-integration/sync-jobs', icon: 'Activity', description: 'Data synchronization' }
  ]
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const location = useLocation();

  const getIcon = (iconName: string) => {
    const icons = {
      // Core Engineering Icons
      DollarSign,
      Clock,
      Settings,
      Layers,
      Wind,

      // Quality Control Icons
      Target,
      AlertTriangle,
      Shield,
      Droplets,
      Ruler,

      // Process Optimization Icons
      Focus,
      Gauge,
      Radio,
      Repeat,
      Zap,

      // Advanced Analysis Icons
      BarChart3,
      Cpu,
      Brain,
      TrendingUp,
      Award,

      // System Icons
      Calculator,
      Wrench,
      Globe,
      FileText,
      Users,
      Lock,
      Database,
      Activity,
      ArrowRight
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Calculator;
    return <IconComponent className="w-5 h-5" />;
  };

  const isRouteActive = (currentPath: string, routePath: string) => {
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  };

  const getBreadcrumbs = (pathname: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', path: '/' }];

    let currentPath = '';
    segments.forEach(segment => {
      currentPath += `/${segment}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ name, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo and Brand - Left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Laser Calc</h1>
                  <p className="text-xs text-gray-500">Professional Cutting Calculator</p>
                </div>
              </Link>
            </div>

            {/* Centered Navigation */}
            <div className="flex-1 flex justify-center">
              <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>

              {/* Calculators Mega Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                  <Calculator className="w-4 h-4" />
                  <span>Calculators</span>
                  <ChevronRight className="w-3 h-3 transform group-hover:rotate-90 transition-transform" />
                </button>

                {/* Calculators Mega Menu - Centered Vertical Down with 4 Columns */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[900px] bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-8">
                    {/* 4 Columns Layout */}
                    <div className="grid grid-cols-4 gap-8">
                      {/* Core Engineering */}
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Calculator className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Core Engineering</h4>
                            <p className="text-xs text-gray-500">Essential calculations</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link to="/calculator/laser-cutting-cost" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <div className="font-medium">Cost Calculator</div>
                            <div className="text-xs text-gray-500 mt-1">Calculate cutting costs</div>
                          </Link>
                          <Link to="/calculator/cutting-time-estimator" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <div className="font-medium">Time Estimator</div>
                            <div className="text-xs text-gray-500 mt-1">Estimate cutting time</div>
                          </Link>
                          <Link to="/calculator/laser-parameter-optimizer" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <div className="font-medium">Parameter Optimizer</div>
                            <div className="text-xs text-gray-500 mt-1">Optimize parameters</div>
                          </Link>
                          <Link to="/calculator/material-selection-assistant" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                            <div className="font-medium">Material Selector</div>
                            <div className="text-xs text-gray-500 mt-1">Select materials</div>
                          </Link>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Link
                            to="/epic/core-engineering"
                            className="flex items-center justify-between text-xs text-blue-600 hover:text-blue-800 font-medium p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span>View all (5)</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Quality Control */}
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Quality Control</h4>
                            <p className="text-xs text-gray-500">Quality prediction</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link to="/calculator/edge-quality-predictor" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                            <div className="font-medium">Edge Quality</div>
                            <div className="text-xs text-gray-500 mt-1">Predict edge quality</div>
                          </Link>
                          <Link to="/calculator/warping-risk-calculator" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                            <div className="font-medium">Warping Risk</div>
                            <div className="text-xs text-gray-500 mt-1">Calculate warping risk</div>
                          </Link>
                          <Link to="/calculator/burn-mark-preventer" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                            <div className="font-medium">Burn Mark Prevention</div>
                            <div className="text-xs text-gray-500 mt-1">Prevent burn marks</div>
                          </Link>
                          <Link to="/calculator/dross-formation-calculator" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                            <div className="font-medium">Dross Formation</div>
                            <div className="text-xs text-gray-500 mt-1">Calculate dross formation</div>
                          </Link>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Link
                            to="/epic/quality-control"
                            className="flex items-center justify-between text-xs text-green-600 hover:text-green-800 font-medium p-2 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <span>View all (5)</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Process Optimization */}
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                            <Settings className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Process Optimization</h4>
                            <p className="text-xs text-gray-500">Parameter tuning</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link to="/calculator/power-speed-matching" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <div className="font-medium">Power-Speed Matching</div>
                            <div className="text-xs text-gray-500 mt-1">Match power and speed</div>
                          </Link>
                          <Link to="/calculator/gas-pressure-setting-guide" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <div className="font-medium">Gas Pressure Guide</div>
                            <div className="text-xs text-gray-500 mt-1">Set gas pressure</div>
                          </Link>
                          <Link to="/calculator/focus-height-calculator" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <div className="font-medium">Focus Height</div>
                            <div className="text-xs text-gray-500 mt-1">Calculate focus height</div>
                          </Link>
                          <Link to="/calculator/frequency-setting-assistant" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <div className="font-medium">Frequency Setting</div>
                            <div className="text-xs text-gray-500 mt-1">Set frequency</div>
                          </Link>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Link
                            to="/epic/process-optimization"
                            className="flex items-center justify-between text-xs text-purple-600 hover:text-purple-800 font-medium p-2 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <span>View all (5)</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Advanced Analysis */}
                      <div>
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">Advanced Analysis</h4>
                            <p className="text-xs text-gray-500">Advanced insights</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link to="/calculator/sensitivity-analysis-calculator" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            <div className="font-medium">Sensitivity Analysis</div>
                            <div className="text-xs text-gray-500 mt-1">Analyze sensitivity</div>
                          </Link>
                          <Link to="/calculator/process-optimization-engine" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            <div className="font-medium">Process Engine</div>
                            <div className="text-xs text-gray-500 mt-1">Optimize processes</div>
                          </Link>
                          <Link to="/calculator/predictive-quality-model" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            <div className="font-medium">Quality Model</div>
                            <div className="text-xs text-gray-500 mt-1">Predict quality</div>
                          </Link>
                          <Link to="/calculator/cost-benefit-analyzer" className="block p-3 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            <div className="font-medium">Cost-Benefit Analysis</div>
                            <div className="text-xs text-gray-500 mt-1">Analyze costs</div>
                          </Link>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Link
                            to="/epic/advanced-analysis"
                            className="flex items-center justify-between text-xs text-orange-600 hover:text-orange-800 font-medium p-2 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <span>View all (5)</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-100 mt-8 pt-6 flex justify-center">
                      <Link
                        to="/calculators"
                        className="flex items-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <span>Browse All Calculators</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/features"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/features'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Features</span>
              </Link>

              <Link
                to="/pricing"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/pricing'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pricing</span>
              </Link>

              <Link
                to="/blog"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/blog'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </Link>

              <Link
                to="/contact"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/contact'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Contact</span>
              </Link>
              </nav>
            </div>

            {/* Right Side - Language Switcher */}
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
                  <span className="hidden md:inline">{languages.find(lang => lang.code === currentLanguage)?.name}</span>
                  <ChevronRight className={`w-3 h-3 transform transition-transform ${isLanguageMenuOpen ? 'rotate-90' : ''}`} />
                </button>

                {/* Language Dropdown */}
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setCurrentLanguage(language.code);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 ${
                          currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation-menu"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-navigation-menu" className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>

              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Calculators
              </div>

              {navigationConfig.calculators.map((route) => (
                <Link
                  key={route.id}
                  to={route.path}
                  className={`flex items-center space-x-3 px-6 py-2 rounded-md text-sm ${
                    isRouteActive(location.pathname, route.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {getIcon(route.icon)}
                  <div>
                    <div className="font-medium">{route.name}</div>
                    <div className="text-xs text-gray-500">{route.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 py-3 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 font-medium">{crumb.name}</span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Laser Calc</h3>
                  <p className="text-sm text-gray-500">Professional Cutting Calculator</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive laser cutting calculation platform for professionals.
                Optimize your cutting parameters, estimate costs, and select materials.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Calculators</h4>
              <ul className="space-y-2">
                {navigationConfig.calculators.map((route) => (
                  <li key={route.id}>
                    <Link
                      to={route.path}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time calculations</li>
                <li>• Material database</li>
                <li>• Parameter optimization</li>
                <li>• Cost analysis</li>
                <li>• Time estimation</li>
                <li>• Professional reports</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 Laser Calc. Professional laser cutting calculation platform.
              </p>
              <div className="mt-4 md:mt-0">
                <p className="text-sm text-gray-500">
                  Built with React, TypeScript, and Tailwind CSS
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

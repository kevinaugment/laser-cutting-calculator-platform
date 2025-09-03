import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ui/ErrorBoundary';

// 懒加载计算器组件 - 基于实际存在的计算器路径
const LazyCalculatorComponents = {
  // Epic 1: Core Engineering Calculators - 使用实际存在的路径
  'laser-cutting-cost': lazy(() =>
    import('../components/calculators/LaserCuttingCostCalculator').then(module => ({
      default: module.default
    }))
  ),
  'cutting-time-estimator': lazy(() =>
    import('../features/calculators/cutting-time-estimator').then(module => ({
      default: module.default
    }))
  ),
  'laser-parameter-optimizer': lazy(() =>
    import('../features/calculators/laser-parameter-optimizer').then(module => ({
      default: module.default
    }))
  ),
  'material-selection-assistant': lazy(() =>
    import('../features/calculators/material-selection-assistant').then(module => ({
      default: module.default
    }))
  ),
  'gas-consumption-calculator': lazy(() =>
    import('../components/calculators/GasConsumptionCalculator').then(module => ({
      default: module.default
    }))
  ),

  // Epic 2: Quality Control Calculators - 使用实际存在的路径
  'edge-quality-predictor': lazy(() =>
    import('../features/calculators/edge-quality-predictor').then(module => ({
      default: module.default
    }))
  ),
  'warping-risk-calculator': lazy(() =>
    import('../features/calculators/warping-risk-calculator').then(module => ({
      default: module.default
    }))
  ),
  'burn-mark-preventer': lazy(() =>
    import('../features/calculators/burn-mark-preventer').then(module => ({
      default: module.default
    }))
  ),
  'dross-formation-calculator': lazy(() =>
    import('../features/calculators/dross-formation-calculator').then(module => ({
      default: module.default
    }))
  ),
  'tolerance-stack-calculator': lazy(() =>
    import('../features/calculators/tolerance-stack-calculator').then(module => ({
      default: module.default
    }))
  ),

  // Epic 3: Process Optimization Calculators - 使用实际存在的路径
  'focus-height-calculator': lazy(() =>
    import('../features/calculators/focus-height-calculator').then(module => ({
      default: module.default
    }))
  ),
  'gas-pressure-setting-guide': lazy(() =>
    import('../features/calculators/gas-pressure-setting-guide').then(module => ({
      default: module.default
    }))
  ),
  'frequency-setting-assistant': lazy(() =>
    import('../features/calculators/frequency-setting-assistant').then(module => ({
      default: module.default
    }))
  ),
  'multiple-pass-calculator': lazy(() =>
    import('../features/calculators/multiple-pass-calculator').then(module => ({
      default: module.default
    }))
  ),
  'power-speed-matching': lazy(() =>
    import('../features/calculators/power-speed-matching').then(module => ({
      default: module.default
    }))
  ),

  // Epic 4: Advanced Analysis Calculators - 使用实际存在的路径
  'sensitivity-analysis-calculator': lazy(() =>
    import('../features/calculators/sensitivity-analysis-calculator').then(module => ({
      default: module.default
    }))
  ),
  'process-optimization-engine': lazy(() =>
    import('../features/calculators/process-optimization-engine').then(module => ({
      default: module.default
    }))
  ),
  'predictive-quality-model': lazy(() =>
    import('../features/calculators/predictive-quality-model').then(module => ({
      default: module.default
    }))
  ),
  'cost-benefit-analyzer': lazy(() =>
    import('../features/calculators/cost-benefit-analyzer').then(module => ({
      default: module.default
    }))
  ),
  'performance-benchmarking-tool': lazy(() =>
    import('../features/calculators/performance-benchmarking-tool').then(module => ({
      default: module.default
    }))
  ),

  // Additional calculators from components directory
  'heat-affected-zone-calculator': lazy(() =>
    import('../features/calculators/heat-affected-zone-calculator').then(module => ({
      default: module.default
    }))
  ),
  'beam-quality-calculator': lazy(() =>
    import('../features/calculators/beam-quality-calculator').then(module => ({
      default: module.default
    }))
  )
};

// 懒加载包装组件
interface LazyCalculatorWrapperProps {
  calculatorId: string;
}

const LazyCalculatorWrapper: React.FC<LazyCalculatorWrapperProps> = ({ calculatorId }) => {
  const LazyComponent = LazyCalculatorComponents[calculatorId as keyof typeof LazyCalculatorComponents];
  
  if (!LazyComponent) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Calculator Not Found
          </h2>
          <p className="text-gray-600">
            The calculator "{calculatorId}" is not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary name={`Calculator-${calculatorId}`} level="component">
      <Suspense 
        fallback={
          <LoadingSpinner 
            size="lg" 
            text={`Loading ${calculatorId.replace(/-/g, ' ')} calculator...`}
            className="min-h-[400px]"
          />
        }
      >
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
};

// 预加载策略
export const preloadCalculator = (calculatorId: string) => {
  const LazyComponent = LazyCalculatorComponents[calculatorId as keyof typeof LazyCalculatorComponents];
  if (LazyComponent) {
    // 触发动态导入但不渲染
    LazyComponent.preload?.();
  }
};

// 批量预加载高优先级计算器 - 基于实际存在的计算器
export const preloadCoreCalculators = () => {
  // Epic 1: Core Engineering (最高优先级) - 实际存在的计算器
  const epic1Calculators = [
    'laser-cutting-cost',
    'cutting-time-estimator',
    'laser-parameter-optimizer',
    'material-selection-assistant',
    'gas-consumption-calculator'
  ];

  // Epic 2: Quality Control (高优先级) - 实际存在的计算器
  const epic2Calculators = [
    'edge-quality-predictor',
    'warping-risk-calculator',
    'burn-mark-preventer',
    'dross-formation-calculator',
    'tolerance-stack-calculator'
  ];

  // Epic 3: Process Optimization (中优先级) - 实际存在的计算器
  const epic3Calculators = [
    'focus-height-calculator',
    'gas-pressure-setting-guide',
    'frequency-setting-assistant',
    'multiple-pass-calculator',
    'power-speed-matching'
  ];

  // Epic 4: Advanced Analysis (专业级) - 实际存在的计算器
  const epic4Calculators = [
    'sensitivity-analysis-calculator',
    'process-optimization-engine',
    'predictive-quality-model',
    'cost-benefit-analyzer',
    'performance-benchmarking-tool'
  ];

  // Additional calculators
  const additionalCalculators = [
    'heat-affected-zone-calculator',
    'beam-quality-calculator'
  ];

  // 分批预加载，避免阻塞
  epic1Calculators.forEach((calculatorId, index) => {
    setTimeout(() => preloadCalculator(calculatorId), index * 100);
  });

  epic2Calculators.forEach((calculatorId, index) => {
    setTimeout(() => preloadCalculator(calculatorId), 1000 + index * 100);
  });

  epic3Calculators.forEach((calculatorId, index) => {
    setTimeout(() => preloadCalculator(calculatorId), 2000 + index * 100);
  });

  epic4Calculators.forEach((calculatorId, index) => {
    setTimeout(() => preloadCalculator(calculatorId), 3000 + index * 100);
  });

  additionalCalculators.forEach((calculatorId, index) => {
    setTimeout(() => preloadCalculator(calculatorId), 4000 + index * 100);
  });
};

// 基于用户行为的相关计算器预加载 - 基于实际存在的计算器
export const relatedCalculatorPreload = (currentCalculatorId: string) => {
  // 相关计算器映射 - 基于实际存在的计算器和功能关联
  const relatedCalculators: Record<string, string[]> = {
    // Epic 1: Core Engineering 相关性
    'laser-cutting-cost': ['cutting-time-estimator', 'material-selection-assistant', 'gas-consumption-calculator'],
    'cutting-time-estimator': ['laser-parameter-optimizer', 'material-selection-assistant', 'cost-benefit-analyzer'],
    'laser-parameter-optimizer': ['edge-quality-predictor', 'warping-risk-calculator', 'sensitivity-analysis-calculator'],
    'material-selection-assistant': ['laser-cutting-cost', 'edge-quality-predictor', 'focus-height-calculator'],
    'gas-consumption-calculator': ['laser-cutting-cost', 'cost-benefit-analyzer', 'performance-benchmarking-tool'],

    // Epic 2: Quality Control 相关性
    'edge-quality-predictor': ['laser-parameter-optimizer', 'burn-mark-preventer', 'predictive-quality-model'],
    'warping-risk-calculator': ['laser-parameter-optimizer', 'tolerance-stack-calculator', 'sensitivity-analysis-calculator'],
    'burn-mark-preventer': ['edge-quality-predictor', 'laser-parameter-optimizer', 'process-optimization-engine'],
    'dross-formation-calculator': ['edge-quality-predictor', 'laser-parameter-optimizer', 'predictive-quality-model'],
    'tolerance-stack-calculator': ['warping-risk-calculator', 'focus-height-calculator', 'sensitivity-analysis-calculator'],

    // Epic 3: Process Optimization 相关性
    'focus-height-calculator': ['material-selection-assistant', 'tolerance-stack-calculator', 'power-speed-matching'],
    'gas-pressure-setting-guide': ['laser-parameter-optimizer', 'focus-height-calculator', 'process-optimization-engine'],
    'frequency-setting-assistant': ['laser-parameter-optimizer', 'power-speed-matching', 'process-optimization-engine'],
    'multiple-pass-calculator': ['cutting-time-estimator', 'power-speed-matching', 'cost-benefit-analyzer'],
    'power-speed-matching': ['laser-parameter-optimizer', 'frequency-setting-assistant', 'multiple-pass-calculator'],

    // Epic 4: Advanced Analysis 相关性
    'sensitivity-analysis-calculator': ['laser-parameter-optimizer', 'warping-risk-calculator', 'process-optimization-engine'],
    'process-optimization-engine': ['sensitivity-analysis-calculator', 'predictive-quality-model', 'performance-benchmarking-tool'],
    'predictive-quality-model': ['edge-quality-predictor', 'process-optimization-engine', 'performance-benchmarking-tool'],
    'cost-benefit-analyzer': ['cutting-time-estimator', 'gas-consumption-calculator', 'performance-benchmarking-tool'],
    'performance-benchmarking-tool': ['cost-benefit-analyzer', 'process-optimization-engine', 'predictive-quality-model'],

    // Additional calculators
    'heat-affected-zone-calculator': ['laser-parameter-optimizer', 'material-selection-assistant', 'warping-risk-calculator'],
    'beam-quality-calculator': ['laser-parameter-optimizer', 'focus-height-calculator', 'edge-quality-predictor']
  };

  const related = relatedCalculators[currentCalculatorId] || [];
  related.forEach((calculatorId, index) => {
    // 延迟预加载相关计算器
    setTimeout(() => preloadCalculator(calculatorId), (index + 1) * 200);
  });
};

// 路由级别的懒加载配置
export const createLazyCalculatorRoutes = () => {
  return Object.keys(LazyCalculatorComponents).map(calculatorId => (
    <Route
      key={calculatorId}
      path={`/calculator/${calculatorId}`}
      element={<LazyCalculatorWrapper calculatorId={calculatorId} />}
    />
  ));
};

// 性能监控
export const trackCalculatorLoadTime = (calculatorId: string, startTime: number) => {
  const loadTime = performance.now() - startTime;
  
  // 发送性能数据到监控服务
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_load_time', {
      calculator_id: calculatorId,
      load_time: Math.round(loadTime),
      custom_parameter: 'lazy_loading'
    });
  }
  
  console.log(`📊 Calculator ${calculatorId} loaded in ${Math.round(loadTime)}ms`);
};

// 导出主要组件和工具
export default LazyCalculatorWrapper;
export { LazyCalculatorComponents };

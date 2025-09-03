// 测试工具函数 - 提供完整的测试环境支持
// 解决SEO组件、路由和其他上下文问题

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// 基础测试包装器 - 提供最小必要的上下文
export const BaseTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HelmetProvider>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </HelmetProvider>
  );
};

// 完整测试包装器 - 提供所有可能需要的上下文
export const FullTestWrapper: React.FC<{ 
  children: React.ReactNode;
  initialEntries?: string[];
}> = ({ children, initialEntries = ['/'] }) => {
  return (
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </HelmetProvider>
  );
};

// 自定义render函数 - 基础版本
export const renderWithProviders = (
  ui: React.ReactElement,
  options: RenderOptions & { initialEntries?: string[] } = {}
) => {
  const { initialEntries, ...renderOptions } = options;
  
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <FullTestWrapper initialEntries={initialEntries}>
      {children}
    </FullTestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// 计算器专用render函数 - 为计算器组件提供特殊支持
export const renderCalculator = (
  ui: React.ReactElement,
  options: RenderOptions & { 
    initialEntries?: string[];
    suppressConsoleErrors?: boolean;
  } = {}
) => {
  const { initialEntries, suppressConsoleErrors = true, ...renderOptions } = options;
  
  // 抑制控制台错误（可选）
  const originalConsoleError = console.error;
  if (suppressConsoleErrors) {
    console.error = () => {};
  }

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <FullTestWrapper initialEntries={initialEntries}>
      {children}
    </FullTestWrapper>
  );

  const result = render(ui, { wrapper: Wrapper, ...renderOptions });

  // 恢复控制台错误
  if (suppressConsoleErrors) {
    console.error = originalConsoleError;
  }

  return result;
};

// SEO组件专用render函数
export const renderWithSEO = (
  ui: React.ReactElement,
  options: RenderOptions & { initialEntries?: string[] } = {}
) => {
  const { initialEntries, ...renderOptions } = options;
  
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <div id="root">
          {children}
        </div>
      </MemoryRouter>
    </HelmetProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// 模拟数据生成器
export const createMockCalculatorInputs = (overrides = {}) => ({
  material: 'steel',
  thickness: 3,
  length: 100,
  width: 100,
  quantity: 1,
  laserPower: 1000,
  cuttingSpeed: 1000,
  assistGas: 'oxygen',
  ...overrides,
});

// 导入统一的材料属性数据
import {
  unifiedMaterialProperties,
  applicationRequirements,
  getUnifiedMaterialProperties,
  type UnifiedMaterialProperties
} from '../data/unifiedMaterialProperties';

// 导出统一的材料属性数据供测试使用
export const mockMaterialProperties = unifiedMaterialProperties;
export const mockApplicationRequirements = applicationRequirements;
export const getMockMaterialProperties = getUnifiedMaterialProperties;

// 类型导出
export type { UnifiedMaterialProperties };

// 应用需求模拟数据
export const mockApplicationRequirements = {
  automotive: {
    maxCost: 1000,
    qualityRequirement: 'high',
    toleranceRequirement: 'tight',
  },
  aerospace: {
    maxCost: 5000,
    qualityRequirement: 'precision',
    toleranceRequirement: 'ultra-tight',
  },
  general: {
    maxCost: 500,
    qualityRequirement: 'standard',
    toleranceRequirement: 'normal',
  },
};

// 材料优化属性模拟数据
export const mockMaterialOptimizationProperties = {
  steel: {
    powerRange: [500, 6000],
    speedRange: [500, 8000],
    gasPressureRange: [0.5, 20],
    focusRange: [-5, 2],
    qualityWeight: 0.8,
    costWeight: 1.0,
    energyWeight: 0.9,
  },
  aluminum: {
    powerRange: [300, 4000],
    speedRange: [1000, 12000],
    gasPressureRange: [5, 20],
    focusRange: [-3, 3],
    qualityWeight: 0.7,
    costWeight: 0.8,
    energyWeight: 0.8,
  },
  stainless_steel: {
    powerRange: [800, 8000],
    speedRange: [300, 6000],
    gasPressureRange: [8, 25],
    focusRange: [-6, 1],
    qualityWeight: 0.9,
    costWeight: 1.2,
    energyWeight: 1.0,
  },
  copper: {
    powerRange: [1000, 10000],
    speedRange: [200, 4000],
    gasPressureRange: [10, 25],
    focusRange: [-4, 2],
    qualityWeight: 0.6,
    costWeight: 1.5,
    energyWeight: 1.2,
  },
};

// 气体压力属性模拟数据
export const mockMaterialGasPressureProperties = {
  steel: {
    oxygen: { minPressure: 0.5, maxPressure: 3.0, optimal: 1.5 },
    nitrogen: { minPressure: 8, maxPressure: 20, optimal: 12 },
    air: { minPressure: 5, maxPressure: 15, optimal: 8 },
  },
  aluminum: {
    oxygen: { minPressure: 0.3, maxPressure: 2.0, optimal: 1.0 },
    nitrogen: { minPressure: 10, maxPressure: 25, optimal: 15 },
    air: { minPressure: 8, maxPressure: 18, optimal: 12 },
  },
  stainless_steel: {
    oxygen: { minPressure: 0.4, maxPressure: 2.5, optimal: 1.2 },
    nitrogen: { minPressure: 12, maxPressure: 22, optimal: 16 },
    air: { minPressure: 10, maxPressure: 20, optimal: 14 },
  },
  copper: {
    oxygen: { minPressure: 0.2, maxPressure: 1.5, optimal: 0.8 },
    nitrogen: { minPressure: 15, maxPressure: 30, optimal: 20 },
    air: { minPressure: 12, maxPressure: 25, optimal: 18 },
  },
};

// 测试环境清理函数
export const cleanupTestEnvironment = () => {
  // 清理任何全局状态
  if (typeof window !== 'undefined') {
    // 清理localStorage
    window.localStorage.clear();
    // 清理sessionStorage
    window.sessionStorage.clear();
  }
};

// 异步测试工具
export const waitForCalculation = (timeout = 5000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

// 错误边界测试组件
export class TestErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// 带错误边界的render函数
export const renderWithErrorBoundary = (
  ui: React.ReactElement,
  options: RenderOptions = {}
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseTestWrapper>
      <TestErrorBoundary>
        {children}
      </TestErrorBoundary>
    </BaseTestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

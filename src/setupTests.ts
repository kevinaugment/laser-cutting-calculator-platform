// 测试环境设置文件 - Phase 4: 质量保证与测试覆盖
// 为Vitest测试环境提供全局配置和模拟

import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// 扩展Vitest的expect断言
expect.extend(matchers);

// 每个测试后清理DOM
afterEach(() => {
  cleanup();
});

// 全局测试配置
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// 模拟ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 模拟IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 模拟performance.now()
if (!global.performance) {
  global.performance = {
    now: () => Date.now(),
  } as Performance;
}

// 模拟console方法以避免测试输出污染
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // 可以在这里添加每个测试前的设置

  // 注入统一的材料属性数据到全局环境
  if (typeof global !== 'undefined') {
    // 导入统一材料属性数据
    const { unifiedMaterialProperties, applicationRequirements, getUnifiedMaterialProperties } = require('./__tests__/data/unifiedMaterialProperties.ts');

    // 注入到全局对象，供所有计算器测试使用
    (global as any).mockMaterialProperties = unifiedMaterialProperties;
    (global as any).mockApplicationRequirements = applicationRequirements;
    (global as any).getMockMaterialProperties = getUnifiedMaterialProperties;

    // 为了兼容性，也注入到window对象（如果存在）
    if (typeof window !== 'undefined') {
      (window as any).mockMaterialProperties = unifiedMaterialProperties;
      (window as any).mockApplicationRequirements = applicationRequirements;
      (window as any).getMockMaterialProperties = getUnifiedMaterialProperties;
    }
  }
});

afterEach(() => {
  // 恢复console方法
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// 全局测试工具函数
export const mockConsole = {
  error: () => {
    console.error = () => {};
  },
  warn: () => {
    console.warn = () => {};
  },
  restore: () => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }
};

// 测试工具函数将在testUtils.tsx中定义，避免在.ts文件中使用JSX

// 测试数据工厂
export const createMockCalculatorInputs = () => ({
  material: 'steel',
  thickness: 3,
  length: 100,
  width: 100,
  quantity: 1
});

export const createMockCalculatorResults = () => ({
  totalCost: 15.75,
  totalTime: 5.0,
  materialCost: 7.85,
  laborCost: 5.0,
  energyCost: 2.9
});

// 异步测试工具
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 测试环境信息
console.log('🧪 Test environment setup completed');
console.log('📊 Vitest + React Testing Library + jsdom');
console.log('🎯 Phase 4: Quality Assurance & Test Coverage');

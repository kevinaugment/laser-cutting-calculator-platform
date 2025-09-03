/**
 * CalculatorLayout Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../../../theme';
import { CalculatorLayout } from '../../../components/calculators/CalculatorLayout';

// Mock the preset components
vi.mock('../../../components/presets', () => ({
  PresetManager: ({ calculatorType, onPresetLoad, currentParameters }: any) => (
    <div data-testid="preset-manager">
      <div>Calculator Type: {calculatorType}</div>
      <div>Parameters: {JSON.stringify(currentParameters)}</div>
      <button onClick={() => onPresetLoad({ parameters: { test: 'loaded' } })}>
        Load Test Preset
      </button>
    </div>
  ),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('CalculatorLayout', () => {
  const mockOnPresetLoad = vi.fn();
  const mockOnParametersChange = vi.fn();

  beforeEach(() => {
    mockOnPresetLoad.mockClear();
    mockOnParametersChange.mockClear();
  });

  it('renders children content', () => {
    render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={{ test: 'value' }}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
        >
          <div data-testid="calculator-content">Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('calculator-content')).toBeInTheDocument();
    expect(screen.getByText('Calculator Content')).toBeInTheDocument();
  });

  it('renders preset manager when showPresets is true', () => {
    render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={{ test: 'value' }}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
          showPresets={true}
        >
          <div>Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('preset-manager')).toBeInTheDocument();
    expect(screen.getByText('Calculator Type: test-calculator')).toBeInTheDocument();
  });

  it('hides preset manager when showPresets is false', () => {
    render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={{ test: 'value' }}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
          showPresets={false}
        >
          <div>Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    expect(screen.queryByTestId('preset-manager')).not.toBeInTheDocument();
  });

  it('passes current parameters to preset manager', () => {
    const testParameters = { materialType: 'steel', thickness: 5 };

    render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={testParameters}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
        >
          <div>Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    expect(screen.getByText(`Parameters: ${JSON.stringify(testParameters)}`)).toBeInTheDocument();
  });

  it('handles preset loading', () => {
    render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={{ test: 'value' }}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
        >
          <div>Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    const loadButton = screen.getByText('Load Test Preset');
    fireEvent.click(loadButton);

    expect(mockOnPresetLoad).toHaveBeenCalledWith({ test: 'loaded' });
  });

  it('renders with side preset position', () => {
    render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={{ test: 'value' }}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
          presetPosition="side"
        >
          <div data-testid="calculator-content">Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    // Check for grid layout classes that indicate side positioning
    const layoutContainer = screen.getByTestId('calculator-content').closest('.calculator-layout-side');
    expect(layoutContainer).toBeInTheDocument();
  });

  it('renders with top preset position (default)', () => {
    render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={{ test: 'value' }}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
          presetPosition="top"
        >
          <div data-testid="calculator-content">Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    // Check that preset manager appears before calculator content
    const presetManager = screen.getByTestId('preset-manager');
    const calculatorContent = screen.getByTestId('calculator-content');
    
    expect(presetManager.compareDocumentPosition(calculatorContent) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TestWrapper>
        <CalculatorLayout
          calculatorType="test-calculator"
          currentParameters={{ test: 'value' }}
          onPresetLoad={mockOnPresetLoad}
          onParametersChange={mockOnParametersChange}
          className="custom-class"
        >
          <div>Calculator Content</div>
        </CalculatorLayout>
      </TestWrapper>
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});

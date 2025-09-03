import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BaseCalculatorContainer } from '../../components/calculator/BaseCalculatorComponents';
import { BaseCalculator, BaseCalculatorConfig, BaseCalculationResult } from '../../lib/calculator/BaseCalculator';
import { z } from 'zod';

// Mock calculator implementation for testing
class MockCalculator extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'test-calculator',
    title: 'Test Calculator',
    description: 'Test calculator for data flow verification',
    category: 'Test',
    badge: 'Test',
    iconName: 'Calculator',
    inputs: [
      {
        id: 'value1',
        label: 'Value 1',
        type: 'number',
        required: true,
        min: 0,
        max: 1000
      },
      {
        id: 'value2',
        label: 'Value 2',
        type: 'number',
        required: true,
        min: 0,
        max: 1000
      },
      {
        id: 'operation',
        label: 'Operation',
        type: 'select',
        required: true,
        options: [
          { value: 'add', label: 'Add' },
          { value: 'multiply', label: 'Multiply' }
        ]
      }
    ]
  };

  getInputSchema(): z.ZodSchema {
    return z.object({
      value1: z.number().min(0).max(1000),
      value2: z.number().min(0).max(1000),
      operation: z.enum(['add', 'multiply'])
    });
  }

  async calculate(inputs: Record<string, any>): Promise<BaseCalculationResult> {
    const { value1, value2, operation } = inputs;
    
    let result: number;
    switch (operation) {
      case 'add':
        result = value1 + value2;
        break;
      case 'multiply':
        result = value1 * value2;
        break;
      default:
        throw new Error('Invalid operation');
    }

    return {
      success: true,
      data: {
        result,
        operation,
        inputs: { value1, value2 }
      },
      metadata: {
        calculationTime: 10,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        inputHash: JSON.stringify(inputs)
      }
    };
  }

  getDefaultInputs(): Record<string, any> {
    return {
      value1: 0,
      value2: 0,
      operation: 'add'
    };
  }

  getExampleInputs(): Record<string, any> {
    return {
      value1: 10,
      value2: 5,
      operation: 'add'
    };
  }
}

// Mock translation hooks
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key
    }),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn()
    }
  };
});

vi.mock('../../lib/i18n/calculatorTranslations', () => ({
  useCalculatorTranslation: () => ({
    getInputLabel: (id: string) => `Label for ${id}`,
    getInputPlaceholder: (id: string) => `Placeholder for ${id}`,
    getInputHelp: (id: string) => `Help for ${id}`
  })
}));

describe('Calculator Data Flow Verification', () => {
  let mockCalculator: MockCalculator;
  let onCalculationComplete: ReturnType<typeof vi.fn>;
  let onInputChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCalculator = new MockCalculator();
    onCalculationComplete = vi.fn();
    onInputChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Input Data Flow', () => {
    it('should handle input changes and propagate to state', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      // Find input fields by ID instead of display value
      const value1Input = screen.getByLabelText(/value1/i) || screen.getByRole('spinbutton', { name: /value1/i });
      
      // Change input value
      fireEvent.change(value1Input, { target: { value: '25' } });

      // Should call onInputChange callback
      await waitFor(() => {
        expect(onInputChange).toHaveBeenCalledWith(
          expect.objectContaining({
            value1: 25,
            value2: 0,
            operation: 'add'
          })
        );
      });
    });

    it('should validate inputs and show validation errors', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      // Find input and set invalid value
      const value1Input = screen.getByLabelText(/value1/i) || screen.getByRole('spinbutton', { name: /value1/i });
      fireEvent.change(value1Input, { target: { value: '2000' } }); // Exceeds max

      // Should show validation error
      await waitFor(() => {
        const errorElements = screen.queryAllByText(/must be at most/i);
        expect(errorElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle select input changes', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      // Find select input by label or role
      const operationSelect = screen.getByLabelText(/operation/i) || screen.getByRole('combobox');
      
      // Change selection
      fireEvent.change(operationSelect, { target: { value: 'multiply' } });

      // Should update state
      await waitFor(() => {
        expect(onInputChange).toHaveBeenCalledWith(
          expect.objectContaining({
            operation: 'multiply'
          })
        );
      });
    });
  });

  describe('Calculation Engine Data Processing', () => {
    it('should process calculation with valid inputs', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'add' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      // Find and click calculate button
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      // Should call calculation complete callback
      await waitFor(() => {
        expect(onCalculationComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            success: true,
            data: expect.objectContaining({
              result: 15, // 10 + 5
              operation: 'add'
            })
          })
        );
      });
    });

    it('should handle calculation errors gracefully', async () => {
      // Create calculator that throws error
      const errorCalculator = new MockCalculator();
      errorCalculator.calculate = vi.fn().mockRejectedValue(new Error('Test calculation error'));

      render(
        <BaseCalculatorContainer
          calculator={errorCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'add' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      // Should handle error and show error state
      await waitFor(() => {
        expect(screen.getByText(/calculation failed/i)).toBeInTheDocument();
      });
    });

    it('should show loading state during calculation', async () => {
      // Create calculator with delayed response
      const slowCalculator = new MockCalculator();
      slowCalculator.calculate = vi.fn().mockImplementation(async (inputs) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          success: true,
          data: { result: 42 },
          metadata: {
            calculationTime: 100,
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            inputHash: JSON.stringify(inputs)
          }
        };
      });

      render(
        <BaseCalculatorContainer
          calculator={slowCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'add' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      // Should show loading state
      expect(calculateButton).toBeDisabled();
      
      // Wait for calculation to complete
      await waitFor(() => {
        expect(calculateButton).not.toBeDisabled();
      });
    });
  });

  describe('Result Data Flow', () => {
    it('should display calculation results correctly', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'multiply' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      // Should display result
      await waitFor(() => {
        expect(screen.getByText('50')).toBeInTheDocument(); // 10 * 5
      });
    });

    it('should maintain calculation history', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'add' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      
      // Perform first calculation
      fireEvent.click(calculateButton);
      await waitFor(() => {
        expect(onCalculationComplete).toHaveBeenCalledTimes(1);
      });

      // Change inputs and perform second calculation
      const value1Input = screen.getByDisplayValue('10');
      fireEvent.change(value1Input, { target: { value: '20' } });
      
      fireEvent.click(calculateButton);
      await waitFor(() => {
        expect(onCalculationComplete).toHaveBeenCalledTimes(2);
      });

      // History should contain both calculations
      expect(onCalculationComplete).toHaveBeenNthCalledWith(1, 
        expect.objectContaining({
          data: expect.objectContaining({ result: 15 })
        })
      );
      expect(onCalculationComplete).toHaveBeenNthCalledWith(2,
        expect.objectContaining({
          data: expect.objectContaining({ result: 25 })
        })
      );
    });
  });

  describe('Data Format Validation', () => {
    it('should validate input data types', () => {
      const validation = mockCalculator.validateInputs({
        value1: 'invalid',
        value2: 10,
        operation: 'add'
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(1);
      expect(validation.errors[0].field).toBe('value1');
    });

    it('should validate required fields', () => {
      const validation = mockCalculator.validateInputs({
        value1: 10,
        // value2 missing
        operation: 'add'
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'value2')).toBe(true);
    });

    it('should validate field ranges', () => {
      const validation = mockCalculator.validateInputs({
        value1: -5, // Below minimum
        value2: 2000, // Above maximum
        operation: 'add'
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should validate enum values', () => {
      const validation = mockCalculator.validateInputs({
        value1: 10,
        value2: 5,
        operation: 'invalid_operation'
      });

      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(e => e.field === 'operation')).toBe(true);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle reset functionality', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          initialInputs={{ value1: 100, value2: 50, operation: 'multiply' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      // Find and click reset button (get first one if multiple exist)
      const resetButtons = screen.getAllByRole('button', { name: /reset/i });
      const resetButton = resetButtons[0];
      fireEvent.click(resetButton);

      // Should reset to default values
      await waitFor(() => {
        expect(onInputChange).toHaveBeenCalledWith(
          mockCalculator.getDefaultInputs()
        );
      });
    });

    it('should prevent calculation with invalid inputs', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          initialInputs={{ value1: -10, value2: 5, operation: 'add' }} // Invalid value1
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      // Should not call calculation complete
      await waitFor(() => {
        expect(onCalculationComplete).not.toHaveBeenCalled();
      });
    });

    it('should handle network errors gracefully', async () => {
      const networkErrorCalculator = new MockCalculator();
      networkErrorCalculator.calculate = vi.fn().mockRejectedValue(
        new Error('Network error: Failed to fetch')
      );

      render(
        <BaseCalculatorContainer
          calculator={networkErrorCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'add' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      // Should show network error message
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should track calculation performance metrics', async () => {
      const performanceSpy = vi.spyOn(performance, 'now');
      performanceSpy.mockReturnValueOnce(1000).mockReturnValueOnce(1050); // 50ms calculation

      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'add' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      fireEvent.click(calculateButton);

      await waitFor(() => {
        expect(onCalculationComplete).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: expect.objectContaining({
              calculationTime: 50
            })
          })
        );
      });

      performanceSpy.mockRestore();
    });

    it('should handle concurrent calculations correctly', async () => {
      render(
        <BaseCalculatorContainer
          calculator={mockCalculator}
          initialInputs={{ value1: 10, value2: 5, operation: 'add' }}
          onCalculationComplete={onCalculationComplete}
          onInputChange={onInputChange}
        />
      );

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      
      // Click multiple times rapidly
      fireEvent.click(calculateButton);
      fireEvent.click(calculateButton);
      fireEvent.click(calculateButton);

      // Should only process one calculation at a time
      await waitFor(() => {
        expect(onCalculationComplete).toHaveBeenCalledTimes(1);
      });
    });
  });
});

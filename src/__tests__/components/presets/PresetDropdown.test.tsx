/**
 * PresetDropdown Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../../../theme';
import { PresetDropdown } from '../../../components/presets/PresetDropdown';
import { Preset } from '../../../types/preset';

// Mock presets data
const mockPresets: Preset[] = [
  {
    id: 'preset-1',
    name: 'Steel Cutting',
    description: 'Standard steel cutting parameters',
    calculatorType: 'laser-cutting-cost',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: '1.0.0',
    parameters: {
      materialType: 'steel',
      thickness: 5,
    },
    tags: ['steel', 'standard'],
  },
  {
    id: 'preset-2',
    name: 'Aluminum Cutting',
    description: 'Aluminum cutting parameters',
    calculatorType: 'laser-cutting-cost',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    version: '1.0.0',
    parameters: {
      materialType: 'aluminum',
      thickness: 3,
    },
    tags: ['aluminum', 'light'],
  },
];

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('PresetDropdown', () => {
  const mockOnPresetSelect = vi.fn();

  beforeEach(() => {
    mockOnPresetSelect.mockClear();
  });

  it('renders with placeholder when no preset is selected', () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
          placeholder="Select a preset..."
        />
      </TestWrapper>
    );

    expect(screen.getByText('Select a preset...')).toBeInTheDocument();
  });

  it('displays selected preset name', () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId="preset-1"
          onPresetSelect={mockOnPresetSelect}
        />
      </TestWrapper>
    );

    expect(screen.getByText('Steel Cutting')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Steel Cutting')).toBeInTheDocument();
      expect(screen.getByText('Aluminum Cutting')).toBeInTheDocument();
    });
  });

  it('calls onPresetSelect when preset is clicked', async () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      const steelOption = screen.getByText('Steel Cutting');
      fireEvent.click(steelOption);
    });

    expect(mockOnPresetSelect).toHaveBeenCalledWith('preset-1');
  });

  it('shows search input when there are many presets', async () => {
    const manyPresets = Array.from({ length: 10 }, (_, i) => ({
      ...mockPresets[0],
      id: `preset-${i}`,
      name: `Preset ${i}`,
    }));

    render(
      <TestWrapper>
        <PresetDropdown
          presets={manyPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search presets...')).toBeInTheDocument();
    });
  });

  it('filters presets based on search query', async () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    // Wait for dropdown to open
    await waitFor(() => {
      expect(screen.getByText('Steel Cutting')).toBeInTheDocument();
    });

    // Since we have only 2 presets, search input won't show
    // Let's test with more presets
    const manyPresets = Array.from({ length: 10 }, (_, i) => ({
      ...mockPresets[0],
      id: `preset-${i}`,
      name: i === 0 ? 'Steel Cutting' : `Preset ${i}`,
    }));

    render(
      <TestWrapper>
        <PresetDropdown
          presets={manyPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
        />
      </TestWrapper>
    );

    const newTrigger = screen.getAllByRole('button')[1]; // Get the second dropdown
    fireEvent.click(newTrigger);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search presets...');
      fireEvent.change(searchInput, { target: { value: 'Steel' } });
    });

    // Should only show Steel Cutting preset
    await waitFor(() => {
      expect(screen.getByText('Steel Cutting')).toBeInTheDocument();
      expect(screen.queryByText('Preset 1')).not.toBeInTheDocument();
    });
  });

  it('shows clear option when showClearOption is true and preset is selected', async () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId="preset-1"
          onPresetSelect={mockOnPresetSelect}
          showClearOption={true}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Clear selection')).toBeInTheDocument();
    });
  });

  it('calls onPresetSelect with null when clear option is clicked', async () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId="preset-1"
          onPresetSelect={mockOnPresetSelect}
          showClearOption={true}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      const clearOption = screen.getByText('Clear selection');
      fireEvent.click(clearOption);
    });

    expect(mockOnPresetSelect).toHaveBeenCalledWith(null);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
          disabled={true}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDisabled();
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <TestWrapper>
        <div>
          <PresetDropdown
            presets={mockPresets}
            selectedPresetId={null}
            onPresetSelect={mockOnPresetSelect}
          />
          <div data-testid="outside">Outside element</div>
        </div>
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText('Steel Cutting')).toBeInTheDocument();
    });

    // Click outside
    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByText('Steel Cutting')).not.toBeInTheDocument();
    });
  });

  it('handles keyboard navigation', async () => {
    render(
      <TestWrapper>
        <PresetDropdown
          presets={mockPresets}
          selectedPresetId={null}
          onPresetSelect={mockOnPresetSelect}
        />
      </TestWrapper>
    );

    const trigger = screen.getByRole('button');
    
    // Press Enter to open
    fireEvent.keyDown(trigger, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Steel Cutting')).toBeInTheDocument();
    });

    // Press Escape to close
    fireEvent.keyDown(trigger, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Steel Cutting')).not.toBeInTheDocument();
    });
  });
});

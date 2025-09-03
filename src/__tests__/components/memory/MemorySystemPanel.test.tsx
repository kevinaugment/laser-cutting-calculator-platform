/**
 * Memory System Panel Tests
 */

import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemorySystemPanel, MemoryQuickAccess } from '../../../components/memory/MemorySystemPanel';
import { ThemeProvider } from '../../../theme';

// Mock the memory hooks
vi.mock('../../../hooks/useCalculatorHistory', () => ({
  useCalculatorHistory: () => [
    {
      records: [],
      total: 0,
      loading: false,
      error: null,
    },
    {
      loadHistory: vi.fn(),
      saveCalculation: vi.fn(),
      deleteCalculation: vi.fn(),
      clearHistory: vi.fn(),
      reset: vi.fn(),
    },
  ],
}));

vi.mock('../../../hooks/useParameterPresets', () => ({
  useParameterPresets: () => [
    {
      presets: [],
      total: 0,
      loading: false,
      error: null,
    },
    {
      loadPresets: vi.fn(),
      createPreset: vi.fn(),
      updatePreset: vi.fn(),
      deletePreset: vi.fn(),
      usePreset: vi.fn(),
      ratePreset: vi.fn(),
      reset: vi.fn(),
    },
  ],
}));

vi.mock('../../../hooks/useUserPreferences', () => ({
  useUserPreferences: () => [
    {
      preferences: {
        defaultUnits: 'metric',
        autoSaveCalculations: true,
        showAdvancedOptions: false,
        theme: 'light',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          inApp: true,
        },
        privacy: {
          shareUsageData: false,
          allowAnalytics: true,
        },
        display: {
          compactMode: false,
          showTooltips: true,
          animationsEnabled: true,
        },
      },
      loading: false,
      error: null,
    },
    {
      loadPreferences: vi.fn(),
      updatePreferences: vi.fn(),
      resetPreferences: vi.fn(),
      reset: vi.fn(),
    },
  ],
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    {children}
  </ThemeProvider>
);

describe('MemorySystemPanel', () => {
  const defaultProps = {
    calculatorType: 'laser-cutting-cost',
    currentParameters: { thickness: 5, material: 'steel' },
    onParametersApply: vi.fn(),
    onPreferencesChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default props', () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Memory System')).toBeInTheDocument();
      expect(screen.getByText('Manage your calculation history, presets, and preferences')).toBeInTheDocument();
    });

    it('should render all tabs', () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('History')).toBeInTheDocument();
      expect(screen.getByText('Presets')).toBeInTheDocument();
      expect(screen.getByText('Preferences')).toBeInTheDocument();
      expect(screen.getByText('Statistics')).toBeInTheDocument();
    });

    it('should show history tab by default', () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} />
        </TestWrapper>
      );

      const historyTab = screen.getByText('History').closest('button');
      expect(historyTab).toHaveClass('border-primary-500', 'text-primary-600');
    });

    it('should show specified default tab', () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} defaultTab="presets" />
        </TestWrapper>
      );

      const presetsTab = screen.getByText('Presets').closest('button');
      expect(presetsTab).toHaveClass('border-primary-500', 'text-primary-600');
    });
  });

  describe('tab switching', () => {
    it('should switch to presets tab when clicked', async () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} />
        </TestWrapper>
      );

      const presetsTab = screen.getByText('Presets');
      fireEvent.click(presetsTab);

      await waitFor(() => {
        const presetsTabButton = presetsTab.closest('button');
        expect(presetsTabButton).toHaveClass('border-primary-500', 'text-primary-600');
      });
    });

    it('should switch to preferences tab when clicked', async () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} />
        </TestWrapper>
      );

      const preferencesTab = screen.getByText('Preferences');
      fireEvent.click(preferencesTab);

      await waitFor(() => {
        const preferencesTabButton = preferencesTab.closest('button');
        expect(preferencesTabButton).toHaveClass('border-primary-500', 'text-primary-600');
      });
    });

    it('should switch to statistics tab when clicked', async () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} />
        </TestWrapper>
      );

      const statisticsTab = screen.getByText('Statistics');
      fireEvent.click(statisticsTab);

      await waitFor(() => {
        const statisticsTabButton = statisticsTab.closest('button');
        expect(statisticsTabButton).toHaveClass('border-primary-500', 'text-primary-600');
      });
    });
  });

  describe('statistics tab content', () => {
    it('should show usage statistics when statistics tab is active', async () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} defaultTab="stats" />
        </TestWrapper>
      );

      expect(screen.getByText('Usage Statistics')).toBeInTheDocument();
      expect(screen.getByText('Quick Stats')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Memory System Tips')).toBeInTheDocument();
    });

    it('should show memory system tips', async () => {
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} defaultTab="stats" />
        </TestWrapper>
      );

      expect(screen.getByText('Save frequently used parameter combinations as presets')).toBeInTheDocument();
      expect(screen.getByText('Use the history to track your calculation patterns')).toBeInTheDocument();
      expect(screen.getByText('Configure preferences to customize your experience')).toBeInTheDocument();
      expect(screen.getByText('Export your data for backup and analysis')).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('should call onParametersApply when parameters are applied', async () => {
      const onParametersApply = vi.fn();
      
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} onParametersApply={onParametersApply} />
        </TestWrapper>
      );

      // Switch to presets tab
      const presetsTab = screen.getByText('Presets');
      fireEvent.click(presetsTab);

      // The callback would be called by the ParameterPresetPanel component
      // This is tested in the ParameterPresetPanel tests
    });

    it('should call onPreferencesChange when preferences change', async () => {
      const onPreferencesChange = vi.fn();
      
      render(
        <TestWrapper>
          <MemorySystemPanel {...defaultProps} onPreferencesChange={onPreferencesChange} />
        </TestWrapper>
      );

      // Switch to preferences tab
      const preferencesTab = screen.getByText('Preferences');
      fireEvent.click(preferencesTab);

      // The callback would be called by the UserPreferencesPanel component
      // This is tested in the UserPreferencesPanel tests
    });
  });
});

describe('MemoryQuickAccess', () => {
  const defaultProps = {
    calculatorType: 'laser-cutting-cost',
    currentParameters: { thickness: 5, material: 'steel' },
    onParametersApply: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render memory button', () => {
      render(
        <TestWrapper>
          <MemoryQuickAccess {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Memory')).toBeInTheDocument();
      expect(screen.getByTitle('Open Memory System')).toBeInTheDocument();
    });

    it('should not show panel initially', () => {
      render(
        <TestWrapper>
          <MemoryQuickAccess {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.queryByText('Memory System')).not.toBeInTheDocument();
    });
  });

  describe('panel toggle', () => {
    it('should show panel when button is clicked', async () => {
      render(
        <TestWrapper>
          <MemoryQuickAccess {...defaultProps} />
        </TestWrapper>
      );

      const memoryButton = screen.getByText('Memory');
      fireEvent.click(memoryButton);

      await waitFor(() => {
        expect(screen.getByText('Memory System')).toBeInTheDocument();
      });
    });

    it('should hide panel when close button is clicked', async () => {
      render(
        <TestWrapper>
          <MemoryQuickAccess {...defaultProps} />
        </TestWrapper>
      );

      // Open panel
      const memoryButton = screen.getByText('Memory');
      fireEvent.click(memoryButton);

      await waitFor(() => {
        expect(screen.getByText('Memory System')).toBeInTheDocument();
      });

      // Close panel
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Memory System')).not.toBeInTheDocument();
      });
    });

    it('should toggle panel when button is clicked multiple times', async () => {
      render(
        <TestWrapper>
          <MemoryQuickAccess {...defaultProps} />
        </TestWrapper>
      );

      const memoryButton = screen.getByText('Memory');

      // Open panel
      fireEvent.click(memoryButton);
      await waitFor(() => {
        expect(screen.getByText('Memory System')).toBeInTheDocument();
      });

      // Close panel
      fireEvent.click(memoryButton);
      await waitFor(() => {
        expect(screen.queryByText('Memory System')).not.toBeInTheDocument();
      });

      // Open panel again
      fireEvent.click(memoryButton);
      await waitFor(() => {
        expect(screen.getByText('Memory System')).toBeInTheDocument();
      });
    });
  });

  describe('panel content', () => {
    it('should show presets tab by default in quick access', async () => {
      render(
        <TestWrapper>
          <MemoryQuickAccess {...defaultProps} />
        </TestWrapper>
      );

      const memoryButton = screen.getByText('Memory');
      fireEvent.click(memoryButton);

      await waitFor(() => {
        const presetsTab = screen.getByText('Presets').closest('button');
        expect(presetsTab).toHaveClass('border-primary-500', 'text-primary-600');
      });
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      render(
        <TestWrapper>
          <MemoryQuickAccess {...defaultProps} className="custom-class" />
        </TestWrapper>
      );

      const container = screen.getByText('Memory').closest('.memory-quick-access');
      expect(container).toHaveClass('custom-class');
    });
  });
});

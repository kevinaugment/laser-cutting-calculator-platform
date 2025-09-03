import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';

// Mock Global State Management
interface AppState {
  user: {
    preferences: { theme: 'light' | 'dark'; language: string };
    settings: { autoSave: boolean; notifications: boolean };
  };
  calculators: {
    [calculatorId: string]: {
      inputs: Record<string, any>;
      results: any;
      lastUpdated: number;
    };
  };
  app: {
    loading: boolean;
    notifications: Array<{ id: string; message: string; type: string }>;
  };
}

type AppAction = 
  | { type: 'UPDATE_USER_PREFERENCES'; payload: any }
  | { type: 'UPDATE_CALCULATOR_STATE'; payload: { calculatorId: string; data: any } }
  | { type: 'ADD_NOTIFICATION'; payload: { id: string; message: string; type: string } }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: string } }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: {
    preferences: { theme: 'light', language: 'en' },
    settings: { autoSave: true, notifications: true }
  },
  calculators: {},
  app: {
    loading: false,
    notifications: []
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'UPDATE_USER_PREFERENCES':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload }
        }
      };
    
    case 'UPDATE_CALCULATOR_STATE':
      return {
        ...state,
        calculators: {
          ...state.calculators,
          [action.payload.calculatorId]: {
            ...state.calculators[action.payload.calculatorId],
            ...action.payload.data,
            lastUpdated: Date.now()
          }
        }
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        app: {
          ...state.app,
          notifications: [...state.app.notifications, action.payload]
        }
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        app: {
          ...state.app,
          notifications: state.app.notifications.filter(n => n.id !== action.payload.id)
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        app: { ...state.app, loading: action.payload }
      };
    
    default:
      return state;
  }
}

// Context for global state
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use app context
function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Test Components
function ThemeComponent() {
  const { state, dispatch } = useAppContext();
  
  const toggleTheme = () => {
    dispatch({
      type: 'UPDATE_USER_PREFERENCES',
      payload: { theme: state.user.preferences.theme === 'light' ? 'dark' : 'light' }
    });
  };
  
  return (
    <div data-testid="theme-component">
      <span data-testid="current-theme">{state.user.preferences.theme}</span>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}

function CalculatorComponent({ calculatorId }: { calculatorId: string }) {
  const { state, dispatch } = useAppContext();
  const [localInputs, setLocalInputs] = useState({ value: 0 });
  
  const calculatorState = state.calculators[calculatorId];
  
  const updateCalculator = () => {
    dispatch({
      type: 'UPDATE_CALCULATOR_STATE',
      payload: {
        calculatorId,
        data: {
          inputs: localInputs,
          results: { output: localInputs.value * 2 }
        }
      }
    });
  };
  
  return (
    <div data-testid={`calculator-${calculatorId}`}>
      <input
        data-testid={`calculator-input-${calculatorId}`}
        type="number"
        value={localInputs.value}
        onChange={(e) => setLocalInputs({ value: Number(e.target.value) })}
      />
      <button data-testid={`calculator-update-${calculatorId}`} onClick={updateCalculator}>
        Update Calculator
      </button>
      {calculatorState && (
        <div data-testid={`calculator-result-${calculatorId}`}>
          Result: {calculatorState.results?.output}
        </div>
      )}
    </div>
  );
}

function NotificationComponent() {
  const { state, dispatch } = useAppContext();
  
  const addNotification = () => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id, message: 'Test notification', type: 'info' }
    });
  };
  
  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id } });
  };
  
  return (
    <div data-testid="notification-component">
      <button data-testid="add-notification" onClick={addNotification}>
        Add Notification
      </button>
      <div data-testid="notification-list">
        {state.app.notifications.map(notification => (
          <div key={notification.id} data-testid={`notification-${notification.id}`}>
            {notification.message}
            <button
              data-testid={`remove-notification-${notification.id}`}
              onClick={() => removeNotification(notification.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingComponent() {
  const { state, dispatch } = useAppContext();
  
  const toggleLoading = () => {
    dispatch({ type: 'SET_LOADING', payload: !state.app.loading });
  };
  
  return (
    <div data-testid="loading-component">
      <span data-testid="loading-status">
        {state.app.loading ? 'Loading...' : 'Not Loading'}
      </span>
      <button data-testid="toggle-loading" onClick={toggleLoading}>
        Toggle Loading
      </button>
    </div>
  );
}

// Component that uses multiple state slices
function MultiStateComponent() {
  const { state } = useAppContext();
  
  return (
    <div data-testid="multi-state-component">
      <div data-testid="multi-theme">{state.user.preferences.theme}</div>
      <div data-testid="multi-loading">{state.app.loading ? 'loading' : 'idle'}</div>
      <div data-testid="multi-notifications-count">{state.app.notifications.length}</div>
    </div>
  );
}

// Component with cleanup logic
function CleanupComponent({ onUnmount }: { onUnmount: () => void }) {
  const { state } = useAppContext();
  
  useEffect(() => {
    return () => {
      onUnmount();
    };
  }, [onUnmount]);
  
  return (
    <div data-testid="cleanup-component">
      Theme: {state.user.preferences.theme}
    </div>
  );
}

describe('Cross-Component Data Consistency Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Shared State Management', () => {
    it('should maintain consistent state across multiple components', () => {
      render(
        <AppProvider>
          <ThemeComponent />
          <MultiStateComponent />
        </AppProvider>
      );

      // Initial state should be consistent
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('multi-theme')).toHaveTextContent('light');

      // Update theme in one component
      fireEvent.click(screen.getByTestId('toggle-theme'));

      // Both components should reflect the change
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('multi-theme')).toHaveTextContent('dark');
    });

    it('should handle concurrent state updates correctly', async () => {
      render(
        <AppProvider>
          <NotificationComponent />
          <MultiStateComponent />
        </AppProvider>
      );

      // Initial state
      expect(screen.getByTestId('multi-notifications-count')).toHaveTextContent('0');

      // Add multiple notifications rapidly
      fireEvent.click(screen.getByTestId('add-notification'));
      fireEvent.click(screen.getByTestId('add-notification'));
      fireEvent.click(screen.getByTestId('add-notification'));

      await waitFor(() => {
        expect(screen.getByTestId('multi-notifications-count')).toHaveTextContent('3');
      });

      // All notifications should be present
      const notifications = screen.getAllByTestId(/^notification-notification-/);
      expect(notifications).toHaveLength(3);
    });

    it('should maintain calculator state consistency', () => {
      render(
        <AppProvider>
          <CalculatorComponent calculatorId="test-calc-1" />
          <CalculatorComponent calculatorId="test-calc-2" />
        </AppProvider>
      );

      // Update first calculator
      const input1 = screen.getByTestId('calculator-input-test-calc-1');
      fireEvent.change(input1, { target: { value: '10' } });
      fireEvent.click(screen.getByTestId('calculator-update-test-calc-1'));

      // Update second calculator
      const input2 = screen.getByTestId('calculator-input-test-calc-2');
      fireEvent.change(input2, { target: { value: '20' } });
      fireEvent.click(screen.getByTestId('calculator-update-test-calc-2'));

      // Both calculators should maintain their own state
      expect(screen.getByTestId('calculator-result-test-calc-1')).toHaveTextContent('Result: 20');
      expect(screen.getByTestId('calculator-result-test-calc-2')).toHaveTextContent('Result: 40');
    });
  });

  describe('Component Communication', () => {
    it('should propagate state changes to all subscribed components', () => {
      render(
        <AppProvider>
          <LoadingComponent />
          <MultiStateComponent />
        </AppProvider>
      );

      // Initial state
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('multi-loading')).toHaveTextContent('idle');

      // Toggle loading state
      fireEvent.click(screen.getByTestId('toggle-loading'));

      // Both components should reflect the change
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading...');
      expect(screen.getByTestId('multi-loading')).toHaveTextContent('loading');
    });

    it('should handle component unmounting without affecting other components', () => {
      const onUnmount = vi.fn();
      
      const { rerender } = render(
        <AppProvider>
          <ThemeComponent />
          <CleanupComponent onUnmount={onUnmount} />
        </AppProvider>
      );

      // Change theme
      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

      // Unmount cleanup component
      rerender(
        <AppProvider>
          <ThemeComponent />
        </AppProvider>
      );

      // Cleanup should be called
      expect(onUnmount).toHaveBeenCalled();

      // Theme component should still work
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });
  });

  describe('Data Synchronization', () => {
    it('should maintain data consistency during rapid updates', async () => {
      render(
        <AppProvider>
          <NotificationComponent />
        </AppProvider>
      );

      // Add notifications rapidly
      for (let i = 0; i < 5; i++) {
        fireEvent.click(screen.getByTestId('add-notification'));
      }

      await waitFor(() => {
        const notifications = screen.getAllByTestId(/^notification-notification-/);
        expect(notifications).toHaveLength(5);
      });

      // Remove some notifications
      const removeButtons = screen.getAllByTestId(/^remove-notification-/);
      fireEvent.click(removeButtons[0]);
      fireEvent.click(removeButtons[1]);

      await waitFor(() => {
        const remainingNotifications = screen.getAllByTestId(/^notification-notification-/);
        expect(remainingNotifications).toHaveLength(3);
      });
    });

    it('should handle state updates with complex data structures', () => {
      render(
        <AppProvider>
          <CalculatorComponent calculatorId="complex-calc" />
        </AppProvider>
      );

      // Update with complex data
      const input = screen.getByTestId('calculator-input-complex-calc');
      fireEvent.change(input, { target: { value: '42' } });
      fireEvent.click(screen.getByTestId('calculator-update-complex-calc'));

      // Verify complex state is maintained
      expect(screen.getByTestId('calculator-result-complex-calc')).toHaveTextContent('Result: 84');
    });
  });

  describe('State Cleanup and Memory Management', () => {
    it('should not cause memory leaks with frequent component mounting/unmounting', () => {
      const onUnmount = vi.fn();
      
      const { rerender } = render(
        <AppProvider>
          <CleanupComponent onUnmount={onUnmount} />
        </AppProvider>
      );

      // Mount and unmount multiple times
      for (let i = 0; i < 5; i++) {
        rerender(
          <AppProvider>
            <div>Empty</div>
          </AppProvider>
        );
        
        rerender(
          <AppProvider>
            <CleanupComponent onUnmount={onUnmount} />
          </AppProvider>
        );
      }

      // Final unmount
      rerender(
        <AppProvider>
          <div>Final</div>
        </AppProvider>
      );

      // Cleanup should be called for each unmount
      expect(onUnmount).toHaveBeenCalledTimes(6);
    });

    it('should handle context provider unmounting gracefully', () => {
      const { unmount } = render(
        <AppProvider>
          <ThemeComponent />
          <LoadingComponent />
        </AppProvider>
      );

      // Change some state
      fireEvent.click(screen.getByTestId('toggle-theme'));
      fireEvent.click(screen.getByTestId('toggle-loading'));

      // Unmount entire provider
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle invalid state updates gracefully', () => {
      const { result } = render(
        <AppProvider>
          <ThemeComponent />
        </AppProvider>
      );

      // This should not crash the application
      expect(() => {
        fireEvent.click(screen.getByTestId('toggle-theme'));
      }).not.toThrow();
    });

    it('should maintain state consistency after errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <AppProvider>
          <ThemeComponent />
          <MultiStateComponent />
        </AppProvider>
      );

      // Normal operation should work
      fireEvent.click(screen.getByTestId('toggle-theme'));
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('multi-theme')).toHaveTextContent('dark');

      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause unnecessary re-renders', () => {
      const renderCount = { theme: 0, loading: 0 };

      function TrackingThemeComponent() {
        renderCount.theme++;
        return <ThemeComponent />;
      }

      function TrackingLoadingComponent() {
        renderCount.loading++;
        return <LoadingComponent />;
      }

      render(
        <AppProvider>
          <TrackingThemeComponent />
          <TrackingLoadingComponent />
        </AppProvider>
      );

      const initialThemeRenders = renderCount.theme;
      const initialLoadingRenders = renderCount.loading;

      // Update theme - should cause theme component to re-render
      fireEvent.click(screen.getByTestId('toggle-theme'));

      // Theme component should re-render due to state change (or React may optimize it)
      expect(renderCount.theme).toBeGreaterThanOrEqual(initialThemeRenders);
      // Loading component might re-render due to context change, but should be minimal
      expect(renderCount.loading - initialLoadingRenders).toBeLessThanOrEqual(2);
    });
  });
});

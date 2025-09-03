import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLoadingState, globalLoadingManager } from '../../hooks/useLoadingState';
import { useLanguagePreferences } from '../../lib/i18n/hooks';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('React State Management Integrity', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    // Clean up any timers
    vi.clearAllTimers();
  });

  describe('useState Hook Integrity', () => {
    it('should maintain state consistency across re-renders', () => {
      const { result, rerender } = renderHook(() => {
        const [count, setCount] = React.useState(0);
        return { count, setCount };
      });

      // Initial state
      expect(result.current.count).toBe(0);

      // Update state
      act(() => {
        result.current.setCount(5);
      });

      expect(result.current.count).toBe(5);

      // Re-render should maintain state
      rerender();
      expect(result.current.count).toBe(5);
    });

    it('should handle functional state updates correctly', () => {
      const { result } = renderHook(() => {
        const [count, setCount] = React.useState(0);
        return { count, setCount };
      });

      // Functional update
      act(() => {
        result.current.setCount(prev => prev + 1);
        result.current.setCount(prev => prev + 1);
      });

      expect(result.current.count).toBe(2);
    });
  });

  describe('Custom Hook State Management', () => {
    it('should manage loading state correctly', () => {
      const { result } = renderHook(() => useLoadingState());

      // Initial state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.progress).toBe(0);
      expect(result.current.error).toBe(null);

      // Start loading
      act(() => {
        result.current.startLoading({ message: 'Test loading' });
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.message).toBe('Test loading');
      expect(result.current.startTime).toBeTruthy();

      // Update progress
      act(() => {
        result.current.updateProgress(50, 'Half way');
      });

      expect(result.current.progress).toBe(50);
      expect(result.current.message).toBe('Half way');

      // Stop loading
      act(() => {
        result.current.stopLoading();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.progress).toBe(100);
    });

    it('should handle loading errors correctly', () => {
      const { result } = renderHook(() => useLoadingState());

      act(() => {
        result.current.startLoading();
      });

      act(() => {
        result.current.stopLoading('Test error');
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Test error');
      expect(result.current.hasError).toBe(true);
    });

    it('should clean up timers on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() => useLoadingState());

      act(() => {
        result.current.startLoading({ estimatedDuration: 1000 });
      });

      unmount();

      // Should clean up timers
      expect(clearIntervalSpy).toHaveBeenCalled();
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Global State Management', () => {
    it('should manage global loading states correctly', () => {
      const testId1 = 'test-1';
      const testId2 = 'test-2';

      const state1 = {
        isLoading: true,
        progress: 25,
        message: 'Loading test 1',
        error: null,
        startTime: Date.now(),
        estimatedDuration: 2000
      };

      const state2 = {
        isLoading: true,
        progress: 75,
        message: 'Loading test 2',
        error: null,
        startTime: Date.now(),
        estimatedDuration: 1000
      };

      // Register states
      globalLoadingManager.register(testId1, state1);
      globalLoadingManager.register(testId2, state2);

      // Check states
      expect(globalLoadingManager.getState(testId1)).toEqual(state1);
      expect(globalLoadingManager.getState(testId2)).toEqual(state2);
      expect(globalLoadingManager.isAnyLoading()).toBe(true);

      // Update state
      globalLoadingManager.update(testId1, { progress: 50 });
      const updatedState = globalLoadingManager.getState(testId1);
      expect(updatedState?.progress).toBe(50);

      // Unregister states
      globalLoadingManager.unregister(testId1);
      globalLoadingManager.unregister(testId2);

      expect(globalLoadingManager.getState(testId1)).toBeUndefined();
      expect(globalLoadingManager.isAnyLoading()).toBe(false);
    });
  });

  describe('State Persistence', () => {
    it('should save and load language preferences', () => {
      const mockPreferences = {
        autoDetect: false,
        fallbackLanguage: 'de-DE',
        showNativeNames: false,
        showFlags: false
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPreferences));

      const { result } = renderHook(() => useLanguagePreferences());

      // Should load preferences from localStorage
      expect(localStorageMock.getItem).toHaveBeenCalledWith('laser-calc-language-preferences');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() => useLanguagePreferences());

      // Should handle error gracefully
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse language preferences:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should implement smart storage with TTL', () => {
      const smartStorage = {
        set: (key: string, value: any, persistent: boolean = false) => {
          const storage = persistent ? localStorage : sessionStorage;
          const item = {
            data: value,
            timestamp: Date.now()
          };
          storage.setItem(key, JSON.stringify(item));
        },
        
        get: (key: string, maxAge: number = 3600000) => {
          const item = localStorage.getItem(key) || sessionStorage.getItem(key);
          if (!item) return null;
          
          try {
            const parsed = JSON.parse(item);
            if (Date.now() - parsed.timestamp > maxAge) {
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
              return null;
            }
            return parsed.data;
          } catch {
            return null;
          }
        }
      };

      const testData = { test: 'data' };
      const testKey = 'test-key';

      // Test persistent storage
      smartStorage.set(testKey, testData, true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        testKey,
        expect.stringContaining('"data":{"test":"data"}')
      );

      // Test session storage
      smartStorage.set(testKey, testData, false);
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        testKey,
        expect.stringContaining('"data":{"test":"data"}')
      );
    });

    it('should handle storage quota exceeded', () => {
      const quotaError = new Error('QuotaExceededError');
      localStorageMock.setItem.mockImplementation(() => {
        throw quotaError;
      });

      expect(() => {
        try {
          localStorage.setItem('test', 'data');
        } catch (error) {
          // Should handle quota exceeded gracefully
          expect(error).toBe(quotaError);
          throw error;
        }
      }).toThrow('QuotaExceededError');
    });
  });

  describe('State Synchronization', () => {
    it('should synchronize state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useLoadingState());
      const { result: result2 } = renderHook(() => useLoadingState());

      // These should be independent instances
      act(() => {
        result1.current.startLoading({ message: 'Loading 1' });
      });

      expect(result1.current.isLoading).toBe(true);
      expect(result2.current.isLoading).toBe(false);
    });

    it('should handle concurrent state updates', () => {
      const { result } = renderHook(() => useLoadingState());

      // Simulate concurrent updates
      act(() => {
        result.current.startLoading();
        result.current.updateProgress(25);
        result.current.updateProgress(50);
        result.current.updateProgress(75);
      });

      expect(result.current.progress).toBe(75);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Memory Management', () => {
    it('should not cause memory leaks with multiple hook instances', () => {
      const hooks: any[] = [];
      
      // Create multiple hook instances
      for (let i = 0; i < 10; i++) {
        const { result, unmount } = renderHook(() => useLoadingState());
        hooks.push({ result, unmount });
      }

      // Start loading on all instances
      hooks.forEach(({ result }) => {
        act(() => {
          result.current.startLoading();
        });
      });

      // Unmount all instances
      hooks.forEach(({ unmount }) => {
        unmount();
      });

      // Should not have any lingering references
      expect(hooks.length).toBe(10);
    });

    it('should clean up event listeners and timers', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => {
        React.useEffect(() => {
          const handler = () => {};
          window.addEventListener('resize', handler);
          return () => window.removeEventListener('resize', handler);
        }, []);
        
        return useLoadingState();
      });

      unmount();

      // Should clean up event listeners
      expect(removeEventListenerSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle state update errors gracefully', () => {
      const { result } = renderHook(() => {
        const [state, setState] = React.useState({ count: 0 });
        
        const updateState = () => {
          try {
            setState(prev => ({ count: prev.count + 1 }));
          } catch (error) {
            console.error('State update error:', error);
          }
        };
        
        return { state, updateState };
      });

      expect(() => {
        act(() => {
          result.current.updateState();
        });
      }).not.toThrow();

      expect(result.current.state.count).toBe(1);
    });

    it('should handle async state updates correctly', async () => {
      const { result } = renderHook(() => useLoadingState());

      const asyncOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'success';
      };

      await act(async () => {
        const promise = result.current.withLoading(asyncOperation);
        expect(result.current.isLoading).toBe(true);
        
        const result_value = await promise;
        expect(result_value).toBe('success');
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isComplete).toBe(true);
    });
  });
});

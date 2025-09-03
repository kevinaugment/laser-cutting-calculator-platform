/**
 * useLocalStorage Hook
 * Generic React hook for localStorage operations with error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { UseLocalStorageState, StorageOperationResult } from '../types/preset';
import { isLocalStorageAvailable } from '../utils/storage';

export interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
  onError?: (error: string) => void;
  syncAcrossTabs?: boolean;
}

/**
 * Custom hook for localStorage operations
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): [
  UseLocalStorageState<T>,
  {
    setValue: (value: T | ((prev: T | null) => T)) => Promise<StorageOperationResult<void>>;
    removeValue: () => Promise<StorageOperationResult<void>>;
    refresh: () => void;
  }
] {
  const {
    defaultValue,
    serializer = {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
    onError,
    syncAcrossTabs = true,
  } = options;

  const [state, setState] = useState<UseLocalStorageState<T>>({
    value: null,
    loading: true,
    error: null,
  });

  // Read value from localStorage
  const readValue = useCallback((): T | null => {
    if (!isLocalStorageAvailable()) {
      return defaultValue ?? null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return serializer.parse(item);
    } catch (error) {
      const errorMessage = `Failed to parse localStorage value for key "${key}": ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
      console.warn(errorMessage);
      onError?.(errorMessage);
      return defaultValue ?? null;
    }
  }, [key, defaultValue, serializer, onError]);

  // Initialize value
  useEffect(() => {
    try {
      const value = readValue();
      setState({
        value,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = `Failed to initialize localStorage value for key "${key}": ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
      setState({
        value: defaultValue ?? null,
        loading: false,
        error: errorMessage,
      });
      onError?.(errorMessage);
    }
  }, [key, readValue, defaultValue, onError]);

  // Set value in localStorage
  const setValue = useCallback(
    async (value: T | ((prev: T | null) => T)): Promise<StorageOperationResult<void>> => {
      try {
        if (!isLocalStorageAvailable()) {
          const error = 'localStorage is not available';
          setState(prev => ({ ...prev, error }));
          onError?.(error);
          return { success: false, error };
        }

        const newValue = typeof value === 'function' 
          ? (value as (prev: T | null) => T)(state.value)
          : value;

        const serializedValue = serializer.stringify(newValue);
        localStorage.setItem(key, serializedValue);

        setState({
          value: newValue,
          loading: false,
          error: null,
        });

        return { success: true };
      } catch (error) {
        const errorMessage = `Failed to set localStorage value for key "${key}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        
        setState(prev => ({ ...prev, error: errorMessage }));
        onError?.(errorMessage);
        
        return { success: false, error: errorMessage };
      }
    },
    [key, state.value, serializer, onError]
  );

  // Remove value from localStorage
  const removeValue = useCallback(
    async (): Promise<StorageOperationResult<void>> => {
      try {
        if (!isLocalStorageAvailable()) {
          const error = 'localStorage is not available';
          setState(prev => ({ ...prev, error }));
          onError?.(error);
          return { success: false, error };
        }

        localStorage.removeItem(key);
        
        setState({
          value: defaultValue ?? null,
          loading: false,
          error: null,
        });

        return { success: true };
      } catch (error) {
        const errorMessage = `Failed to remove localStorage value for key "${key}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        
        setState(prev => ({ ...prev, error: errorMessage }));
        onError?.(errorMessage);
        
        return { success: false, error: errorMessage };
      }
    },
    [key, defaultValue, onError]
  );

  // Refresh value from localStorage
  const refresh = useCallback(() => {
    try {
      const value = readValue();
      setState({
        value,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = `Failed to refresh localStorage value for key "${key}": ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
      setState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [key, readValue, onError]);

  // Listen for storage changes across tabs
  useEffect(() => {
    if (!syncAcrossTabs || !isLocalStorageAvailable()) {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = serializer.parse(e.newValue);
          setState(prev => ({
            ...prev,
            value: newValue,
            error: null,
          }));
        } catch (error) {
          const errorMessage = `Failed to sync localStorage change for key "${key}": ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
          setState(prev => ({ ...prev, error: errorMessage }));
          onError?.(errorMessage);
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed
        setState(prev => ({
          ...prev,
          value: defaultValue ?? null,
          error: null,
        }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, serializer, defaultValue, syncAcrossTabs, onError]);

  return [
    state,
    {
      setValue,
      removeValue,
      refresh,
    },
  ];
}

// Specialized hook for JSON data
export function useLocalStorageJSON<T>(
  key: string,
  options: Omit<UseLocalStorageOptions<T>, 'serializer'> = {}
) {
  return useLocalStorage(key, {
    ...options,
    serializer: {
      parse: JSON.parse,
      stringify: JSON.stringify,
    },
  });
}

// Specialized hook for string data
export function useLocalStorageString(
  key: string,
  options: Omit<UseLocalStorageOptions<string>, 'serializer'> = {}
) {
  return useLocalStorage(key, {
    ...options,
    serializer: {
      parse: (value: string) => value,
      stringify: (value: string) => value,
    },
  });
}

// Specialized hook for boolean data
export function useLocalStorageBoolean(
  key: string,
  options: Omit<UseLocalStorageOptions<boolean>, 'serializer'> = {}
) {
  return useLocalStorage(key, {
    ...options,
    serializer: {
      parse: (value: string) => value === 'true',
      stringify: (value: boolean) => value.toString(),
    },
  });
}

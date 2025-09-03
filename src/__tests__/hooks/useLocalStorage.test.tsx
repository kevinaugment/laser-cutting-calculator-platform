/**
 * useLocalStorage Hook Tests
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useLocalStorage, useLocalStorageJSON } from '../../hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('initializes with default value when localStorage is empty', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { defaultValue: 'default' })
    );

    // Wait for initialization
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].value).toBe('default');
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].error).toBe(null);
  });

  it('loads existing value from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('"existing value"');

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { defaultValue: 'default' })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].value).toBe('existing value');
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].error).toBe(null);
  });

  it('sets value in localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { defaultValue: 'default' })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      const setResult = await result.current[1].setValue('new value');
      expect(setResult.success).toBe(true);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new value"');
    expect(result.current[0].value).toBe('new value');
  });

  it('removes value from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('"existing value"');

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { defaultValue: 'default' })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      const removeResult = await result.current[1].removeValue();
      expect(removeResult.success).toBe(true);
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
    expect(result.current[0].value).toBe('default');
  });

  it('handles localStorage errors gracefully', async () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const onError = vi.fn();
    const { result } = renderHook(() => 
      useLocalStorage('test-key', { defaultValue: 'default', onError })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].value).toBe('default');
    expect(result.current[0].error).toContain('localStorage error');
    expect(onError).toHaveBeenCalled();
  });

  it('handles JSON parsing errors', async () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    const onError = vi.fn();
    const { result } = renderHook(() => 
      useLocalStorage('test-key', { defaultValue: 'default', onError })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].value).toBe('default');
    expect(result.current[0].error).toContain('Failed to parse');
    expect(onError).toHaveBeenCalled();
  });

  it('updates value with function', async () => {
    localStorageMock.getItem.mockReturnValue('5');

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { 
        defaultValue: 0,
        serializer: {
          parse: (value: string) => parseInt(value, 10),
          stringify: (value: number) => value.toString(),
        }
      })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].value).toBe(5);

    await act(async () => {
      const setResult = await result.current[1].setValue(prev => (prev || 0) + 1);
      expect(setResult.success).toBe(true);
    });

    expect(result.current[0].value).toBe(6);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '6');
  });

  it('refreshes value from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('"initial"');

    const { result } = renderHook(() => 
      useLocalStorage('test-key')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].value).toBe('initial');

    // Simulate external change
    localStorageMock.getItem.mockReturnValue('"updated"');

    act(() => {
      result.current[1].refresh();
    });

    expect(result.current[0].value).toBe('updated');
  });
});

describe('useLocalStorageJSON', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  it('handles JSON objects correctly', async () => {
    const testObject = { name: 'test', value: 42 };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(testObject));

    const { result } = renderHook(() => 
      useLocalStorageJSON('test-key')
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current[0].value).toEqual(testObject);

    const newObject = { name: 'updated', value: 100 };
    await act(async () => {
      await result.current[1].setValue(newObject);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(newObject));
    expect(result.current[0].value).toEqual(newObject);
  });
});

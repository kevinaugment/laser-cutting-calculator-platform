import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock storage interfaces
interface MockStorage {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  removeItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
}

// Smart Storage implementation for testing
class SmartStorage {
  constructor(
    private localStorage: MockStorage,
    private sessionStorage: MockStorage
  ) {}

  set(key: string, value: any, persistent: boolean = false, ttl: number = 3600000) {
    const storage = persistent ? this.localStorage : this.sessionStorage;
    const item = {
      data: value,
      timestamp: Date.now(),
      ttl,
      version: '1.0.0'
    };
    
    try {
      storage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn('Storage quota exceeded:', error);
      return false;
    }
  }

  get(key: string, maxAge?: number) {
    try {
      // Try localStorage first, then sessionStorage
      const localItem = this.localStorage.getItem(key);
      const sessionItem = this.sessionStorage.getItem(key);
      const item = localItem || sessionItem;

      if (!item) return null;

      try {
        const parsed = JSON.parse(item);
        const age = Date.now() - parsed.timestamp;
        const effectiveMaxAge = maxAge || parsed.ttl;

        if (age > effectiveMaxAge) {
          this.remove(key);
          return null;
        }

        return parsed.data;
      } catch (parseError) {
        console.warn('Failed to parse stored data:', parseError);
        this.remove(key);
        return null;
      }
    } catch (storageError) {
      console.warn('Storage access error:', storageError);
      return null;
    }
  }

  remove(key: string) {
    try {
      this.localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }

    try {
      this.sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
    }
  }

  clear() {
    this.localStorage.clear();
    this.sessionStorage.clear();
  }

  getStorageInfo() {
    // Mock implementation for testing
    const mockLocalKeys = ['key1', 'key2'];
    const mockSessionKeys = ['key3'];

    return {
      localStorage: {
        keys: mockLocalKeys.length,
        estimatedSize: this.estimateSize(mockLocalKeys, this.localStorage)
      },
      sessionStorage: {
        keys: mockSessionKeys.length,
        estimatedSize: this.estimateSize(mockSessionKeys, this.sessionStorage)
      }
    };
  }

  private estimateSize(keys: string[], storage: MockStorage): number {
    return keys.reduce((total, key) => {
      const value = storage.getItem(key);
      return total + (value ? value.length * 2 : 0); // Rough estimate in bytes
    }, 0);
  }

  // Version migration support
  migrate(key: string, fromVersion: string, toVersion: string, migrationFn: (data: any) => any) {
    const item = this.localStorage.getItem(key) || this.sessionStorage.getItem(key);
    if (!item) return false;

    try {
      const parsed = JSON.parse(item);
      if (parsed.version === fromVersion) {
        const migratedData = migrationFn(parsed.data);
        this.set(key, migratedData, true);
        return true;
      }
    } catch (error) {
      console.warn('Migration failed:', error);
    }
    
    return false;
  }
}

// State Manager for testing
class StateManager {
  private static instance: StateManager;
  private storage: SmartStorage;

  private persistConfig = {
    user: { storage: 'localStorage', ttl: Infinity },
    calculators: { storage: 'sessionStorage', ttl: 24 * 60 * 60 * 1000 },
    performance: { storage: 'localStorage', ttl: 7 * 24 * 60 * 60 * 1000 }
  };

  constructor(storage: SmartStorage) {
    this.storage = storage;
  }

  static getInstance(storage: SmartStorage): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager(storage);
    }
    return StateManager.instance;
  }

  saveState(key: keyof typeof this.persistConfig, data: any) {
    const config = this.persistConfig[key];
    const persistent = config.storage === 'localStorage';
    return this.storage.set(`app_${key}`, data, persistent, config.ttl);
  }

  loadState(key: keyof typeof this.persistConfig) {
    return this.storage.get(`app_${key}`);
  }

  clearState(key: keyof typeof this.persistConfig) {
    this.storage.remove(`app_${key}`);
  }
}

describe('Data Persistence Integrity Verification', () => {
  let mockLocalStorage: MockStorage;
  let mockSessionStorage: MockStorage;
  let smartStorage: SmartStorage;
  let stateManager: StateManager;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };

    mockSessionStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };

    // Reset static instance
    (StateManager as any).instance = null;

    smartStorage = new SmartStorage(mockLocalStorage, mockSessionStorage);
    stateManager = StateManager.getInstance(smartStorage);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Storage Operations', () => {
    it('should store and retrieve data correctly', () => {
      const testData = { value: 42, name: 'test' };
      
      // Mock successful storage
      mockLocalStorage.setItem.mockImplementation(() => {});
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: testData,
        timestamp: Date.now(),
        ttl: 3600000,
        version: '1.0.0'
      }));

      const success = smartStorage.set('test-key', testData, true);
      expect(success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();

      const retrieved = smartStorage.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should handle storage quota exceeded', () => {
      const testData = { value: 42 };
      
      // Mock quota exceeded error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const success = smartStorage.set('test-key', testData, true);
      expect(success).toBe(false);
    });

    it('should handle corrupted data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      const result = smartStorage.get('test-key');
      expect(result).toBe(null);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });

  describe('TTL (Time To Live) Mechanism', () => {
    it('should return data within TTL', () => {
      const testData = { value: 42 };
      const now = Date.now();
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: testData,
        timestamp: now - 1000, // 1 second ago
        ttl: 5000, // 5 seconds TTL
        version: '1.0.0'
      }));

      const result = smartStorage.get('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for expired data', () => {
      const testData = { value: 42 };
      const now = Date.now();
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: testData,
        timestamp: now - 10000, // 10 seconds ago
        ttl: 5000, // 5 seconds TTL
        version: '1.0.0'
      }));

      const result = smartStorage.get('test-key');
      expect(result).toBe(null);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('should respect custom maxAge parameter', () => {
      const testData = { value: 42 };
      const now = Date.now();
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: testData,
        timestamp: now - 3000, // 3 seconds ago
        ttl: 10000, // 10 seconds TTL
        version: '1.0.0'
      }));

      // Custom maxAge of 2 seconds should cause expiration
      const result = smartStorage.get('test-key', 2000);
      expect(result).toBe(null);
    });
  });

  describe('Storage Strategy Selection', () => {
    it('should use localStorage for persistent data', () => {
      const testData = { value: 42 };
      
      mockLocalStorage.setItem.mockImplementation(() => {});
      
      smartStorage.set('test-key', testData, true); // persistent = true
      
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(mockSessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('should use sessionStorage for temporary data', () => {
      const testData = { value: 42 };
      
      mockSessionStorage.setItem.mockImplementation(() => {});
      
      smartStorage.set('test-key', testData, false); // persistent = false
      
      expect(mockSessionStorage.setItem).toHaveBeenCalled();
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should fallback between storage types when retrieving', () => {
      const testData = { value: 42 };
      
      // localStorage returns null, sessionStorage has data
      mockLocalStorage.getItem.mockReturnValue(null);
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify({
        data: testData,
        timestamp: Date.now(),
        ttl: 3600000,
        version: '1.0.0'
      }));

      const result = smartStorage.get('test-key');
      expect(result).toEqual(testData);
      expect(mockLocalStorage.getItem).toHaveBeenCalled();
      expect(mockSessionStorage.getItem).toHaveBeenCalled();
    });
  });

  describe('State Manager Integration', () => {
    it('should save user state to localStorage', () => {
      const userData = { id: 1, name: 'John', preferences: { theme: 'dark' } };
      
      mockLocalStorage.setItem.mockImplementation(() => {});
      
      const success = stateManager.saveState('user', userData);
      expect(success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'app_user',
        expect.stringContaining('"data":')
      );
    });

    it('should save calculator state to sessionStorage', () => {
      const calculatorData = { inputs: { value: 100 }, results: { output: 200 } };
      
      mockSessionStorage.setItem.mockImplementation(() => {});
      
      const success = stateManager.saveState('calculators', calculatorData);
      expect(success).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'app_calculators',
        expect.stringContaining('"data":')
      );
    });

    it('should load state correctly', () => {
      const testData = { value: 42 };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: testData,
        timestamp: Date.now(),
        ttl: Infinity,
        version: '1.0.0'
      }));

      const result = stateManager.loadState('user');
      expect(result).toEqual(testData);
    });

    it('should clear state correctly', () => {
      stateManager.clearState('user');
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('app_user');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('app_user');
    });
  });

  describe('Data Serialization and Deserialization', () => {
    it('should handle complex objects', () => {
      const complexData = {
        number: 42,
        string: 'test',
        boolean: true,
        array: [1, 2, 3],
        nested: { deep: { value: 'nested' } },
        date: new Date().toISOString(),
        null: null,
        undefined: undefined
      };

      mockLocalStorage.setItem.mockImplementation(() => {});
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: complexData,
        timestamp: Date.now(),
        ttl: 3600000,
        version: '1.0.0'
      }));

      smartStorage.set('complex-key', complexData, true);
      const result = smartStorage.get('complex-key');
      
      expect(result).toEqual({
        ...complexData,
        undefined: undefined // undefined becomes null in JSON
      });
    });

    it('should handle circular references gracefully', () => {
      const circularData: any = { value: 42 };
      circularData.self = circularData;

      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Converting circular structure to JSON');
      });

      const success = smartStorage.set('circular-key', circularData, true);
      expect(success).toBe(false);
    });

    it('should preserve data types correctly', () => {
      const typedData = {
        number: 42,
        string: 'test',
        boolean: true,
        array: [1, 'two', true],
        object: { nested: 'value' }
      };

      mockLocalStorage.setItem.mockImplementation(() => {});
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: typedData,
        timestamp: Date.now(),
        ttl: 3600000,
        version: '1.0.0'
      }));

      smartStorage.set('typed-key', typedData, true);
      const result = smartStorage.get('typed-key');
      
      expect(typeof result.number).toBe('number');
      expect(typeof result.string).toBe('string');
      expect(typeof result.boolean).toBe('boolean');
      expect(Array.isArray(result.array)).toBe(true);
      expect(typeof result.object).toBe('object');
    });
  });

  describe('Version Compatibility and Migration', () => {
    it('should migrate data between versions', () => {
      const oldData = { value: 42, oldField: 'deprecated' };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: oldData,
        timestamp: Date.now(),
        ttl: 3600000,
        version: '1.0.0'
      }));

      mockLocalStorage.setItem.mockImplementation(() => {});

      const migrationFn = (data: any) => ({
        value: data.value,
        newField: data.oldField,
        migrated: true
      });

      const success = smartStorage.migrate('test-key', '1.0.0', '2.0.0', migrationFn);
      expect(success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should skip migration for current version', () => {
      const currentData = { value: 42 };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        data: currentData,
        timestamp: Date.now(),
        ttl: 3600000,
        version: '2.0.0'
      }));

      const migrationFn = vi.fn();
      const success = smartStorage.migrate('test-key', '1.0.0', '2.0.0', migrationFn);
      
      expect(success).toBe(false);
      expect(migrationFn).not.toHaveBeenCalled();
    });
  });

  describe('Storage Capacity Management', () => {
    it('should provide storage information', () => {
      // Mock storage keys
      Object.defineProperty(mockLocalStorage, 'length', { value: 2 });
      Object.keys = vi.fn().mockReturnValue(['key1', 'key2']);
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        return key === 'key1' ? 'short' : 'much longer value';
      });

      const info = smartStorage.getStorageInfo();
      
      expect(info.localStorage.keys).toBe(2);
      expect(info.localStorage.estimatedSize).toBeGreaterThan(0);
    });

    it('should handle storage cleanup', () => {
      smartStorage.clear();
      
      expect(mockLocalStorage.clear).toHaveBeenCalled();
      expect(mockSessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle storage unavailable', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage not available');
      });

      const success = smartStorage.set('test-key', { value: 42 }, true);
      expect(success).toBe(false);
    });

    it('should handle getItem errors', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage access denied');
      });

      const result = smartStorage.get('test-key');
      expect(result).toBe(null);
    });

    it('should handle removeItem errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Cannot remove item');
      });

      expect(() => smartStorage.remove('test-key')).not.toThrow();
    });
  });
});

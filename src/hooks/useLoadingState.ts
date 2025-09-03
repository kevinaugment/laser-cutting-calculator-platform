import { useState, useCallback, useRef, useEffect } from 'react';

// 加载状态类型定义
export interface LoadingState {
  isLoading: boolean;
  progress: number;
  message: string;
  error: string | null;
  startTime: number | null;
  estimatedDuration: number | null;
}

// 加载配置选项
export interface LoadingOptions {
  message?: string;
  showProgress?: boolean;
  estimatedDuration?: number;
  minLoadingTime?: number;
  maxLoadingTime?: number;
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

// 默认配置
const DEFAULT_OPTIONS: LoadingOptions = {
  message: 'Loading...',
  showProgress: true,
  estimatedDuration: 2000,
  minLoadingTime: 500,
  maxLoadingTime: 30000
};

// 加载状态管理Hook
export const useLoadingState = (initialOptions: LoadingOptions = {}) => {
  const options = { ...DEFAULT_OPTIONS, ...initialOptions };
  
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    message: options.message || 'Loading...',
    error: null,
    startTime: null,
    estimatedDuration: options.estimatedDuration || 2000
  });
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 清理定时器
  const clearTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  
  // 开始加载
  const startLoading = useCallback((loadingOptions?: Partial<LoadingOptions>) => {
    const currentOptions = { ...options, ...loadingOptions };
    const startTime = Date.now();
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      progress: 0,
      message: currentOptions.message || 'Loading...',
      error: null,
      startTime,
      estimatedDuration: currentOptions.estimatedDuration || 2000
    }));
    
    // 触发开始回调
    currentOptions.onStart?.();
    
    // 设置进度更新
    if (currentOptions.showProgress && currentOptions.estimatedDuration) {
      const updateInterval = Math.max(50, currentOptions.estimatedDuration / 100);
      const progressStep = 100 / (currentOptions.estimatedDuration / updateInterval);
      
      progressIntervalRef.current = setInterval(() => {
        setState(prev => {
          const elapsed = Date.now() - startTime;
          const estimatedProgress = Math.min(95, (elapsed / (currentOptions.estimatedDuration || 2000)) * 100);
          const newProgress = Math.min(95, prev.progress + progressStep);
          const finalProgress = Math.max(estimatedProgress, newProgress);
          
          // 触发进度回调
          currentOptions.onProgress?.(finalProgress);
          
          return {
            ...prev,
            progress: finalProgress
          };
        });
      }, updateInterval);
    }
    
    // 设置最大加载时间超时
    if (currentOptions.maxLoadingTime) {
      timeoutRef.current = setTimeout(() => {
        stopLoading('Loading timeout - operation took too long');
      }, currentOptions.maxLoadingTime);
    }
  }, [options]);
  
  // 停止加载
  const stopLoading = useCallback((error?: string) => {
    clearTimers();
    
    const endTime = Date.now();
    const startTime = state.startTime || endTime;
    const actualDuration = endTime - startTime;
    const minLoadingTime = options.minLoadingTime || 500;
    
    // 确保最小加载时间
    const remainingTime = Math.max(0, minLoadingTime - actualDuration);
    
    const finishLoading = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        progress: error ? prev.progress : 100,
        error: error || null
      }));
      
      if (error) {
        options.onError?.(error);
      } else {
        options.onComplete?.();
      }
    };
    
    if (remainingTime > 0) {
      setTimeout(finishLoading, remainingTime);
    } else {
      finishLoading();
    }
  }, [state.startTime, options, clearTimers]);
  
  // 更新进度
  const updateProgress = useCallback((progress: number, message?: string) => {
    setState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
      message: message || prev.message
    }));
    
    options.onProgress?.(progress);
  }, [options]);
  
  // 更新消息
  const updateMessage = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      message
    }));
  }, []);
  
  // 重置状态
  const reset = useCallback(() => {
    clearTimers();
    setState({
      isLoading: false,
      progress: 0,
      message: options.message || 'Loading...',
      error: null,
      startTime: null,
      estimatedDuration: options.estimatedDuration || 2000
    });
  }, [options, clearTimers]);
  
  // 包装异步函数
  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    loadingOptions?: Partial<LoadingOptions>
  ): Promise<T> => {
    try {
      startLoading(loadingOptions);
      const result = await asyncFn();
      stopLoading();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      stopLoading(errorMessage);
      throw error;
    }
  }, [startLoading, stopLoading]);
  
  // 清理副作用
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);
  
  return {
    // 状态
    ...state,
    
    // 计算属性
    isComplete: state.progress >= 100 && !state.isLoading,
    hasError: !!state.error,
    elapsedTime: state.startTime ? Date.now() - state.startTime : 0,
    
    // 方法
    startLoading,
    stopLoading,
    updateProgress,
    updateMessage,
    reset,
    withLoading
  };
};

// 全局加载状态管理
class GlobalLoadingManager {
  private loadingStates = new Map<string, LoadingState>();
  private listeners = new Set<(states: Map<string, LoadingState>) => void>();
  
  register(id: string, state: LoadingState) {
    this.loadingStates.set(id, state);
    this.notifyListeners();
  }
  
  unregister(id: string) {
    this.loadingStates.delete(id);
    this.notifyListeners();
  }
  
  update(id: string, state: Partial<LoadingState>) {
    const currentState = this.loadingStates.get(id);
    if (currentState) {
      this.loadingStates.set(id, { ...currentState, ...state });
      this.notifyListeners();
    }
  }
  
  getState(id: string): LoadingState | undefined {
    return this.loadingStates.get(id);
  }
  
  getAllStates(): Map<string, LoadingState> {
    return new Map(this.loadingStates);
  }
  
  isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(state => state.isLoading);
  }
  
  subscribe(listener: (states: Map<string, LoadingState>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getAllStates()));
  }
}

export const globalLoadingManager = new GlobalLoadingManager();

// 全局加载状态Hook
export const useGlobalLoadingState = () => {
  const [states, setStates] = useState<Map<string, LoadingState>>(new Map());
  
  useEffect(() => {
    const unsubscribe = globalLoadingManager.subscribe(setStates);
    return unsubscribe;
  }, []);
  
  return {
    states,
    isAnyLoading: globalLoadingManager.isAnyLoading(),
    getState: (id: string) => globalLoadingManager.getState(id)
  };
};

export default useLoadingState;

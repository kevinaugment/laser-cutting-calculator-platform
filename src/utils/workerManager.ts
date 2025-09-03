// Web Worker管理器 - 协调主线程和Worker通信

interface WorkerMessage {
  type: string;
  id: string;
  calculatorType: string;
  inputs: any;
  options?: any;
}

interface WorkerResponse {
  type: string;
  id: string;
  result?: any;
  error?: any;
  timestamp: number;
}

interface PendingTask {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  startTime: number;
  calculatorType: string;
}

/**
 * Web Worker管理器
 * 负责管理计算Worker的生命周期和任务调度
 */
export class WorkerManager {
  private worker: Worker | null = null;
  private pendingTasks = new Map<string, PendingTask>();
  private isInitialized = false;
  private taskCounter = 0;
  private stats = {
    tasksCompleted: 0,
    tasksErrored: 0,
    totalComputeTime: 0,
    averageComputeTime: 0
  };

  constructor() {
    this.initializeWorker();
  }

  /**
   * 初始化Worker
   */
  private initializeWorker(): void {
    try {
      this.worker = new Worker('/workers/calculation-worker.js');
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
      this.isInitialized = true;
      console.log('✅ Calculation Worker initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Worker:', error);
      this.isInitialized = false;
    }
  }

  /**
   * 处理Worker消息
   */
  private handleWorkerMessage(event: MessageEvent<WorkerResponse>): void {
    const { type, id, result, error, timestamp } = event.data;
    const task = this.pendingTasks.get(id);

    if (!task) {
      console.warn(`⚠️ Received response for unknown task: ${id}`);
      return;
    }

    const computeTime = timestamp - task.startTime;
    this.updateStats(computeTime, type === 'ERROR');

    if (type === 'RESULT') {
      task.resolve(result);
      console.log(`✅ Task ${id} completed in ${computeTime}ms`);
    } else if (type === 'ERROR') {
      task.reject(new Error(error.message));
      console.error(`❌ Task ${id} failed:`, error.message);
    }

    this.pendingTasks.delete(id);
  }

  /**
   * 处理Worker错误
   */
  private handleWorkerError(error: ErrorEvent): void {
    console.error('❌ Worker error:', error);
    
    // 重新初始化Worker
    this.terminateWorker();
    setTimeout(() => this.initializeWorker(), 1000);
  }

  /**
   * 执行计算任务
   */
  async calculate(calculatorType: string, inputs: any): Promise<any> {
    if (!this.isInitialized || !this.worker) {
      throw new Error('Worker not initialized');
    }

    const taskId = this.generateTaskId();
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      // 设置超时
      const timeout = setTimeout(() => {
        this.pendingTasks.delete(taskId);
        reject(new Error('Calculation timeout'));
      }, 30000); // 30秒超时

      this.pendingTasks.set(taskId, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        startTime,
        calculatorType
      });

      // 发送任务到Worker
      this.worker!.postMessage({
        type: 'CALCULATE',
        id: taskId,
        calculatorType,
        inputs
      });
    });
  }

  /**
   * 批量计算
   */
  async batchCalculate(calculatorType: string, inputsArray: any[]): Promise<any[]> {
    if (!this.isInitialized || !this.worker) {
      throw new Error('Worker not initialized');
    }

    const taskId = this.generateTaskId();
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingTasks.delete(taskId);
        reject(new Error('Batch calculation timeout'));
      }, 60000); // 60秒超时

      this.pendingTasks.set(taskId, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        startTime,
        calculatorType
      });

      this.worker!.postMessage({
        type: 'BATCH_CALCULATE',
        id: taskId,
        calculatorType,
        inputs: inputsArray
      });
    });
  }

  /**
   * 敏感度分析
   */
  async performSensitivityAnalysis(
    calculatorType: string,
    baseInputs: any,
    variableRanges: Record<string, { min: number; max: number }>
  ): Promise<any> {
    if (!this.isInitialized || !this.worker) {
      throw new Error('Worker not initialized');
    }

    const taskId = this.generateTaskId();
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingTasks.delete(taskId);
        reject(new Error('Sensitivity analysis timeout'));
      }, 45000); // 45秒超时

      this.pendingTasks.set(taskId, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        startTime,
        calculatorType
      });

      this.worker!.postMessage({
        type: 'SENSITIVITY_ANALYSIS',
        id: taskId,
        calculatorType,
        inputs: baseInputs,
        options: { variableRanges }
      });
    });
  }

  /**
   * 检查是否应该使用Worker
   */
  shouldUseWorker(calculatorType: string, inputs: any): boolean {
    // 复杂计算使用Worker
    const complexCalculators = [
      'material-nesting-optimizer',
      'batch-processing',
      'production-capacity',
      'job-queue-optimizer'
    ];

    if (complexCalculators.includes(calculatorType)) {
      return true;
    }

    // 大数据量使用Worker
    if (inputs.quantity && inputs.quantity > 100) {
      return true;
    }

    // 敏感度分析使用Worker
    if (inputs.performSensitivityAnalysis) {
      return true;
    }

    return false;
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      ...this.stats,
      pendingTasks: this.pendingTasks.size,
      isInitialized: this.isInitialized
    };
  }

  /**
   * 终止Worker
   */
  terminateWorker(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    // 拒绝所有待处理的任务
    for (const [id, task] of this.pendingTasks.entries()) {
      task.reject(new Error('Worker terminated'));
    }
    
    this.pendingTasks.clear();
    this.isInitialized = false;
    console.log('🛑 Worker terminated');
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `task_${++this.taskCounter}_${Date.now()}`;
  }

  /**
   * 更新统计信息
   */
  private updateStats(computeTime: number, isError: boolean): void {
    if (isError) {
      this.stats.tasksErrored++;
    } else {
      this.stats.tasksCompleted++;
      this.stats.totalComputeTime += computeTime;
      this.stats.averageComputeTime = this.stats.totalComputeTime / this.stats.tasksCompleted;
    }
  }
}

// 全局Worker管理器实例
export const globalWorkerManager = new WorkerManager();

/**
 * 智能计算函数 - 自动选择主线程或Worker执行
 */
export async function smartCalculate(
  calculatorType: string,
  inputs: any,
  fallbackFn: () => Promise<any> | any
): Promise<any> {
  // 检查是否应该使用Worker
  if (globalWorkerManager.shouldUseWorker(calculatorType, inputs)) {
    try {
      console.log(`🔄 Using Worker for ${calculatorType}`);
      return await globalWorkerManager.calculate(calculatorType, inputs);
    } catch (error) {
      console.warn(`⚠️ Worker failed for ${calculatorType}, falling back to main thread:`, error);
      return await fallbackFn();
    }
  } else {
    console.log(`⚡ Using main thread for ${calculatorType}`);
    return await fallbackFn();
  }
}

/**
 * 性能监控Hook
 */
export function useWorkerPerformance() {
  const [stats, setStats] = React.useState(globalWorkerManager.getStats());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(globalWorkerManager.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}

// 清理函数 - 在应用卸载时调用
export function cleanupWorkers(): void {
  globalWorkerManager.terminateWorker();
}

// 在页面卸载时自动清理
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupWorkers);
}

export default WorkerManager;

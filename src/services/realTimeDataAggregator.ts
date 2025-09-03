/**
 * Real-Time Data Aggregator Service
 * Aggregates data from all Phase 3 calculators for unified monitoring
 */

export interface RealTimeDataAggregator {
  aggregatePhase3Data(): Promise<AggregatedData>;
  subscribeToUpdates(callback: (data: AggregatedData) => void): () => void;
  getCalculatorStatus(): CalculatorStatusMap;
  generateAlerts(thresholds: AlertThresholds): Alert[];
  getPerformanceMetrics(): PerformanceMetrics;
}

export interface AggregatedData {
  timestamp: Date;
  totalCost: number;
  hourlyRate: number;
  dailyTotal: number;
  monthlyProjected: number;
  efficiency: number;
  utilization: number;
  costBreakdown: CostBreakdown;
  trends: TrendData;
  calculatorStatus: CalculatorStatusMap;
  alerts: Alert[];
  performance: PerformanceMetrics;
}

export interface CostBreakdown {
  directCosts: DirectCostData;
  timeManagement: TimeManagementData;
  pricing: PricingData;
}

export interface DirectCostData {
  total: number;
  operatingCost: number;
  consumableCost: number;
  equipmentUtilization: number;
  inventoryOptimization: number;
  overheadAllocation: number;
  breakdown: {
    energy: number;
    labor: number;
    materials: number;
    overhead: number;
    maintenance: number;
  };
}

export interface TimeManagementData {
  total: number;
  setupTimeOptimization: number;
  jobSchedulingOptimization: number;
  workflowOptimization: number;
  downtimeAnalysis: number;
  batchOptimization: number;
  metrics: {
    averageSetupTime: number;
    schedulingEfficiency: number;
    workflowEfficiency: number;
    downtimeReduction: number;
    batchUtilization: number;
  };
}

export interface PricingData {
  total: number;
  competitivePricing: number;
  valueBasedPricing: number;
  profitMarginOptimization: number;
  breakEvenAnalysis: number;
  costPlusPricing: number;
  metrics: {
    averageMargin: number;
    pricingAccuracy: number;
    competitivePosition: string;
    valueCapture: number;
  };
}

export interface TrendData {
  costTrend: number; // percentage change
  efficiencyTrend: number;
  utilizationTrend: number;
  hourlyRateTrend: number;
  alertTrend: number;
}

export interface CalculatorStatusMap {
  [calculatorId: string]: CalculatorStatus;
}

export interface CalculatorStatus {
  status: 'active' | 'warning' | 'error' | 'inactive';
  lastUpdated: Date;
  responseTime: number;
  errorCount: number;
  dataQuality: number; // 0-100
  message?: string;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  actions: string[];
  metadata?: Record<string, any>;
}

export interface AlertThresholds {
  maxHourlyRate: number;
  minEfficiency: number;
  minUtilization: number;
  maxDailyCost: number;
  maxResponseTime: number;
  minDataQuality: number;
}

export interface PerformanceMetrics {
  systemUptime: number; // percentage
  averageResponseTime: number; // milliseconds
  dataAccuracy: number; // percentage
  alertsGenerated: number;
  alertsResolved: number;
  calculatorsActive: number;
  calculatorsTotal: number;
  throughput: number; // calculations per minute
  errorRate: number; // percentage
}

class RealTimeDataAggregatorService implements RealTimeDataAggregator {
  private subscribers: ((data: AggregatedData) => void)[] = [];
  private currentData: AggregatedData | null = null;
  private updateInterval: NodeJS.Timeout | null = null;
  private calculatorClients: Map<string, any> = new Map();
  private performanceHistory: PerformanceMetrics[] = [];

  constructor() {
    this.initializeCalculatorClients();
    this.startDataCollection();
  }

  private initializeCalculatorClients() {
    // Initialize connections to all Phase 3 calculators
    const phase3Calculators = [
      'operatingCostAnalyzer',
      'consumableCostTracker',
      'equipmentUtilization',
      'inventoryOptimizer',
      'overheadAllocation',
      'setupTimeOptimizer',
      'jobSchedulingOptimizer',
      'workflowOptimizer',
      'downtimeAnalyzer',
      'batchOptimizer',
      'competitivePricing',
      'valueBasedPricing',
      'profitMarginOptimizer',
      'breakEvenAnalysis',
      'costPlusPricing',
    ];

    phase3Calculators.forEach(calculatorId => {
      this.calculatorClients.set(calculatorId, {
        id: calculatorId,
        status: 'active',
        lastUpdated: new Date(),
        responseTime: 0,
        errorCount: 0,
        dataQuality: 100,
      });
    });
  }

  private startDataCollection() {
    // Start collecting data every 30 seconds
    this.updateInterval = setInterval(async () => {
      try {
        const aggregatedData = await this.aggregatePhase3Data();
        this.currentData = aggregatedData;
        this.notifySubscribers(aggregatedData);
      } catch (error) {
        console.error('Failed to aggregate data:', error);
      }
    }, 30000);

    // Initial data collection
    this.aggregatePhase3Data().then(data => {
      this.currentData = data;
      this.notifySubscribers(data);
    });
  }

  private notifySubscribers(data: AggregatedData) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  async aggregatePhase3Data(): Promise<AggregatedData> {
    const startTime = Date.now();

    try {
      // Collect data from all calculators
      const directCostData = await this.collectDirectCostData();
      const timeManagementData = await this.collectTimeManagementData();
      const pricingData = await this.collectPricingData();

      // Calculate aggregated metrics
      const totalCost = directCostData.total + timeManagementData.total + pricingData.total;
      const hourlyRate = this.calculateHourlyRate(totalCost);
      const dailyTotal = this.calculateDailyTotal(hourlyRate);
      const monthlyProjected = this.calculateMonthlyProjected(dailyTotal);
      const efficiency = this.calculateOverallEfficiency(directCostData, timeManagementData);
      const utilization = this.calculateOverallUtilization(directCostData, timeManagementData);

      // Calculate trends
      const trends = this.calculateTrends();

      // Get calculator status
      const calculatorStatus = this.getCalculatorStatus();

      // Generate alerts
      const defaultThresholds: AlertThresholds = {
        maxHourlyRate: 120,
        minEfficiency: 85,
        minUtilization: 80,
        maxDailyCost: 3000,
        maxResponseTime: 200,
        minDataQuality: 95,
      };
      const alerts = this.generateAlerts(defaultThresholds);

      // Get performance metrics
      const performance = this.getPerformanceMetrics();

      const aggregatedData: AggregatedData = {
        timestamp: new Date(),
        totalCost,
        hourlyRate,
        dailyTotal,
        monthlyProjected,
        efficiency,
        utilization,
        costBreakdown: {
          directCosts: directCostData,
          timeManagement: timeManagementData,
          pricing: pricingData,
        },
        trends,
        calculatorStatus,
        alerts,
        performance,
      };

      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.updatePerformanceMetrics(responseTime, true);

      return aggregatedData;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.updatePerformanceMetrics(responseTime, false);
      throw error;
    }
  }

  private async collectDirectCostData(): Promise<DirectCostData> {
    // Simulate data collection from direct cost calculators
    const operatingCost = 3500 + Math.random() * 500;
    const consumableCost = 1200 + Math.random() * 200;
    const equipmentUtilization = 2800 + Math.random() * 300;
    const inventoryOptimization = 800 + Math.random() * 100;
    const overheadAllocation = 1200 + Math.random() * 150;

    const total = operatingCost + consumableCost + equipmentUtilization + inventoryOptimization + overheadAllocation;

    return {
      total,
      operatingCost,
      consumableCost,
      equipmentUtilization,
      inventoryOptimization,
      overheadAllocation,
      breakdown: {
        energy: total * 0.25,
        labor: total * 0.35,
        materials: total * 0.30,
        overhead: total * 0.08,
        maintenance: total * 0.02,
      },
    };
  }

  private async collectTimeManagementData(): Promise<TimeManagementData> {
    // Simulate data collection from time management calculators
    const setupTimeOptimization = 800 + Math.random() * 100;
    const jobSchedulingOptimization = 1200 + Math.random() * 150;
    const workflowOptimization = 1000 + Math.random() * 120;
    const downtimeAnalysis = 600 + Math.random() * 80;
    const batchOptimization = 900 + Math.random() * 110;

    const total = setupTimeOptimization + jobSchedulingOptimization + workflowOptimization + downtimeAnalysis + batchOptimization;

    return {
      total,
      setupTimeOptimization,
      jobSchedulingOptimization,
      workflowOptimization,
      downtimeAnalysis,
      batchOptimization,
      metrics: {
        averageSetupTime: 45 + Math.random() * 10,
        schedulingEfficiency: 85 + Math.random() * 10,
        workflowEfficiency: 80 + Math.random() * 15,
        downtimeReduction: 75 + Math.random() * 15,
        batchUtilization: 88 + Math.random() * 8,
      },
    };
  }

  private async collectPricingData(): Promise<PricingData> {
    // Simulate data collection from pricing calculators
    const competitivePricing = 600 + Math.random() * 80;
    const valueBasedPricing = 800 + Math.random() * 100;
    const profitMarginOptimization = 500 + Math.random() * 60;
    const breakEvenAnalysis = 400 + Math.random() * 50;
    const costPlusPricing = 450 + Math.random() * 55;

    const total = competitivePricing + valueBasedPricing + profitMarginOptimization + breakEvenAnalysis + costPlusPricing;

    return {
      total,
      competitivePricing,
      valueBasedPricing,
      profitMarginOptimization,
      breakEvenAnalysis,
      costPlusPricing,
      metrics: {
        averageMargin: 25 + Math.random() * 10,
        pricingAccuracy: 92 + Math.random() * 5,
        competitivePosition: 'competitive',
        valueCapture: 35 + Math.random() * 15,
      },
    };
  }

  private calculateHourlyRate(totalCost: number): number {
    // Assume 8 hours of operation per day
    return totalCost / 8;
  }

  private calculateDailyTotal(hourlyRate: number): number {
    // Current day's accumulated cost (simulate based on current hour)
    const currentHour = new Date().getHours();
    const operatingHours = Math.max(1, currentHour - 8); // Assume operations start at 8 AM
    return hourlyRate * operatingHours;
  }

  private calculateMonthlyProjected(dailyTotal: number): number {
    // Project monthly cost based on daily average
    const workingDaysPerMonth = 22;
    return dailyTotal * workingDaysPerMonth;
  }

  private calculateOverallEfficiency(directCost: DirectCostData, timeManagement: TimeManagementData): number {
    // Weighted average of efficiency metrics
    const weights = {
      timeManagement: 0.6,
      directCost: 0.4,
    };

    const timeEfficiency = (
      timeManagement.metrics.schedulingEfficiency +
      timeManagement.metrics.workflowEfficiency +
      timeManagement.metrics.batchUtilization
    ) / 3;

    const costEfficiency = 85 + Math.random() * 10; // Simulate cost efficiency

    return timeEfficiency * weights.timeManagement + costEfficiency * weights.directCost;
  }

  private calculateOverallUtilization(directCost: DirectCostData, timeManagement: TimeManagementData): number {
    // Calculate overall equipment and resource utilization
    return timeManagement.metrics.batchUtilization * 0.7 + (80 + Math.random() * 15) * 0.3;
  }

  private calculateTrends(): TrendData {
    // Calculate trends based on historical data (simulated)
    return {
      costTrend: (Math.random() - 0.5) * 10, // -5% to +5%
      efficiencyTrend: (Math.random() - 0.5) * 6, // -3% to +3%
      utilizationTrend: (Math.random() - 0.5) * 8, // -4% to +4%
      hourlyRateTrend: (Math.random() - 0.5) * 12, // -6% to +6%
      alertTrend: (Math.random() - 0.5) * 4, // -2% to +2%
    };
  }

  getCalculatorStatus(): CalculatorStatusMap {
    const status: CalculatorStatusMap = {};

    this.calculatorClients.forEach((client, calculatorId) => {
      // Simulate status checking
      const isHealthy = Math.random() > 0.1; // 90% healthy
      const responseTime = 50 + Math.random() * 100; // 50-150ms
      const dataQuality = 95 + Math.random() * 5; // 95-100%

      status[calculatorId] = {
        status: isHealthy ? 'active' : Math.random() > 0.5 ? 'warning' : 'error',
        lastUpdated: new Date(),
        responseTime,
        errorCount: isHealthy ? 0 : Math.floor(Math.random() * 3),
        dataQuality,
        message: isHealthy ? undefined : 'Performance degraded',
      };
    });

    return status;
  }

  generateAlerts(thresholds: AlertThresholds): Alert[] {
    const alerts: Alert[] = [];

    if (!this.currentData) return alerts;

    // Cost alerts
    if (this.currentData.hourlyRate > thresholds.maxHourlyRate) {
      alerts.push({
        id: `alert_cost_${Date.now()}`,
        severity: 'warning',
        title: 'Hourly Rate Exceeded',
        message: `Current hourly rate ($${this.currentData.hourlyRate.toFixed(2)}) exceeds threshold ($${thresholds.maxHourlyRate})`,
        source: 'Cost Monitoring',
        timestamp: new Date(),
        acknowledged: false,
        actions: ['Review operations', 'Check equipment efficiency', 'Optimize parameters'],
      });
    }

    // Efficiency alerts
    if (this.currentData.efficiency < thresholds.minEfficiency) {
      alerts.push({
        id: `alert_efficiency_${Date.now()}`,
        severity: 'warning',
        title: 'Efficiency Below Target',
        message: `Current efficiency (${this.currentData.efficiency.toFixed(1)}%) below target (${thresholds.minEfficiency}%)`,
        source: 'Performance Monitoring',
        timestamp: new Date(),
        acknowledged: false,
        actions: ['Analyze bottlenecks', 'Review workflow', 'Check equipment status'],
      });
    }

    // Utilization alerts
    if (this.currentData.utilization < thresholds.minUtilization) {
      alerts.push({
        id: `alert_utilization_${Date.now()}`,
        severity: 'info',
        title: 'Low Utilization',
        message: `Current utilization (${this.currentData.utilization.toFixed(1)}%) below target (${thresholds.minUtilization}%)`,
        source: 'Utilization Monitoring',
        timestamp: new Date(),
        acknowledged: false,
        actions: ['Increase workload', 'Optimize scheduling', 'Review capacity planning'],
      });
    }

    // Performance alerts
    Object.entries(this.currentData.calculatorStatus).forEach(([calculatorId, status]) => {
      if (status.responseTime > thresholds.maxResponseTime) {
        alerts.push({
          id: `alert_performance_${calculatorId}_${Date.now()}`,
          severity: 'warning',
          title: 'Slow Response Time',
          message: `${calculatorId} response time (${status.responseTime}ms) exceeds threshold (${thresholds.maxResponseTime}ms)`,
          source: calculatorId,
          timestamp: new Date(),
          acknowledged: false,
          actions: ['Check system resources', 'Restart calculator', 'Review configuration'],
        });
      }

      if (status.dataQuality < thresholds.minDataQuality) {
        alerts.push({
          id: `alert_quality_${calculatorId}_${Date.now()}`,
          severity: 'critical',
          title: 'Data Quality Issue',
          message: `${calculatorId} data quality (${status.dataQuality}%) below threshold (${thresholds.minDataQuality}%)`,
          source: calculatorId,
          timestamp: new Date(),
          acknowledged: false,
          actions: ['Validate inputs', 'Check data sources', 'Review calculations'],
        });
      }
    });

    return alerts;
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const activeCalculators = Object.values(this.getCalculatorStatus()).filter(
      status => status.status === 'active'
    ).length;

    const totalCalculators = this.calculatorClients.size;

    const averageResponseTime = this.performanceHistory.length > 0
      ? this.performanceHistory.reduce((sum, metric) => sum + metric.averageResponseTime, 0) / this.performanceHistory.length
      : 145;

    return {
      systemUptime: 99.8,
      averageResponseTime,
      dataAccuracy: 98.5,
      alertsGenerated: this.currentData?.alerts.length || 0,
      alertsResolved: Math.max(0, (this.currentData?.alerts.length || 0) - 2),
      calculatorsActive: activeCalculators,
      calculatorsTotal: totalCalculators,
      throughput: 45, // calculations per minute
      errorRate: 0.2, // percentage
    };
  }

  private updatePerformanceMetrics(responseTime: number, success: boolean) {
    const metric: PerformanceMetrics = {
      systemUptime: success ? 99.9 : 99.5,
      averageResponseTime: responseTime,
      dataAccuracy: success ? 99.0 : 95.0,
      alertsGenerated: 0,
      alertsResolved: 0,
      calculatorsActive: 0,
      calculatorsTotal: 0,
      throughput: success ? 50 : 30,
      errorRate: success ? 0.1 : 2.0,
    };

    this.performanceHistory.push(metric);
    
    // Keep only last 100 metrics
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }

  subscribeToUpdates(callback: (data: AggregatedData) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.subscribers = [];
    this.calculatorClients.clear();
  }
}

export const realTimeDataAggregator = new RealTimeDataAggregatorService();

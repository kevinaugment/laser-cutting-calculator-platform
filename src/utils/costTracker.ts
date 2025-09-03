/**
 * Real-time Cost Tracking System for Direct Cost Control
 * Provides real-time monitoring, alerts, and variance analysis
 */

export interface CostTracker {
  trackRealTimeCosts(): CostMetrics;
  generateAlerts(thresholds: CostThresholds): Alert[];
  calculateVariances(budget: Budget, actual: ActualCosts): Variance[];
  updateCostData(newData: CostData): void;
  getCostTrends(period: TimePeriod): CostTrend[];
}

export interface CostMetrics {
  currentHourlyRate: number;
  dailyTotal: number;
  monthlyProjected: number;
  yearToDate: number;
  efficiency: EfficiencyMetrics;
  breakdown: RealTimeCostBreakdown;
  lastUpdated: Date;
}

export interface EfficiencyMetrics {
  overallEfficiency: number;
  energyEfficiency: number;
  laborEfficiency: number;
  materialEfficiency: number;
  utilizationRate: number;
}

export interface RealTimeCostBreakdown {
  energy: CostComponent;
  labor: CostComponent;
  materials: CostComponent;
  overhead: CostComponent;
  maintenance: CostComponent;
}

export interface CostComponent {
  current: number;
  budgeted: number;
  variance: number;
  variancePercent: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface CostThresholds {
  hourlyRateMax: number;
  dailyBudgetMax: number;
  varianceThreshold: number;
  efficiencyMin: number;
  utilizationMin: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  category: string;
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
  actions: string[];
}

export interface Budget {
  hourlyRate: number;
  dailyBudget: number;
  monthlyBudget: number;
  annualBudget: number;
  breakdown: BudgetBreakdown;
}

export interface BudgetBreakdown {
  energy: number;
  labor: number;
  materials: number;
  overhead: number;
  maintenance: number;
}

export interface ActualCosts {
  hourlyRate: number;
  dailyActual: number;
  monthlyActual: number;
  yearToDateActual: number;
  breakdown: BudgetBreakdown;
}

export interface Variance {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: 'favorable' | 'unfavorable' | 'neutral';
  rootCause?: string;
  recommendation?: string;
}

export interface CostData {
  timestamp: Date;
  energyCost: number;
  laborCost: number;
  materialCost: number;
  overheadCost: number;
  maintenanceCost: number;
  operatingHours: number;
  productionVolume: number;
}

export interface TimePeriod {
  start: Date;
  end: Date;
  granularity: 'hour' | 'day' | 'week' | 'month';
}

export interface CostTrend {
  timestamp: Date;
  value: number;
  category: string;
  movingAverage: number;
  prediction?: number;
}

export class RealTimeCostTracker implements CostTracker {
  private costHistory: CostData[] = [];
  private alerts: Alert[] = [];
  private currentMetrics: CostMetrics | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startRealTimeTracking();
  }

  trackRealTimeCosts(): CostMetrics {
    const latestData = this.getLatestCostData();
    
    if (!latestData) {
      throw new Error('No cost data available');
    }

    const currentHourlyRate = this.calculateCurrentHourlyRate(latestData);
    const dailyTotal = this.calculateDailyTotal();
    const monthlyProjected = this.projectMonthlyCosts();
    const yearToDate = this.calculateYearToDate();
    const efficiency = this.calculateEfficiencyMetrics();
    const breakdown = this.calculateRealTimeBreakdown();

    this.currentMetrics = {
      currentHourlyRate,
      dailyTotal,
      monthlyProjected,
      yearToDate,
      efficiency,
      breakdown,
      lastUpdated: new Date(),
    };

    return this.currentMetrics;
  }

  generateAlerts(thresholds: CostThresholds): Alert[] {
    const currentMetrics = this.trackRealTimeCosts();
    const newAlerts: Alert[] = [];

    // Hourly rate alert
    if (currentMetrics.currentHourlyRate > thresholds.hourlyRateMax) {
      newAlerts.push({
        id: `alert_${Date.now()}_hourly_rate`,
        type: 'critical',
        category: 'Cost Overrun',
        message: `Hourly rate (${currentMetrics.currentHourlyRate}) exceeds threshold (${thresholds.hourlyRateMax})`,
        value: currentMetrics.currentHourlyRate,
        threshold: thresholds.hourlyRateMax,
        timestamp: new Date(),
        acknowledged: false,
        actions: [
          'Review current operations',
          'Check for equipment issues',
          'Optimize cutting parameters',
          'Investigate material costs'
        ]
      });
    }

    // Daily budget alert
    if (currentMetrics.dailyTotal > thresholds.dailyBudgetMax) {
      newAlerts.push({
        id: `alert_${Date.now()}_daily_budget`,
        type: 'warning',
        category: 'Budget Variance',
        message: `Daily costs (${currentMetrics.dailyTotal}) exceed budget (${thresholds.dailyBudgetMax})`,
        value: currentMetrics.dailyTotal,
        threshold: thresholds.dailyBudgetMax,
        timestamp: new Date(),
        acknowledged: false,
        actions: [
          'Review daily operations',
          'Adjust production schedule',
          'Implement cost controls'
        ]
      });
    }

    // Efficiency alert
    if (currentMetrics.efficiency.overallEfficiency < thresholds.efficiencyMin) {
      newAlerts.push({
        id: `alert_${Date.now()}_efficiency`,
        type: 'warning',
        category: 'Efficiency',
        message: `Overall efficiency (${currentMetrics.efficiency.overallEfficiency}%) below minimum (${thresholds.efficiencyMin}%)`,
        value: currentMetrics.efficiency.overallEfficiency,
        threshold: thresholds.efficiencyMin,
        timestamp: new Date(),
        acknowledged: false,
        actions: [
          'Analyze workflow bottlenecks',
          'Review operator performance',
          'Check equipment status',
          'Optimize job scheduling'
        ]
      });
    }

    // Utilization alert
    if (currentMetrics.efficiency.utilizationRate < thresholds.utilizationMin) {
      newAlerts.push({
        id: `alert_${Date.now()}_utilization`,
        type: 'info',
        category: 'Utilization',
        message: `Equipment utilization (${currentMetrics.efficiency.utilizationRate}%) below target (${thresholds.utilizationMin}%)`,
        value: currentMetrics.efficiency.utilizationRate,
        threshold: thresholds.utilizationMin,
        timestamp: new Date(),
        acknowledged: false,
        actions: [
          'Increase production volume',
          'Optimize scheduling',
          'Reduce setup times',
          'Improve maintenance planning'
        ]
      });
    }

    this.alerts.push(...newAlerts);
    return newAlerts;
  }

  calculateVariances(budget: Budget, actual: ActualCosts): Variance[] {
    const variances: Variance[] = [];

    // Calculate variance for each cost category
    const categories = ['energy', 'labor', 'materials', 'overhead', 'maintenance'] as const;
    
    categories.forEach(category => {
      const budgetedAmount = budget.breakdown[category];
      const actualAmount = actual.breakdown[category];
      const variance = actualAmount - budgetedAmount;
      const variancePercent = budgetedAmount > 0 ? (variance / budgetedAmount) * 100 : 0;
      
      let status: Variance['status'] = 'neutral';
      if (variance > 0) status = 'unfavorable';
      else if (variance < 0) status = 'favorable';

      variances.push({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        budgeted: budgetedAmount,
        actual: actualAmount,
        variance,
        variancePercent,
        status,
        rootCause: this.identifyRootCause(category, variance),
        recommendation: this.generateRecommendation(category, variance),
      });
    });

    // Overall variance
    const totalBudgeted = budget.dailyBudget;
    const totalActual = actual.dailyActual;
    const totalVariance = totalActual - totalBudgeted;
    const totalVariancePercent = totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0;

    variances.push({
      category: 'Total',
      budgeted: totalBudgeted,
      actual: totalActual,
      variance: totalVariance,
      variancePercent: totalVariancePercent,
      status: totalVariance > 0 ? 'unfavorable' : totalVariance < 0 ? 'favorable' : 'neutral',
      rootCause: this.identifyOverallRootCause(variances),
      recommendation: this.generateOverallRecommendation(variances),
    });

    return variances;
  }

  updateCostData(newData: CostData): void {
    this.costHistory.push(newData);
    
    // Keep only last 30 days of data for performance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    this.costHistory = this.costHistory.filter(data => data.timestamp >= thirtyDaysAgo);
    
    // Trigger real-time update
    this.trackRealTimeCosts();
  }

  getCostTrends(period: TimePeriod): CostTrend[] {
    const filteredData = this.costHistory.filter(
      data => data.timestamp >= period.start && data.timestamp <= period.end
    );

    const trends: CostTrend[] = [];
    const categories = ['energyCost', 'laborCost', 'materialCost', 'overheadCost', 'maintenanceCost'] as const;

    categories.forEach(category => {
      const categoryTrends = filteredData.map(data => ({
        timestamp: data.timestamp,
        value: data[category],
        category: category.replace('Cost', ''),
        movingAverage: this.calculateMovingAverage(filteredData, category, data.timestamp, 7),
        prediction: this.predictNextValue(filteredData, category, data.timestamp),
      }));

      trends.push(...categoryTrends);
    });

    return trends.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  private startRealTimeTracking(): void {
    // Update metrics every 5 minutes
    this.updateInterval = setInterval(() => {
      if (this.costHistory.length > 0) {
        this.trackRealTimeCosts();
      }
    }, 5 * 60 * 1000);
  }

  private getLatestCostData(): CostData | null {
    return this.costHistory.length > 0 ? this.costHistory[this.costHistory.length - 1] : null;
  }

  private calculateCurrentHourlyRate(data: CostData): number {
    const totalCost = data.energyCost + data.laborCost + data.materialCost + 
                     data.overheadCost + data.maintenanceCost;
    return data.operatingHours > 0 ? totalCost / data.operatingHours : 0;
  }

  private calculateDailyTotal(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayData = this.costHistory.filter(data => {
      const dataDate = new Date(data.timestamp);
      dataDate.setHours(0, 0, 0, 0);
      return dataDate.getTime() === today.getTime();
    });

    return todayData.reduce((total, data) => {
      return total + data.energyCost + data.laborCost + data.materialCost + 
             data.overheadCost + data.maintenanceCost;
    }, 0);
  }

  private projectMonthlyCosts(): number {
    const dailyAverage = this.calculateDailyAverage();
    const workingDaysInMonth = 22; // Typical working days
    return dailyAverage * workingDaysInMonth;
  }

  private calculateDailyAverage(): number {
    const last7Days = this.getLast7DaysData();
    if (last7Days.length === 0) return 0;

    const totalCosts = last7Days.reduce((total, data) => {
      return total + data.energyCost + data.laborCost + data.materialCost + 
             data.overheadCost + data.maintenanceCost;
    }, 0);

    return totalCosts / last7Days.length;
  }

  private getLast7DaysData(): CostData[] {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return this.costHistory.filter(data => data.timestamp >= sevenDaysAgo);
  }

  private calculateYearToDate(): number {
    const yearStart = new Date();
    yearStart.setMonth(0, 1);
    yearStart.setHours(0, 0, 0, 0);

    const ytdData = this.costHistory.filter(data => data.timestamp >= yearStart);
    
    return ytdData.reduce((total, data) => {
      return total + data.energyCost + data.laborCost + data.materialCost + 
             data.overheadCost + data.maintenanceCost;
    }, 0);
  }

  private calculateEfficiencyMetrics(): EfficiencyMetrics {
    const recentData = this.getLast7DaysData();
    if (recentData.length === 0) {
      return {
        overallEfficiency: 0,
        energyEfficiency: 0,
        laborEfficiency: 0,
        materialEfficiency: 0,
        utilizationRate: 0,
      };
    }

    // Calculate efficiency metrics based on industry benchmarks
    const avgData = this.calculateAverageData(recentData);
    
    return {
      overallEfficiency: this.calculateOverallEfficiency(avgData),
      energyEfficiency: this.calculateEnergyEfficiency(avgData),
      laborEfficiency: this.calculateLaborEfficiency(avgData),
      materialEfficiency: this.calculateMaterialEfficiency(avgData),
      utilizationRate: this.calculateUtilizationRate(avgData),
    };
  }

  private calculateAverageData(data: CostData[]): CostData {
    const count = data.length;
    return {
      timestamp: new Date(),
      energyCost: data.reduce((sum, d) => sum + d.energyCost, 0) / count,
      laborCost: data.reduce((sum, d) => sum + d.laborCost, 0) / count,
      materialCost: data.reduce((sum, d) => sum + d.materialCost, 0) / count,
      overheadCost: data.reduce((sum, d) => sum + d.overheadCost, 0) / count,
      maintenanceCost: data.reduce((sum, d) => sum + d.maintenanceCost, 0) / count,
      operatingHours: data.reduce((sum, d) => sum + d.operatingHours, 0) / count,
      productionVolume: data.reduce((sum, d) => sum + d.productionVolume, 0) / count,
    };
  }

  private calculateOverallEfficiency(data: CostData): number {
    // Simplified efficiency calculation - can be enhanced with more sophisticated algorithms
    const totalCost = data.energyCost + data.laborCost + data.materialCost + 
                     data.overheadCost + data.maintenanceCost;
    const costPerUnit = data.productionVolume > 0 ? totalCost / data.productionVolume : 0;
    
    // Compare against industry benchmark (example: $50 per unit)
    const benchmark = 50;
    return Math.max(0, Math.min(100, (benchmark / Math.max(costPerUnit, 1)) * 100));
  }

  private calculateEnergyEfficiency(data: CostData): number {
    const energyPerHour = data.operatingHours > 0 ? data.energyCost / data.operatingHours : 0;
    const benchmark = 15; // $15 per hour benchmark
    return Math.max(0, Math.min(100, (benchmark / Math.max(energyPerHour, 1)) * 100));
  }

  private calculateLaborEfficiency(data: CostData): number {
    const laborPerUnit = data.productionVolume > 0 ? data.laborCost / data.productionVolume : 0;
    const benchmark = 20; // $20 per unit benchmark
    return Math.max(0, Math.min(100, (benchmark / Math.max(laborPerUnit, 1)) * 100));
  }

  private calculateMaterialEfficiency(data: CostData): number {
    const materialPerUnit = data.productionVolume > 0 ? data.materialCost / data.productionVolume : 0;
    const benchmark = 15; // $15 per unit benchmark
    return Math.max(0, Math.min(100, (benchmark / Math.max(materialPerUnit, 1)) * 100));
  }

  private calculateUtilizationRate(data: CostData): number {
    // Assuming 24 hours available per day
    const maxHours = 24;
    return Math.min(100, (data.operatingHours / maxHours) * 100);
  }

  private calculateRealTimeBreakdown(): RealTimeCostBreakdown {
    const latestData = this.getLatestCostData();
    if (!latestData) {
      throw new Error('No cost data available for breakdown');
    }

    // Get budget data (this would typically come from a budget service)
    const budgetData = this.getBudgetData();

    return {
      energy: this.createCostComponent(latestData.energyCost, budgetData.energy),
      labor: this.createCostComponent(latestData.laborCost, budgetData.labor),
      materials: this.createCostComponent(latestData.materialCost, budgetData.materials),
      overhead: this.createCostComponent(latestData.overheadCost, budgetData.overhead),
      maintenance: this.createCostComponent(latestData.maintenanceCost, budgetData.maintenance),
    };
  }

  private createCostComponent(current: number, budgeted: number): CostComponent {
    const variance = current - budgeted;
    const variancePercent = budgeted > 0 ? (variance / budgeted) * 100 : 0;
    const trend = this.calculateTrend(current);

    return {
      current,
      budgeted,
      variance,
      variancePercent,
      trend,
    };
  }

  private calculateTrend(currentValue: number): 'increasing' | 'decreasing' | 'stable' {
    const recentData = this.getLast7DaysData();
    if (recentData.length < 2) return 'stable';

    const previousValue = recentData[recentData.length - 2];
    const change = currentValue - (previousValue.energyCost + previousValue.laborCost + 
                                  previousValue.materialCost + previousValue.overheadCost + 
                                  previousValue.maintenanceCost);

    if (Math.abs(change) < currentValue * 0.05) return 'stable'; // Within 5%
    return change > 0 ? 'increasing' : 'decreasing';
  }

  private getBudgetData(): BudgetBreakdown {
    // This would typically come from a budget service
    return {
      energy: 100,
      labor: 200,
      materials: 150,
      overhead: 80,
      maintenance: 50,
    };
  }

  private identifyRootCause(category: string, variance: number): string {
    if (Math.abs(variance) < 10) return 'Normal variation';
    
    const causes = {
      energy: variance > 0 ? 'Higher power consumption or electricity rates' : 'Improved energy efficiency',
      labor: variance > 0 ? 'Overtime or higher wage rates' : 'Improved productivity',
      materials: variance > 0 ? 'Material price increases or waste' : 'Better material utilization',
      overhead: variance > 0 ? 'Increased facility costs' : 'Better overhead allocation',
      maintenance: variance > 0 ? 'Unplanned maintenance or repairs' : 'Effective preventive maintenance',
    };

    return causes[category as keyof typeof causes] || 'Unknown cause';
  }

  private generateRecommendation(category: string, variance: number): string {
    if (Math.abs(variance) < 10) return 'Continue current practices';
    
    const recommendations = {
      energy: variance > 0 ? 'Optimize cutting parameters and implement energy management' : 'Maintain current energy practices',
      labor: variance > 0 ? 'Review staffing levels and implement efficiency improvements' : 'Continue current labor practices',
      materials: variance > 0 ? 'Optimize material usage and review supplier contracts' : 'Maintain current material practices',
      overhead: variance > 0 ? 'Review overhead allocation and reduce fixed costs' : 'Continue current overhead management',
      maintenance: variance > 0 ? 'Implement preventive maintenance program' : 'Maintain current maintenance practices',
    };

    return recommendations[category as keyof typeof recommendations] || 'Review and analyze further';
  }

  private identifyOverallRootCause(variances: Variance[]): string {
    const significantVariances = variances.filter(v => Math.abs(v.variancePercent) > 10);
    if (significantVariances.length === 0) return 'Normal operational variation';
    
    const majorCategory = significantVariances.reduce((max, current) => 
      Math.abs(current.variance) > Math.abs(max.variance) ? current : max
    );

    return `Primary driver: ${majorCategory.category} variance of ${majorCategory.variancePercent.toFixed(1)}%`;
  }

  private generateOverallRecommendation(variances: Variance[]): string {
    const unfavorableVariances = variances.filter(v => v.status === 'unfavorable' && Math.abs(v.variancePercent) > 5);
    
    if (unfavorableVariances.length === 0) {
      return 'Performance is on track - continue current practices';
    } else if (unfavorableVariances.length === 1) {
      return `Focus on ${unfavorableVariances[0].category.toLowerCase()} cost control`;
    } else {
      return 'Implement comprehensive cost control measures across multiple categories';
    }
  }

  private calculateMovingAverage(data: CostData[], category: keyof CostData, timestamp: Date, days: number): number {
    const targetDate = new Date(timestamp);
    const startDate = new Date(targetDate);
    startDate.setDate(startDate.getDate() - days);

    const relevantData = data.filter(d => d.timestamp >= startDate && d.timestamp <= targetDate);
    if (relevantData.length === 0) return 0;

    const sum = relevantData.reduce((total, d) => total + (d[category] as number), 0);
    return sum / relevantData.length;
  }

  private predictNextValue(data: CostData[], category: keyof CostData, timestamp: Date): number {
    // Simple linear regression prediction
    const recentData = data.slice(-14); // Last 14 data points
    if (recentData.length < 2) return 0;

    const values = recentData.map(d => d[category] as number);
    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squared indices

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return slope * n + intercept; // Predict next value
  }

  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Export singleton instance
export const realTimeCostTracker = new RealTimeCostTracker();

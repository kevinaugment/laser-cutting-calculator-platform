import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { Icon, StatusIcon } from '../../ui/IconRegistry';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import JobQueueOptimizerForm from './JobQueueOptimizerForm';
import JobQueueOptimizerResults from './JobQueueOptimizerResults';
import JobQueueFormulaExplanation from './JobQueueFormulaExplanation';
import JobQueueExportTools from './JobQueueExportTools';
import JobQueueRelatedTools from './JobQueueRelatedTools';
import JobQueueEducationalContent from './JobQueueEducationalContent';
import JobQueueFAQ from './JobQueueFAQ';
import ErrorBoundary from '../../ui/ErrorBoundary';
// import { jobQueueOptimizer } from '../../../services/calculators/jobQueueOptimizer';

const JobQueueOptimizerComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.jobQueue.length === 0) {
        throw new Error('Job queue cannot be empty');
      }
      
      if (inputs.machineCapabilities.length === 0) {
        throw new Error('At least one machine must be available');
      }

      if (inputs.resourceConstraints.availableOperators <= 0) {
        throw new Error('At least one operator must be available');
      }

      // Calculate job queue optimization - temporarily using mock data
      const calculationResults = {
        optimizedSchedule: generateOptimizedSchedule(inputs),
        performanceMetrics: calculatePerformanceMetrics(inputs),
        resourceUtilization: calculateResourceUtilization(inputs),
        costAnalysis: calculateCostAnalysis(inputs),
        riskAssessment: calculateRiskAssessment(inputs),
        optimizationInsights: generateOptimizationInsights(inputs),
        alternativeSchedules: generateAlternativeSchedules(inputs),
        realTimeAdjustments: {
          dynamicRescheduling: true,
          triggerConditions: [
            'Machine breakdown or unexpected downtime',
            'Rush order insertion',
            'Material availability changes',
            'Quality issues requiring rework'
          ],
          adjustmentStrategies: [
            'Automatic job resequencing',
            'Load balancing across machines',
            'Priority escalation protocols',
            'Resource reallocation'
          ],
          monitoringParameters: [
            'Real-time machine status',
            'Job progress tracking',
            'Quality metrics',
            'Resource availability'
          ]
        },
        customerImpact: {
          customerSatisfactionScore: 8.5,
          deliveryPerformance: [
            { customerId: 'CUST001', onTimeRate: 95, satisfaction: 9 },
            { customerId: 'CUST002', onTimeRate: 88, satisfaction: 8 },
            { customerId: 'CUST003', onTimeRate: 92, satisfaction: 8.5 }
          ],
          communicationPlan: inputs.jobQueue.map((job: any) => ({
            jobId: job.jobId,
            customerNotification: 'Scheduled confirmation with delivery estimate',
            timing: '24 hours before start'
          }))
        },
        alertsAndRecommendations: {
          urgentActions: [
            'Verify machine availability before schedule execution',
            'Confirm material inventory for all scheduled jobs',
            'Review operator shift assignments'
          ],
          capacityWarnings: [
            'Machine utilization approaching 90% threshold',
            'Limited buffer time for high-priority jobs',
            'Potential overtime required for on-time delivery'
          ],
          qualityAlerts: [
            'Quality check time may impact schedule adherence',
            'Monitor setup time accuracy for schedule reliability'
          ],
          efficiencyImprovements: [
            'Group similar materials to reduce setup time',
            'Implement predictive maintenance scheduling',
            'Consider cross-training operators for flexibility'
          ],
          schedulingTips: [
            'Schedule high-priority jobs during peak efficiency hours',
            'Build in buffer time for complex jobs',
            'Monitor real-time progress for dynamic adjustments'
          ]
        }
      };
      
      setResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for calculations
  const generateOptimizedSchedule = (inputs: any) => {
    const schedule = [];
    let currentTime = new Date();
    
    // Sort jobs by priority and other factors
    const sortedJobs = inputs.jobQueue
      .map((job: any) => ({
        ...job,
        priorityScore: calculatePriorityScore(job, inputs)
      }))
      .sort((a: any, b: any) => b.priorityScore - a.priorityScore);

    sortedJobs.forEach((job: any, index: number) => {
      const machine = findBestMachine(job, inputs);
      const setupTime = job.setupTime * (machine?.setupTimeMultiplier || 1.0);
      const bufferTime = Math.max(5, job.estimatedDuration * 0.1); // 10% buffer or 5 min minimum
      
      const startTime = new Date(currentTime);
      const endTime = new Date(startTime.getTime() + (setupTime + job.estimatedDuration) * 60000);
      
      schedule.push({
        jobId: job.jobId,
        jobName: job.jobName,
        assignedMachine: machine?.machineId || 'LASER001',
        scheduledStart: startTime.toISOString(),
        scheduledEnd: endTime.toISOString(),
        estimatedDuration: job.estimatedDuration,
        setupTime: setupTime,
        priority: job.priority,
        sequenceNumber: index + 1,
        bufferTime: bufferTime
      });
      
      currentTime = new Date(endTime.getTime() + bufferTime * 60000);
    });
    
    return schedule;
  };

  const calculatePriorityScore = (job: any, inputs: any): number => {
    const priorityWeights = { 'critical': 10, 'urgent': 8, 'high': 6, 'normal': 4, 'low': 2 };
    const customerWeights = { 'vip': 1.5, 'preferred': 1.2, 'standard': 1.0 };
    
    const priorityWeight = priorityWeights[job.priority] || 4;
    const customerWeight = customerWeights[job.customerImportance] || 1.0;
    const urgencyWeight = calculateUrgencyWeight(job);
    const profitWeight = job.profitMargin / 100;

    return (
      priorityWeight * inputs.optimizationGoals.urgencyWeight +
      customerWeight * inputs.optimizationGoals.customerSatisfactionWeight +
      urgencyWeight * 5 +
      profitWeight * inputs.optimizationGoals.profitabilityWeight * 10
    );
  };

  const calculateUrgencyWeight = (job: any): number => {
    const dueDate = new Date(job.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 24) return 10;
    if (hoursUntilDue < 48) return 8;
    if (hoursUntilDue < 72) return 6;
    if (hoursUntilDue < 168) return 4;
    return 2;
  };

  const findBestMachine = (job: any, inputs: any) => {
    return inputs.machineCapabilities.find((machine: any) => 
      machine.currentStatus === 'available' && 
      machine.materialCompatibility.includes(job.materialType) &&
      job.thickness >= machine.thicknessRange.min &&
      job.thickness <= machine.thicknessRange.max
    ) || inputs.machineCapabilities[0];
  };

  const calculatePerformanceMetrics = (inputs: any) => {
    const schedule = generateOptimizedSchedule(inputs);
    const totalDuration = schedule.reduce((sum, job) => sum + job.estimatedDuration + job.setupTime, 0);
    const totalMakespan = totalDuration / 60; // Convert to hours
    
    return {
      totalMakespan: totalMakespan,
      averageWaitTime: totalMakespan / inputs.jobQueue.length * 0.2, // Simplified
      machineUtilization: inputs.machineCapabilities.map((machine: any) => ({
        machineId: machine.machineId,
        utilization: machine.currentStatus === 'available' ? 
          Math.min(95, 60 + Math.random() * 30) : 0
      })),
      onTimeDeliveryRate: Math.max(85, 100 - inputs.jobQueue.length * 2),
      totalTardiness: Math.max(0, inputs.jobQueue.length - 5) * 0.5,
      throughputRate: inputs.jobQueue.length / (totalMakespan / 24),
      averageFlowTime: totalMakespan / inputs.jobQueue.length
    };
  };

  const calculateResourceUtilization = (inputs: any) => {
    return {
      operatorUtilization: Math.min(90, 70 + inputs.resourceConstraints.availableOperators * 5),
      machineEfficiency: inputs.machineCapabilities.map((machine: any, index: number) => ({
        machineId: machine.machineId,
        efficiency: machine.efficiency,
        bottleneck: index === 0 && inputs.jobQueue.length > 3
      })),
      materialUsage: inputs.resourceConstraints.materialAvailability.map((material: any) => ({
        materialType: material.materialType,
        utilization: Math.min(95, 60 + Math.random() * 30),
        shortage: material.availableQuantity < 100
      })),
      toolingUtilization: inputs.resourceConstraints.toolingAvailability.map((tool: any) => ({
        toolType: tool.toolType,
        utilization: tool.available ? Math.min(85, 50 + Math.random() * 30) : 0,
        availability: tool.available
      })),
      shiftCoverage: inputs.resourceConstraints.operatorShifts.map((shift: any) => ({
        shiftId: shift.shiftId,
        coverage: Math.min(100, shift.operatorCount * 40),
        overtime: shift.operatorCount < 2
      }))
    };
  };

  const calculateCostAnalysis = (inputs: any) => {
    const totalJobs = inputs.jobQueue.length;
    const totalOperatingCost = totalJobs * 150; // $150 per job base cost
    const overtimeCost = Math.max(0, (totalJobs - 5) * 50); // Overtime if > 5 jobs
    const setupCost = inputs.jobQueue.reduce((sum: number, job: any) => sum + job.setupTime * 3, 0); // $3 per minute setup
    const tardinessPenalty = 0; // No penalties in optimized schedule
    const opportunityCost = 0; // No delayed jobs
    const profitOptimization = totalJobs * 75; // $75 optimization benefit per job

    const costBreakdown = [
      { category: 'Operating Cost', amount: totalOperatingCost, percentage: 60 },
      { category: 'Setup Cost', amount: setupCost, percentage: 25 },
      { category: 'Overtime Cost', amount: overtimeCost, percentage: 15 }
    ];

    return {
      totalOperatingCost,
      overtimeCost,
      setupCost,
      tardinessPenalty,
      opportunityCost,
      profitOptimization,
      costBreakdown
    };
  };

  const calculateRiskAssessment = (inputs: any) => {
    const jobCount = inputs.jobQueue.length;
    const urgentJobs = inputs.jobQueue.filter((job: any) => job.priority === 'urgent' || job.priority === 'critical').length;
    const availableMachines = inputs.machineCapabilities.filter((m: any) => m.currentStatus === 'available').length;
    
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (urgentJobs > 2 || jobCount > 8) riskLevel = 'medium';
    if (urgentJobs > 3 || jobCount > 12 || availableMachines < 2) riskLevel = 'high';
    if (urgentJobs > 5 || jobCount > 15 || availableMachines < 1) riskLevel = 'critical';

    return {
      scheduleRisk: riskLevel,
      riskFactors: [
        ...(urgentJobs > 2 ? ['High number of urgent jobs in queue'] : []),
        ...(jobCount > 10 ? ['Large job queue may cause delays'] : []),
        ...(availableMachines < 2 ? ['Limited machine availability'] : []),
        ...(inputs.resourceConstraints.availableOperators < 3 ? ['Insufficient operator coverage'] : [])
      ],
      contingencyPlans: [
        'Activate backup machines if primary machines fail',
        'Implement overtime shifts for critical jobs',
        'Prioritize high-value customers for resource allocation',
        'Maintain emergency material inventory'
      ],
      bufferAdequacy: Math.max(60, 100 - jobCount * 3),
      deliveryRisk: inputs.jobQueue.slice(0, 3).map((job: any) => ({
        jobId: job.jobId,
        riskLevel: job.priority === 'critical' ? 'high' : job.priority === 'urgent' ? 'medium' : 'low',
        mitigation: job.priority === 'critical' ? 'Dedicated machine assignment' : 'Standard monitoring'
      }))
    };
  };

  const generateOptimizationInsights = (inputs: any) => {
    return {
      improvementAreas: [
        'Reduce setup times through better job sequencing',
        'Improve machine utilization balance',
        'Optimize material flow and inventory management',
        'Enhance operator skill development'
      ],
      bottleneckIdentification: [
        'Machine setup time is primary constraint',
        'Material handling between jobs causes delays',
        'Quality inspection time impacts throughput'
      ],
      capacityRecommendations: [
        'Consider adding one more machine for peak periods',
        'Cross-train operators for better flexibility',
        'Implement automated material handling'
      ],
      processImprovements: [
        'Implement lean manufacturing principles',
        'Use predictive maintenance to reduce downtime',
        'Standardize setup procedures across machines'
      ],
      schedulingStrategies: [
        'Group similar jobs to minimize setups',
        'Use dynamic scheduling for urgent jobs',
        'Implement real-time monitoring'
      ]
    };
  };

  const generateAlternativeSchedules = (inputs: any) => {
    const baseMetrics = calculatePerformanceMetrics(inputs);
    
    return [
      {
        scenarioName: 'Minimum Makespan',
        description: 'Optimized for fastest completion',
        makespan: baseMetrics.totalMakespan * 0.9,
        onTimeRate: baseMetrics.onTimeDeliveryRate + 5,
        totalCost: 8500,
        tradeoffs: ['Higher machine utilization', 'Less flexibility']
      },
      {
        scenarioName: 'Maximum Profit',
        description: 'Optimized for profitability',
        makespan: baseMetrics.totalMakespan * 1.1,
        onTimeRate: baseMetrics.onTimeDeliveryRate - 3,
        totalCost: 7800,
        tradeoffs: ['Longer completion time', 'Higher profit margins']
      },
      {
        scenarioName: 'Balanced Approach',
        description: 'Balance of time, cost, and quality',
        makespan: baseMetrics.totalMakespan,
        onTimeRate: baseMetrics.onTimeDeliveryRate,
        totalCost: 8200,
        tradeoffs: ['Moderate performance across all metrics']
      }
    ];
  };

  return (
    <ErrorBoundary name="JobQueueOptimizer" level="component">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Queue Optimizer</h1>
          <p className="text-muted-foreground">
            Optimize production scheduling and job sequencing for maximum efficiency and on-time delivery. 
            Get comprehensive schedule optimization, resource allocation, and performance analysis.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <Icon name="warning" size="sm" className="mr-2" />
            <AlertDescription className="text-red-800">
              <strong>Calculation Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <JobQueueOptimizerForm 
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div>
            {!results ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-muted-foreground" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Optimize</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your job queue, machine capabilities, operational constraints, optimization goals, and quality requirements, 
                    then click "Optimize Job Queue" to get comprehensive schedule optimization and resource allocation recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <Icon name="checkCircle" size="sm" className="mr-2" />
                  <AlertDescription className="text-green-800">
                    <strong>Optimization Complete!</strong> Optimized schedule for{' '}
                    <strong>{results.optimizedSchedule.length} jobs</strong> with{' '}
                    <strong>{results.performanceMetrics.totalMakespan.toFixed(1)} hours</strong> total makespan.
                    On-time delivery rate: <strong>{results.performanceMetrics.onTimeDeliveryRate.toFixed(1)}%</strong>.
                  </AlertDescription>
                </Alert>
                
                <JobQueueOptimizerResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <JobQueueExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <JobQueueFormulaExplanation />

          {/* Related Tools - Full container width */}
          <JobQueueRelatedTools />

          {/* Educational Content - Full container width */}
          <JobQueueEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <JobQueueFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Job Queue Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Schedule Optimization:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Priority Management:</strong> Balance urgency with profitability</li>
                  <li>• <strong>Resource Allocation:</strong> Match jobs to optimal machines</li>
                  <li>• <strong>Setup Reduction:</strong> Group similar materials and processes</li>
                  <li>• <strong>Buffer Management:</strong> Include adequate time buffers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance Monitoring:</h4>
                <ul className="space-y-1">
                  <li>• Track real-time progress against schedule</li>
                  <li>• Monitor machine utilization and efficiency</li>
                  <li>• Implement dynamic rescheduling for disruptions</li>
                  <li>• Measure customer satisfaction and delivery performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default JobQueueOptimizerComponent;

import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import MaintenanceCostCalculatorForm from './MaintenanceCostCalculatorForm';
import MaintenanceCostCalculatorResults from './MaintenanceCostCalculatorResults';
import MaintenanceCostFormulaExplanation from './MaintenanceCostFormulaExplanation';
import MaintenanceCostExportTools from './MaintenanceCostExportTools';
import MaintenanceCostRelatedTools from './MaintenanceCostRelatedTools';
import MaintenanceCostEducationalContent from './MaintenanceCostEducationalContent';
import MaintenanceCostFAQ from './MaintenanceCostFAQ';
// import { MaintenanceCostEstimator } from '../../../services/calculators/maintenanceCostEstimator';

const MaintenanceCostCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.equipmentValue <= 0) {
        throw new Error('Equipment value must be greater than 0');
      }
      
      if (inputs.equipmentAge < 0) {
        throw new Error('Equipment age cannot be negative');
      }

      if (inputs.operatingHours <= 0 || inputs.operatingHours > 8760) {
        throw new Error('Operating hours must be between 1 and 8760 hours per year');
      }

      if (inputs.laborRate <= 0) {
        throw new Error('Labor rate must be greater than 0');
      }

      if (inputs.downtimeRate <= 0) {
        throw new Error('Downtime rate must be greater than 0');
      }

      if (inputs.plannedMaintenanceHours < 0) {
        throw new Error('Planned maintenance hours cannot be negative');
      }

      if (inputs.unplannedDowntimeHours < 0) {
        throw new Error('Unplanned downtime hours cannot be negative');
      }

      if (inputs.maintenanceTeamSize <= 0) {
        throw new Error('Maintenance team size must be at least 1');
      }

      // Calculate maintenance costs - real calculation logic
      // Equipment age factor (older equipment needs more maintenance)
      const ageFactor = 1 + (inputs.equipmentAge * 0.05); // 5% increase per year

      // Calculate annual labor costs
      const plannedLaborCost = inputs.plannedMaintenanceHours * inputs.laborRate;
      const unplannedLaborCost = inputs.unplannedDowntimeHours * inputs.laborRate * 1.5; // 50% premium for emergency work
      const totalLaborCost = (plannedLaborCost + unplannedLaborCost) * ageFactor;

      // Calculate spare parts costs (typically 2-4% of equipment value annually)
      const sparePartsRate = 0.03 + (inputs.equipmentAge * 0.002); // Increases with age
      const sparePartsCost = inputs.equipmentValue * sparePartsRate * ageFactor;

      // Calculate contract costs (if applicable)
      const contractCost = inputs.serviceContractCost || 0;

      // Calculate downtime costs
      const totalDowntimeHours = inputs.plannedMaintenanceHours + inputs.unplannedDowntimeHours;
      const downtimeCost = totalDowntimeHours * inputs.downtimeRate;

      // Total annual maintenance cost
      const totalAnnualCost = totalLaborCost + sparePartsCost + contractCost + downtimeCost;

      // Cost breakdown by maintenance type
      const preventiveMaintenanceRatio = inputs.plannedMaintenanceHours / (inputs.plannedMaintenanceHours + inputs.unplannedDowntimeHours + 1);
      const correctiveMaintenanceRatio = inputs.unplannedDowntimeHours / (inputs.plannedMaintenanceHours + inputs.unplannedDowntimeHours + 1);

      const preventiveMaintenance = totalAnnualCost * preventiveMaintenanceRatio * 0.7; // 70% of planned work
      const correctiveMaintenance = totalAnnualCost * correctiveMaintenanceRatio * 0.8; // 80% of unplanned work
      const emergencyRepairs = totalAnnualCost * 0.1; // 10% emergency
      const upgrades = totalAnnualCost * 0.05; // 5% upgrades

      // Calculate maintenance metrics
      const costPerOperatingHour = totalAnnualCost / inputs.operatingHours;
      const costAsPercentageOfValue = (totalAnnualCost / inputs.equipmentValue) * 100;

      // Reliability metrics (based on maintenance strategy)
      const baseFailureRate = 0.002 * ageFactor; // Failures per hour
      const mtbf = 1 / baseFailureRate; // Mean Time Between Failures (hours)
      const mttr = 2 + (inputs.equipmentAge * 0.5); // Mean Time To Repair (hours)
      const availability = (mtbf / (mtbf + mttr)) * 100;

      // Strategy comparison calculations
      const reactiveStrategy = {
        strategy: 'Reactive',
        annualCost: Math.round(totalAnnualCost * 1.3), // 30% higher due to emergency repairs
        availability: Math.max(75, availability - 10),
        riskLevel: 'High',
        implementation: 'Fix when broken - minimal planning'
      };

      const preventiveStrategy = {
        strategy: 'Preventive',
        annualCost: Math.round(totalAnnualCost),
        availability: Math.round(availability * 10) / 10,
        riskLevel: 'Medium',
        implementation: 'Scheduled maintenance based on time/usage'
      };

      const predictiveStrategy = {
        strategy: 'Predictive',
        annualCost: Math.round(totalAnnualCost * 0.85), // 15% reduction through optimization
        availability: Math.min(98, availability + 5),
        riskLevel: 'Low',
        implementation: 'Condition monitoring and data analysis'
      };

      const calculationResults = {
        annualMaintenanceCost: {
          laborCost: Math.round(totalLaborCost),
          spareParts: Math.round(sparePartsCost),
          contractCost: Math.round(contractCost),
          downtimeCost: Math.round(downtimeCost),
          totalCost: Math.round(totalAnnualCost)
        },
        costBreakdown: {
          preventiveMaintenance: Math.round(preventiveMaintenance),
          correctiveMaintenance: Math.round(correctiveMaintenance),
          emergencyRepairs: Math.round(emergencyRepairs),
          upgrades: Math.round(upgrades)
        },
        maintenanceMetrics: {
          costPerOperatingHour: Math.round(costPerOperatingHour * 100) / 100,
          costAsPercentageOfValue: Math.round(costAsPercentageOfValue * 100) / 100,
          meanTimeBetweenFailures: Math.round(mtbf * 10) / 10,
          meanTimeToRepair: Math.round(mttr * 10) / 10,
          availability: Math.round(availability * 10) / 10
        },
        strategyComparison: [
          reactiveStrategy,
          preventiveStrategy,
          predictiveStrategy,
          {
            strategy: 'Reliability Centered',
            annualCost: Math.round(totalAnnualCost * 0.75), // 25% reduction through RCM
            availability: Math.min(98, availability + 7),
            riskLevel: 'Low',
            implementation: 'Comprehensive reliability analysis'
          }
        ],
        optimizationOpportunities: {
          sparesOptimization: Math.round(sparePartsCost * 0.15), // 15% reduction potential
          downtimeReduction: Math.round(downtimeCost * 0.3), // 30% reduction potential
          strategyImprovement: Math.round(totalAnnualCost * 0.2), // 20% improvement potential
          totalPotential: Math.round((sparePartsCost * 0.15) + (downtimeCost * 0.3) + (totalAnnualCost * 0.2)),
          recommendations: [
            totalAnnualCost > 50000 ? 'Implement predictive maintenance for critical components' : 'Consider basic preventive maintenance',
            sparePartsCost > 20000 ? 'Optimize spare parts inventory levels' : 'Review spare parts requirements',
            inputs.unplannedDowntimeHours > 100 ? 'Reduce unplanned downtime through better monitoring' : 'Maintain current monitoring practices',
            inputs.maintenanceTeamSize < 3 ? 'Train maintenance staff on advanced techniques' : 'Consider specialized training programs',
            inputs.plannedMaintenanceHours < 200 ? 'Establish preventive maintenance schedules' : 'Optimize existing maintenance schedules'
          ]
        },
        maintenanceSchedule: {
          dailyTasks: [
            'Visual inspection of equipment condition',
            'Check fluid levels and top up as needed',
            'Monitor operating parameters and temperatures',
            'Clean work area and remove debris'
          ],
          weeklyTasks: [
            'Lubricate moving parts per schedule',
            'Check and tighten loose connections',
            'Inspect safety systems and interlocks',
            'Review maintenance logs and update records'
          ],
          monthlyTasks: [
            'Replace consumable items (filters, nozzles)',
            'Calibrate measurement systems',
            'Perform detailed component inspections',
            'Update maintenance documentation'
          ],
          quarterlyTasks: [
            'Major component overhaul and replacement',
            'Comprehensive system performance testing',
            'Review and update maintenance procedures',
            'Conduct maintenance team training'
          ],
          annualTasks: [
            'Complete equipment overhaul',
            'Replace major wear components',
            'Comprehensive safety system testing',
            'Annual maintenance strategy review'
          ]
        },
        riskAssessment: {
          overallRisk: 'Medium',
          riskFactors: [
            { 
              factor: 'Equipment Age', 
              level: 'Medium', 
              impact: 15, 
              mitigation: 'Increase inspection frequency for aging components' 
            },
            { 
              factor: 'Operating Environment', 
              level: 'Medium', 
              impact: 12, 
              mitigation: 'Implement environmental controls and protection' 
            },
            { 
              factor: 'Operator Skill Level', 
              level: 'Low', 
              impact: 8, 
              mitigation: 'Continue operator training and certification programs' 
            },
            { 
              factor: 'Spare Parts Availability', 
              level: 'Low', 
              impact: 6, 
              mitigation: 'Maintain adequate spare parts inventory' 
            }
          ],
          criticalComponents: [
            'Laser resonator',
            'Cutting head assembly',
            'Motion control system',
            'Cooling system',
            'Gas delivery system'
          ]
        },
        recommendations: {
          immediate: [
            'Review current spare parts inventory levels',
            'Implement daily equipment inspection checklist',
            'Train operators on proper equipment handling'
          ],
          shortTerm: [
            'Establish predictive maintenance program',
            'Upgrade to condition monitoring systems',
            'Optimize maintenance scheduling'
          ],
          longTerm: [
            'Consider equipment upgrade or replacement',
            'Implement reliability-centered maintenance',
            'Develop comprehensive maintenance strategy'
          ],
          costSaving: [
            'Negotiate better spare parts pricing',
            'Implement energy-efficient upgrades',
            'Optimize maintenance team utilization'
          ]
        },
        sensitivityAnalysis: {
          laborRateImpact: [
            { rate: 60, cost: 67500, change: '-8.5%' },
            { rate: 75, cost: 73750, change: 'Base' },
            { rate: 90, cost: 80000, change: '+8.5%' },
            { rate: 105, cost: 86250, change: '+17.0%' }
          ],
          downtimeImpact: [
            { hours: 24, cost: 61750, change: '-16.3%' },
            { hours: 48, cost: 73750, change: 'Base' },
            { hours: 72, cost: 85750, change: '+16.3%' },
            { hours: 96, cost: 97750, change: '+32.5%' }
          ],
          recommendations: [
            'Labor rate has moderate impact - focus on efficiency',
            'Downtime reduction offers highest cost savings',
            'Preventive maintenance investment pays off quickly'
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Maintenance Cost Calculator</h1>
          <p className="text-muted-foreground">
            Analyze and optimize maintenance costs for your laser cutting equipment. Calculate annual maintenance expenses, 
            compare strategies, and identify opportunities for cost reduction and reliability improvement.
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              <strong>Calculation Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <MaintenanceCostCalculatorForm 
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your equipment specifications, maintenance strategy, cost factors, and risk factors, 
                    then click "Calculate Maintenance Costs" to get comprehensive maintenance cost analysis and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Analysis Complete!</strong> Annual maintenance cost is{' '}
                    <strong>${results.annualMaintenanceCost.totalCost.toFixed(0)}</strong> ({results.maintenanceMetrics.costAsPercentageOfValue.toFixed(1)}% of asset value) with{' '}
                    <strong>{results.maintenanceMetrics.availability.toFixed(1)}%</strong> availability.
                    Optimization potential: <strong>${results.optimizationOpportunities.totalPotential.toFixed(0)}</strong>.
                  </AlertDescription>
                </Alert>
                
                <MaintenanceCostCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <MaintenanceCostExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <MaintenanceCostFormulaExplanation />

          {/* Related Tools - Full container width */}
          <MaintenanceCostRelatedTools />

          {/* Educational Content - Full container width */}
          <MaintenanceCostEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <MaintenanceCostFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Maintenance Cost Optimization Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Cost Management:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Target 2-4%:</strong> Aim for 2-4% of asset value annually</li>
                  <li>• <strong>Preventive Focus:</strong> 70% preventive, 30% reactive maintenance</li>
                  <li>• <strong>Spare Parts:</strong> Optimize inventory to reduce carrying costs</li>
                  <li>• <strong>Downtime Reduction:</strong> Focus on minimizing unplanned downtime</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Strategy Optimization:</h4>
                <ul className="space-y-1">
                  <li>• Consider predictive maintenance for critical equipment</li>
                  <li>• Implement condition monitoring systems</li>
                  <li>• Train maintenance staff on best practices</li>
                  <li>• Regular review and update of maintenance procedures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCostCalculatorComponent;

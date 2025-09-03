import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import ProductionCapacityCalculatorForm from './ProductionCapacityCalculatorForm';
import ProductionCapacityCalculatorResults from './ProductionCapacityCalculatorResults';
import ProductionCapacityFormulaExplanation from './ProductionCapacityFormulaExplanation';
import ProductionCapacityExportTools from './ProductionCapacityExportTools';
import ProductionCapacityRelatedTools from './ProductionCapacityRelatedTools';
import ProductionCapacityEducationalContent from './ProductionCapacityEducationalContent';
import ProductionCapacityFAQ from './ProductionCapacityFAQ';
// import { productionCapacityPlanner } from '../../../services/calculators/productionCapacityPlanner';

const ProductionCapacityCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (inputs.machineCount <= 0) {
        throw new Error('Machine count must be greater than 0');
      }
      
      if (inputs.operatingHoursPerDay <= 0 || inputs.operatingHoursPerDay > 24) {
        throw new Error('Operating hours per day must be between 1 and 24');
      }

      if (inputs.workingDaysPerWeek <= 0 || inputs.workingDaysPerWeek > 7) {
        throw new Error('Working days per week must be between 1 and 7');
      }

      if (inputs.averagePartCuttingTime <= 0) {
        throw new Error('Average part cutting time must be greater than 0');
      }

      if (inputs.setupTimePerJob < 0) {
        throw new Error('Setup time per job cannot be negative');
      }

      if (inputs.averageJobSize <= 0) {
        throw new Error('Average job size must be greater than 0');
      }

      if (inputs.machineEfficiency <= 0 || inputs.machineEfficiency > 1) {
        throw new Error('Machine efficiency must be between 0 and 1');
      }

      if (inputs.operatorCount <= 0) {
        throw new Error('Operator count must be greater than 0');
      }

      if (inputs.demandForecast <= 0) {
        throw new Error('Demand forecast must be greater than 0');
      }

      // Calculate production capacity - inline calculation
      const hoursPerWeek = inputs.operatingHoursPerDay * inputs.workingDaysPerWeek;
      const hoursPerMonth = hoursPerWeek * 4.33; // Average weeks per month
      const hoursPerYear = hoursPerWeek * 52;

      // Calculate effective production time (accounting for setup and efficiency)
      const setupTimePerPart = inputs.setupTimePerJob / inputs.averageJobSize;
      const totalTimePerPart = inputs.averagePartCuttingTime + setupTimePerPart;
      const effectiveTimePerPart = totalTimePerPart / inputs.machineEfficiency;

      // Calculate capacity
      const partsPerHourPerMachine = 60 / effectiveTimePerPart; // minutes to hours
      const partsPerDayPerMachine = partsPerHourPerMachine * inputs.operatingHoursPerDay;
      const partsPerWeekPerMachine = partsPerDayPerMachine * inputs.workingDaysPerWeek;
      const partsPerMonthPerMachine = partsPerWeekPerMachine * 4.33;
      const partsPerYearPerMachine = partsPerWeekPerMachine * 52;

      // Total capacity with all machines
      const totalPartsPerDay = partsPerDayPerMachine * inputs.machineCount;
      const totalPartsPerWeek = partsPerWeekPerMachine * inputs.machineCount;
      const totalPartsPerMonth = partsPerMonthPerMachine * inputs.machineCount;
      const totalPartsPerYear = partsPerYearPerMachine * inputs.machineCount;

      // Utilization analysis
      const currentUtilization = (inputs.demandForecast / totalPartsPerMonth) * 100;
      const capacityBuffer = totalPartsPerMonth - inputs.demandForecast;

      // Bottleneck analysis
      const operatorCapacity = inputs.operatorCount * inputs.operatingHoursPerDay * inputs.workingDaysPerWeek * 4.33 * 60 / effectiveTimePerPart;
      const machineCapacity = totalPartsPerMonth;
      const bottleneck = operatorCapacity < machineCapacity ? 'Operators' : 'Machines';

      const calculationResults = {
        capacity: {
          partsPerHour: Math.round(partsPerHourPerMachine * inputs.machineCount),
          partsPerDay: Math.round(totalPartsPerDay),
          partsPerWeek: Math.round(totalPartsPerWeek),
          partsPerMonth: Math.round(totalPartsPerMonth),
          partsPerYear: Math.round(totalPartsPerYear)
        },
        utilization: {
          currentUtilization: Math.round(currentUtilization * 10) / 10,
          capacityBuffer: Math.round(capacityBuffer),
          bottleneck: bottleneck
        },
        efficiency: {
          machineEfficiency: inputs.machineEfficiency * 100,
          setupTimeRatio: (setupTimePerPart / totalTimePerPart) * 100,
          effectiveTimePerPart: Math.round(effectiveTimePerPart * 10) / 10
        },
        recommendations: [
          currentUtilization > 90 ? 'Consider adding capacity - utilization is very high' : 'Current capacity is adequate',
          bottleneck === 'Operators' ? 'Operator capacity is the bottleneck - consider hiring more operators' : 'Machine capacity is the bottleneck - consider adding more machines',
          inputs.machineEfficiency < 0.8 ? 'Machine efficiency is low - investigate maintenance and optimization opportunities' : 'Machine efficiency is good'
        ]
      };
      
      setResults(calculationResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="production-capacity-planner"
        name="Production Capacity Planner"
        description="Optimize production capacity and eliminate bottlenecks with comprehensive capacity planning analysis. Calculate theoretical and effective capacity, identify constraints, and maximize manufacturing efficiency for laser cutting operations."
        category="Production Management"
        keywords={[
          'production capacity planner',
          'manufacturing capacity calculator',
          'production planning tool',
          'capacity utilization calculator',
          'bottleneck analysis tool',
          'production efficiency calculator',
          'manufacturing optimization',
          'capacity planning software'
        ]}
        features={[
          'Theoretical and effective capacity calculation',
          'Bottleneck identification and analysis',
          'Capacity utilization optimization',
          'Demand vs capacity analysis',
          'Resource optimization recommendations',
          'Seasonal planning support',
          'Multi-shift capacity modeling',
          'Production efficiency metrics'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'job-queue-optimizer',
          'setup-time-calculator',
          'batch-processing-calculator',
          'labor-cost-allocator'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Production Capacity Planner - Optimize Manufacturing Efficiency</h1>
          <p className="text-muted-foreground">
            Maximize production efficiency with comprehensive capacity planning and bottleneck analysis.
            Calculate theoretical and effective capacity, identify constraints, and optimize resource utilization.
            Essential tool for production managers to achieve peak manufacturing performance.
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
            <ProductionCapacityCalculatorForm 
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your equipment, production parameters, staffing, and demand forecast, 
                    then click "Analyze Production Capacity" to get detailed capacity analysis and optimization recommendations.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Analysis Complete!</strong> Your effective monthly capacity is{' '}
                    <strong>{results.effectiveCapacity.monthly.toLocaleString()}</strong> parts with{' '}
                    <strong>{results.capacityUtilization.toFixed(1)}%</strong> utilization.
                    Primary bottleneck: <strong>{results.bottleneckAnalysis.primaryBottleneck}</strong>.
                  </AlertDescription>
                </Alert>
                
                <ProductionCapacityCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <ProductionCapacityExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <ProductionCapacityFormulaExplanation />

          {/* Related Tools - Full container width */}
          <ProductionCapacityRelatedTools />

          {/* Educational Content - Full container width */}
          <ProductionCapacityEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <ProductionCapacityFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Production Capacity Planning Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Capacity Optimization:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Bottleneck Focus:</strong> Address the primary constraint first</li>
                  <li>• <strong>Efficiency Gains:</strong> Small improvements compound significantly</li>
                  <li>• <strong>Downtime Reduction:</strong> Preventive maintenance pays off</li>
                  <li>• <strong>Setup Optimization:</strong> Quick changeovers increase flexibility</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Strategic Planning:</h4>
                <ul className="space-y-1">
                  <li>• Plan for 80-85% capacity utilization for flexibility</li>
                  <li>• Consider seasonal demand variations</li>
                  <li>• Balance automation with workforce flexibility</li>
                  <li>• Monitor key performance indicators regularly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default ProductionCapacityCalculatorComponent;

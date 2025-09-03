import React, { useState } from 'react';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import BatchProcessingCalculatorForm from './BatchProcessingCalculatorForm';
import BatchProcessingCalculatorResults from './BatchProcessingCalculatorResults';
import BatchProcessingFormulaExplanation from './BatchProcessingFormulaExplanation';
import BatchProcessingExportTools from './BatchProcessingExportTools';
import BatchProcessingRelatedTools from './BatchProcessingRelatedTools';
import BatchProcessingEducationalContent from './BatchProcessingEducationalContent';
import BatchProcessingFAQ from './BatchProcessingFAQ';
// import { batchProcessingCalculator } from '../../../services/calculators/batchProcessingCalculator';

const BatchProcessingCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!inputs.partSpecifications || inputs.partSpecifications.length === 0) {
        throw new Error('At least one part specification must be defined');
      }
      
      if (!inputs.materialInventory || inputs.materialInventory.length === 0) {
        throw new Error('At least one material inventory item must be defined');
      }

      // Check if batch configuration is valid
      if (inputs.batchConfiguration.batchSize <= 0) {
        throw new Error('Batch size must be greater than 0');
      }

      if (inputs.batchConfiguration.totalQuantity <= 0) {
        throw new Error('Total quantity must be greater than 0');
      }

      // Validate operational parameters
      if (inputs.operationalParameters.shiftDuration <= 0) {
        throw new Error('Shift duration must be greater than 0');
      }

      if (inputs.operationalParameters.shiftsPerDay <= 0) {
        throw new Error('Shifts per day must be greater than 0');
      }

      // Check material availability
      const totalMaterialNeeded = inputs.partSpecifications.reduce((total: number, part: any) => {
        return total + (part.quantity * part.dimensions.length * part.dimensions.width * part.thickness / 1000000); // Convert to m³
      }, 0);

      const availableMaterial = inputs.materialInventory.reduce((total: number, material: any) => {
        return total + (material.availableSheets * material.sheetSize.length * material.sheetSize.width * material.thickness / 1000000);
      }, 0);

      if (totalMaterialNeeded > availableMaterial * 0.8) { // 80% utilization threshold
        console.warn('Material availability may be insufficient for optimal batching');
      }

      // Calculate batch processing optimization - inline calculation
      const batchSize = inputs.batchConfiguration.batchSize;
      const totalQuantity = inputs.batchConfiguration.totalQuantity;
      const shiftDuration = inputs.operationalParameters.shiftDuration;
      const shiftsPerDay = inputs.operationalParameters.shiftsPerDay;

      // Calculate number of batches needed
      const numberOfBatches = Math.ceil(totalQuantity / batchSize);

      // Calculate setup times and costs
      const setupTimePerBatch = inputs.operationalParameters.setupTimePerBatch || 30; // minutes
      const totalSetupTime = numberOfBatches * setupTimePerBatch;
      const setupCostPerBatch = inputs.operationalParameters.setupCostPerBatch || 50; // dollars
      const totalSetupCost = numberOfBatches * setupCostPerBatch;

      // Calculate processing times
      const avgProcessingTimePerPart = inputs.partSpecifications.reduce((total: number, part: any) => {
        return total + (part.processingTime || 5); // minutes per part
      }, 0) / inputs.partSpecifications.length;

      const totalProcessingTime = totalQuantity * avgProcessingTimePerPart;
      const totalProductionTime = totalSetupTime + totalProcessingTime;

      // Calculate material utilization with safety check for division by zero
      const materialUtilization = availableMaterial > 0
        ? Math.min(totalMaterialNeeded / availableMaterial, 1.0) * 100
        : 0;
      const wastedMaterial = Math.max(0, availableMaterial - totalMaterialNeeded);

      // Calculate efficiency metrics
      const setupTimeRatio = (totalSetupTime / totalProductionTime) * 100;
      const processingEfficiency = Math.max(0, 100 - setupTimeRatio);

      // Calculate production schedule
      const dailyCapacity = shiftDuration * shiftsPerDay * 60; // minutes per day
      const daysRequired = Math.ceil(totalProductionTime / dailyCapacity);
      const batchesPerDay = Math.floor(dailyCapacity / (setupTimePerBatch + (batchSize * avgProcessingTimePerPart)));

      // Calculate cost analysis
      const laborCostPerHour = inputs.operationalParameters.laborCostPerHour || 25;
      const totalLaborCost = (totalProductionTime / 60) * laborCostPerHour;
      const materialCostPerUnit = inputs.operationalParameters.materialCostPerUnit || 10;
      const totalMaterialCost = totalQuantity * materialCostPerUnit;
      const totalCost = totalSetupCost + totalLaborCost + totalMaterialCost;
      const costPerUnit = totalCost / totalQuantity;

      // Optimization recommendations
      const optimalBatchSize = Math.sqrt(2 * totalQuantity * setupCostPerBatch / (materialCostPerUnit * 0.1)); // EOQ formula
      const recommendedBatchSize = Math.max(Math.min(Math.round(optimalBatchSize), totalQuantity), 1);

      // Calculate savings potential
      const currentBatchEfficiency = processingEfficiency;
      const optimizedBatches = Math.ceil(totalQuantity / recommendedBatchSize);
      const optimizedSetupTime = optimizedBatches * setupTimePerBatch;
      const optimizedProductionTime = optimizedSetupTime + totalProcessingTime;
      const optimizedEfficiency = Math.max(0, 100 - (optimizedSetupTime / optimizedProductionTime) * 100);
      const timeSavings = Math.max(0, totalProductionTime - optimizedProductionTime);
      const costSavings = (timeSavings / 60) * laborCostPerHour + (optimizedBatches - numberOfBatches) * setupCostPerBatch;

      const calculationResults = {
        batchAnalysis: {
          currentBatchSize: batchSize,
          recommendedBatchSize: recommendedBatchSize,
          numberOfBatches: numberOfBatches,
          optimizedBatches: optimizedBatches,
          batchesPerDay: batchesPerDay
        },
        timeAnalysis: {
          totalSetupTime: Math.round(totalSetupTime),
          totalProcessingTime: Math.round(totalProcessingTime),
          totalProductionTime: Math.round(totalProductionTime),
          daysRequired: daysRequired,
          setupTimeRatio: Math.round(setupTimeRatio * 10) / 10
        },
        costAnalysis: {
          totalSetupCost: Math.round(totalSetupCost * 100) / 100,
          totalLaborCost: Math.round(totalLaborCost * 100) / 100,
          totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
          totalCost: Math.round(totalCost * 100) / 100,
          costPerUnit: Math.round(costPerUnit * 100) / 100
        },
        efficiencyMetrics: {
          materialUtilization: Math.round(materialUtilization * 10) / 10,
          processingEfficiency: Math.round(processingEfficiency * 10) / 10,
          currentEfficiency: Math.round(currentBatchEfficiency * 10) / 10,
          optimizedEfficiency: Math.round(optimizedEfficiency * 10) / 10,
          wastedMaterial: Math.round(wastedMaterial * 1000) / 1000
        },
        optimizationResults: {
          timeSavings: Math.round(timeSavings),
          costSavings: Math.round(costSavings * 100) / 100,
          efficiencyImprovement: Math.round((optimizedEfficiency - currentBatchEfficiency) * 10) / 10,
          materialSavings: Math.round(wastedMaterial * materialCostPerUnit * 100) / 100
        },
        recommendations: [
          recommendedBatchSize !== batchSize ? `Consider changing batch size from ${batchSize} to ${recommendedBatchSize} for optimal efficiency` : 'Current batch size is near optimal',
          setupTimeRatio > 20 ? 'High setup time ratio - consider larger batch sizes or setup time reduction' : 'Setup time ratio is acceptable',
          materialUtilization < 80 ? 'Material utilization is low - consider optimizing part nesting' : 'Material utilization is good',
          processingEfficiency < 70 ? 'Processing efficiency is low - review batch configuration' : 'Processing efficiency is acceptable'
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
        calculatorId="batch-processing-calculator"
        name="Batch Processing Calculator"
        description="Optimize batch processing for laser cutting operations. Calculate optimal batch sizes, minimize setup times, and maximize production efficiency through intelligent batching strategies."
        category="Production Management"
        keywords={[
          'batch processing calculator',
          'batch size optimization',
          'production batching tool',
          'setup time minimization',
          'batch efficiency calculator',
          'production optimization',
          'manufacturing batch planning',
          'laser cutting batch processing'
        ]}
        features={[
          'Optimal batch size calculation',
          'Setup time minimization',
          'Production efficiency optimization',
          'Cost analysis per batch',
          'Material utilization tracking',
          'Time savings calculation',
          'Batch scheduling optimization',
          'Production planning support'
        ]}
        difficulty="intermediate"
        estimatedTime="< 2s"
        relatedCalculators={[
          'production-capacity-planner',
          'job-queue-optimizer',
          'setup-time-calculator',
          'material-nesting-optimizer'
        ]}
      />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Batch Processing Calculator</h1>
          <p className="text-muted-foreground">
            Optimize batch processing for laser cutting operations. Calculate optimal batch sizes, minimize setup times, 
            and maximize production efficiency through intelligent batching strategies.
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
            <BatchProcessingCalculatorForm 
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" 
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ready to Optimize</h3>
                  <p className="text-muted-foreground max-w-md">
                    Configure your batch parameters, part specifications, and operational constraints, 
                    then click "Optimize Batch Processing" to see the most efficient batching strategy.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Optimization Complete!</strong> Generated{' '}
                    <strong>{results.optimizedBatching.totalBatches}</strong> optimized batches with{' '}
                    <strong>{results.optimizedBatching.batchingEfficiency.toFixed(1)}%</strong> efficiency.
                    Estimated time savings: <strong>{results.timeAnalysis.timeOptimization.toFixed(1)} hours</strong>.
                  </AlertDescription>
                </Alert>
                
                <BatchProcessingCalculatorResults results={results} />
              </div>
            )}
          </div>
        </div>

        {/* Export Tools */}
        {results && (
          <div className="mt-8">
            <BatchProcessingExportTools results={results} />
          </div>
        )}

        {/* Full Width Sections - Same width as page container */}
        <div className="mt-12 space-y-12">
          {/* Formula Explanation */}
          <BatchProcessingFormulaExplanation />

          {/* Related Tools - Full container width */}
          <BatchProcessingRelatedTools />

          {/* Educational Content - Full container width */}
          <BatchProcessingEducationalContent />

          {/* FAQ Section - 80% width on desktop, Accordion style */}
          <div className="w-full lg:w-4/5 mx-auto">
            <BatchProcessingFAQ />
          </div>
        </div>

        {/* Tips and Best Practices */}
        <div className="mt-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Batch Processing Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Batching Strategies:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Material-based:</strong> Group by material type for minimal changeovers</li>
                  <li>• <strong>Thickness-based:</strong> Group by thickness to reduce setup time</li>
                  <li>• <strong>Size-based:</strong> Group by part size for better nesting</li>
                  <li>• <strong>Mixed optimization:</strong> Balance all factors for maximum efficiency</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Efficiency Optimization:</h4>
                <ul className="space-y-1">
                  <li>• Minimize setup and changeover times</li>
                  <li>• Balance batch size with inventory costs</li>
                  <li>• Consider due dates and priorities</li>
                  <li>• Plan for quality control checkpoints</li>
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

export default BatchProcessingCalculatorComponent;

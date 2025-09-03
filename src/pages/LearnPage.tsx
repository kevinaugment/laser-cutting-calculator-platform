import React, { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { BookOpen, Loader2 } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

// Dynamic imports for Learn pages
const LaserCuttingCostLearn = lazy(() => import('./learn/LaserCuttingCostLearn'));
const CuttingTimeEstimatorLearn = lazy(() => import('./learn/CuttingTimeEstimatorLearn'));
const LaserParameterOptimizerLearn = lazy(() => import('./learn/LaserParameterOptimizerLearn'));
const KerfWidthCalculatorLearn = lazy(() => import('./learn/KerfWidthCalculatorLearn'));
const PowerRequirementCalculatorLearn = lazy(() => import('./learn/PowerRequirementCalculatorLearn'));
const ProductionCapacityPlannerLearn = lazy(() => import('./learn/ProductionCapacityPlannerLearn'));
const QualityGradePredictorLearn = lazy(() => import('./learn/QualityGradePredictorLearn'));
const GasConsumptionCalculatorLearn = lazy(() => import('./learn/GasConsumptionCalculatorLearn'));
const EnergyCostCalculatorLearn = lazy(() => import('./learn/EnergyCostCalculatorLearn'));
const BatchProcessingOptimizerLearn = lazy(() => import('./learn/BatchProcessingOptimizerLearn'));
const MaintenanceCostEstimatorLearn = lazy(() => import('./learn/MaintenanceCostEstimatorLearn'));
const CompetitivePricingAnalyzerLearn = lazy(() => import('./learn/CompetitivePricingAnalyzerLearn'));
const EquipmentComparisonToolLearn = lazy(() => import('./learn/EquipmentComparisonToolLearn'));
const MaterialCostLearn = lazy(() => import('./learn/MaterialCostLearn'));
const ROICalculatorLearn = lazy(() => import('./learn/ROICalculatorLearn'));
const MachineUtilizationLearn = lazy(() => import('./learn/MachineUtilizationLearn'));
const OEECalculatorLearn = lazy(() => import('./learn/OEECalculatorLearn'));
const StrategicPlanningLearn = lazy(() => import('./learn/StrategicPlanningLearn'));

const LearnPage: React.FC = () => {
  const { calculatorId } = useParams<{ calculatorId: string }>();

  // Generate SEO data based on calculator ID
  const getSEOData = (calcId: string | undefined) => {
    if (!calcId) {
      return {
        title: 'Learning Center - Laser Cutting Calculator Guides',
        description: 'Comprehensive learning guides and tutorials for laser cutting calculators. Master cost analysis, parameter optimization, quality control, and process efficiency.',
        keywords: 'laser cutting tutorials, calculator guides, manufacturing education, process optimization, cost analysis training'
      };
    }

    const calculatorNames: Record<string, string> = {
      'laser-cutting-cost': 'Laser Cutting Cost Calculator',
      'cutting-time-estimator': 'Cutting Time Estimator',
      'laser-parameter-optimizer': 'Laser Parameter Optimizer',
      'kerf-width-calculator': 'Kerf Width Calculator',
      'power-requirement-calculator': 'Power Requirement Calculator',
      'production-capacity-planner': 'Production Capacity Planner',
      'quality-grade-predictor': 'Quality Grade Predictor',
      'gas-consumption-calculator': 'Gas Consumption Calculator',
      'energy-cost-calculator': 'Energy Cost Calculator',
      'batch-processing-optimizer': 'Batch Processing Optimizer',
      'maintenance-cost-estimator': 'Maintenance Cost Estimator',
      'competitive-pricing-analyzer': 'Competitive Pricing Analyzer',
      'equipment-comparison-tool': 'Equipment Comparison Tool',
      'material-cost': 'Material Cost Calculator',
      'roi-calculator': 'ROI Calculator',
      'machine-utilization': 'Machine Utilization Calculator',
      'oee-calculator': 'OEE Calculator',
      'strategic-planning': 'Strategic Planning Tool'
    };

    const calculatorName = calculatorNames[calcId] || 'Calculator';

    return {
      title: `${calculatorName} - Learning Guide & Tutorial`,
      description: `Master the ${calculatorName} with comprehensive tutorials, practical examples, best practices, and industry standards. Learn to optimize your laser cutting operations effectively.`,
      keywords: `${calculatorName.toLowerCase()} tutorial, laser cutting guide, ${calcId.replace(/-/g, ' ')} learning, manufacturing calculator training, process optimization education`
    };
  };

  const seoData = getSEOData(calculatorId);

  // Map calculator IDs to their corresponding Learn components
  const learnComponentMap: Record<string, React.ComponentType> = {
    'laser-cutting-cost': LaserCuttingCostLearn,
    'cutting-time-estimator': CuttingTimeEstimatorLearn,
    'laser-parameter-optimizer': LaserParameterOptimizerLearn,
    'kerf-width-calculator': KerfWidthCalculatorLearn,
    'power-requirement-calculator': PowerRequirementCalculatorLearn,
    'production-capacity-planner': ProductionCapacityPlannerLearn,
    'quality-grade-predictor': QualityGradePredictorLearn,
    'gas-consumption-calculator': GasConsumptionCalculatorLearn,
    'energy-cost-calculator': EnergyCostCalculatorLearn,
    'batch-processing-optimizer': BatchProcessingOptimizerLearn,
    'maintenance-cost-estimator': MaintenanceCostEstimatorLearn,
    'competitive-pricing-analyzer': CompetitivePricingAnalyzerLearn,
    'equipment-comparison-tool': EquipmentComparisonToolLearn,
    'material-cost': MaterialCostLearn,
    'roi-calculator': ROICalculatorLearn,
    'machine-utilization': MachineUtilizationLearn,
    'oee-calculator': OEECalculatorLearn,
    'strategic-planning': StrategicPlanningLearn,
  };

  const LearnComponent = calculatorId ? learnComponentMap[calculatorId] : null;

  // If we have a specific Learn component, render it
  if (LearnComponent) {
    return (
      <>
        <SEOHead
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          canonical={`/learn/${calculatorId}`}
          type="article"
        />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading learning content...</span>
            </div>
          </div>
        }>
          <LearnComponent />
        </Suspense>
      </>
    );
  }

  // Fallback for calculators without specific Learn pages
  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical="/learn"
        type="website"
      />
      <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Calculator Learning Guide</h1>
            <p className="text-xl text-muted-foreground">
              Learn how to effectively use this calculator for optimal results
            </p>
          </div>
        </div>
      </div>

      {/* Learning Approach */}
      <section className="bg-blue-50 rounded-2xl p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How I Approach Learning Laser Cutting
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Based on my experience in manufacturing, here's how I recommend learning to use these calculators effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Start with Real Problems</h3>
            <p className="text-gray-600 text-sm">
              Don't learn calculators in isolation. Start with an actual job you need to quote or optimize.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Compare with Experience</h3>
            <p className="text-gray-600 text-sm">
              Use the calculator results as a starting point, then adjust based on your actual shop conditions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-bold">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Your Results</h3>
            <p className="text-gray-600 text-sm">
              Keep notes on how calculator predictions compare to actual results. This improves your accuracy over time.
            </p>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recommended Learning Path
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            If you're new to laser cutting calculations, here's the order I recommend learning these tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-2">Week 1: Basics</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Laser Cutting Cost Calculator</li>
              <li>• Cutting Time Estimator</li>
              <li>• Material Selection Assistant</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Master the fundamentals first</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="font-semibold text-gray-900 mb-2">Week 2: Parameters</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Laser Parameter Optimizer</li>
              <li>• Gas Pressure Setting Guide</li>
              <li>• Focus Height Calculator</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Optimize your machine settings</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-semibold text-gray-900 mb-2">Week 3: Quality</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Edge Quality Predictor</li>
              <li>• Kerf Width Calculator</li>
              <li>• Warping Risk Calculator</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Achieve consistent quality</p>
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-orange-500">
            <h3 className="font-semibold text-gray-900 mb-2">Week 4: Advanced</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Production Capacity Planner</li>
              <li>• Material Nesting Optimizer</li>
              <li>• ROI Calculator</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">Optimize your entire operation</p>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="bg-red-50 rounded-2xl p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Common Mistakes I See
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Based on my experience helping people use these calculators, here are the most common mistakes to avoid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-red-900 mb-3">❌ Don't Do This</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Using generic material properties for specialized alloys</li>
              <li>• Ignoring your specific machine characteristics</li>
              <li>• Not accounting for setup and handling time</li>
              <li>• Trusting calculations without real-world validation</li>
              <li>• Using the same parameters for all thicknesses</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">✅ Do This Instead</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Test calculations with small sample cuts first</li>
              <li>• Adjust for your specific machine and conditions</li>
              <li>• Include realistic setup and material handling time</li>
              <li>• Keep a log of actual vs. predicted results</li>
              <li>• Fine-tune parameters for each material/thickness combo</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Generic Learning Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                This calculator helps you make informed decisions for your laser cutting operations.
                Enter accurate data for the best results.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Review the calculated results and recommendations to optimize your operations.
                Regular use and data updates will improve accuracy and decision-making.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">For best results:</p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Use accurate, up-to-date data</li>
                      <li>• Review all input parameters</li>
                      <li>• Consider market conditions</li>
                      <li>• Validate results with experience</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default LearnPage;

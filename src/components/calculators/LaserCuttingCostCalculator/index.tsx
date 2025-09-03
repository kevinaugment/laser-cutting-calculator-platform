import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import CalculatorSEOHead from '../../seo/CalculatorSEOHead';
import LaserCuttingCostCalculatorForm from './LaserCuttingCostCalculatorForm';
import LaserCuttingCostCalculatorResults from './LaserCuttingCostCalculatorResults';
import LaserCuttingCostFormulaExplanation from './LaserCuttingCostFormulaExplanation';
import LaserCuttingCostExportTools from './LaserCuttingCostExportTools';
import LaserCuttingCostRelatedTools from './LaserCuttingCostRelatedTools';
import LaserCuttingCostEducationalContent from './LaserCuttingCostEducationalContent';
import LaserCuttingCostFAQ from './LaserCuttingCostFAQ';

// Simple inline calculator logic to replace missing service
const calculateLaserCuttingCost = (inputs: any) => {
  const {
    materialType = 'Mild Steel',
    thickness = 3,
    length = 1000,
    width = 500,
    quantity = 1,
    materialCost = 2.5,
    laserPower = 1500,
    cuttingSpeed = 2500,
    gasType = 'Oxygen',
    gasConsumption = 0.8,
    gasCost = 0.15,
    electricityRate = 0.12,
    laborRate = 25,
    machineHourlyRate = 45,
    setupTime = 15,
    wasteFactor = 0.1
  } = inputs;

  // Basic calculations
  const area = (length * width) / 1000000; // Convert to m²
  const perimeter = 2 * (length + width) / 1000; // Convert to m
  const cuttingTime = perimeter / (cuttingSpeed / 60); // minutes
  const totalTime = cuttingTime + setupTime;

  const materialCostTotal = area * materialCost * quantity * (1 + wasteFactor);
  const gasCostTotal = (cuttingTime / 60) * gasConsumption * gasCost * quantity;
  const electricityCost = (totalTime / 60) * (laserPower / 1000) * electricityRate * quantity;
  const laborCostTotal = (totalTime / 60) * laborRate * quantity;
  const machineCost = (totalTime / 60) * machineHourlyRate * quantity;

  const totalCost = materialCostTotal + gasCostTotal + electricityCost + laborCostTotal + machineCost;

  return {
    success: true,
    data: {
      totalCost: Math.round(totalCost * 100) / 100,
      breakdown: {
        material: Math.round(materialCostTotal * 100) / 100,
        gas: Math.round(gasCostTotal * 100) / 100,
        electricity: Math.round(electricityCost * 100) / 100,
        labor: Math.round(laborCostTotal * 100) / 100,
        machine: Math.round(machineCost * 100) / 100
      },
      timeEstimate: Math.round(totalTime * 100) / 100,
      efficiency: Math.round((cuttingTime / totalTime) * 100)
    }
  };
};

const LaserCuttingCostCalculatorComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (inputs: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Transform inputs to match the calculator interface
      const calculatorInputs = {
        materialType: inputs.materialType || 'Mild Steel',
        thickness: inputs.thickness || 3,
        dimensions: {
          length: inputs.length || 1000,
          width: inputs.width || 500
        },
        quantity: inputs.quantity || 1,
        materialCost: inputs.materialCost || 2.5,
        laserPower: inputs.laserPower || 1500,
        cuttingSpeed: inputs.cuttingSpeed || 2500,
        gasType: inputs.gasType || 'Oxygen',
        gasConsumption: inputs.gasConsumption || 0.8,
        gasCost: inputs.gasCost || 0.15,
        electricityRate: inputs.electricityRate || 0.12,
        laborRate: inputs.laborRate || 25,
        machineHourlyRate: inputs.machineHourlyRate || 45,
        setupTime: inputs.setupTime || 15,
        wasteFactor: inputs.wasteFactor || 0.1
      };

      const calculationResults = calculateLaserCuttingCost(calculatorInputs);
      setResults(calculationResults);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during calculation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CalculatorSEOHead
        calculatorId="laser-cutting-cost"
        name="Laser Cutting Cost Calculator"
        description="Calculate comprehensive laser cutting costs including materials, labor, overhead, and optimization recommendations for manufacturing operations."
        category="Core Engineering"
        keywords={[
          'laser cutting cost',
          'manufacturing cost calculator',
          'laser cutting pricing',
          'production cost analysis',
          'material cost calculation',
          'laser cutting quotes'
        ]}
        features={[
          'Comprehensive cost breakdown',
          'Material cost optimization',
          'Labor cost calculation',
          'Overhead analysis',
          'Profit margin calculation',
          'Export functionality'
        ]}
        difficulty="intermediate"
        estimatedTime="< 1s"
        relatedCalculators={[
          'cutting-time-estimator',
          'material-selection-assistant',
          'gas-consumption-calculator'
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laser Cutting Cost Calculator</h1>
            <p className="mt-2 text-lg text-gray-600">
              Calculate comprehensive laser cutting costs with detailed breakdown and optimization recommendations
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Cost Analysis
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              AI Enhanced
            </span>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <nav className="flex mt-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                title="Return to Home Page"
                aria-label="Navigate back to home page"
              >
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-500">Calculator</span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-500">Laser cutting cost</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Calculation Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {results && !error && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Calculation Complete!</strong> Total cost: ${results.totalCost?.toFixed(2)} | Cost per piece: ${results.costPerPiece?.toFixed(2)}
          </AlertDescription>
        </Alert>
      )}

      {/* Input Form and Results - Full Width */}
      <LaserCuttingCostCalculatorForm
        onCalculate={handleCalculate}
        isLoading={isLoading}
      />

      {/* Results Section */}
      {results && (
        <div className="mt-8">
          <LaserCuttingCostCalculatorResults results={results} />
        </div>
      )}

      {/* Export Tools */}
      {results && (
        <div className="mt-8">
          <LaserCuttingCostExportTools results={results} />
        </div>
      )}

      {/* Full Width Sections - Same width as page container */}
      <div className="mt-12 space-y-12">
        {/* Formula Explanation */}
        <LaserCuttingCostFormulaExplanation />

        {/* Related Tools - Full container width */}
        <LaserCuttingCostRelatedTools />

        {/* Educational Content - Full container width */}
        <LaserCuttingCostEducationalContent />

        {/* FAQ Section - 80% width on desktop, Accordion style */}
        <div className="w-full lg:w-4/5 mx-auto">
          <LaserCuttingCostFAQ />
        </div>
      </div>


      </div>
    </>
  );
};

export default LaserCuttingCostCalculatorComponent;

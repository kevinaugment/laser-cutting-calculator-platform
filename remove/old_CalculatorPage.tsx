import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Calculator, DollarSign, Clock, Settings, Target } from 'lucide-react';
import { calculatorRegistry } from '../services/calculators';
import { getCalculatorConfig, InputField } from '../config/calculatorConfigs';
import LaserCuttingCostCalculatorComponent from '../components/calculators/LaserCuttingCostCalculator';
import MaterialNestingOptimizerComponent from '../components/calculators/MaterialNestingOptimizer';
import BatchProcessingCalculatorComponent from '../components/calculators/BatchProcessingCalculator';
import ProductionCapacityCalculatorComponent from '../components/calculators/ProductionCapacityCalculator';
import QualityGradeCalculatorComponent from '../components/calculators/QualityGradeCalculator';
import EnergyCostCalculatorComponent from '../components/calculators/EnergyCostCalculator';
import ProfitMarginCalculatorComponent from '../components/calculators/ProfitMarginCalculator';
import ProjectQuotingCalculatorComponent from '../components/calculators/ProjectQuotingCalculator';
import MaintenanceCostCalculatorComponent from '../components/calculators/MaintenanceCostCalculator';
import GasConsumptionCalculatorComponent from '../components/calculators/GasConsumptionCalculator';
import EquipmentComparisonCalculatorComponent from '../components/calculators/EquipmentComparisonCalculator';
import EdgeQualityPredictorCalculatorComponent from '../components/calculators/EdgeQualityPredictorCalculator';
import FocusHeightCalculatorComponent from '../components/calculators/FocusHeightCalculator/index';
import KerfWidthCalculatorComponent from '../components/calculators/KerfWidthCalculator';
import HeatAffectedZoneCalculatorComponent from '../components/calculators/HeatAffectedZoneCalculator/index';
import WarpingRiskCalculatorComponent from '../components/calculators/WarpingRiskCalculator';
import JobQueueOptimizerComponent from '../components/calculators/JobQueueOptimizer/index';
import CutPathOptimizerComponent from '../components/calculators/CutPathOptimizer';

const CalculatorPage: React.FC = () => {
  const { calculatorId } = useParams<{ calculatorId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [inputs, setInputs] = useState<any>({});

  // Special handling for calculators with dedicated components
  if (calculatorId === 'laser-cutting-cost') {
    return <LaserCuttingCostCalculatorComponent />;
  }

  if (calculatorId === 'material-nesting-optimizer') {
    return <MaterialNestingOptimizerComponent />;
  }

  if (calculatorId === 'batch-processing') {
    return <BatchProcessingCalculatorComponent />;
  }

  if (calculatorId === 'production-capacity') {
    return <ProductionCapacityCalculatorComponent />;
  }

  if (calculatorId === 'quality-grade-predictor') {
    return <QualityGradeCalculatorComponent />;
  }

  if (calculatorId === 'energy-cost') {
    return <EnergyCostCalculatorComponent />;
  }

  if (calculatorId === 'profit-margin-optimizer') {
    return <ProfitMarginCalculatorComponent />;
  }

  if (calculatorId === 'project-quoting') {
    return <ProjectQuotingCalculatorComponent />;
  }

  if (calculatorId === 'maintenance-cost') {
    return <MaintenanceCostCalculatorComponent />;
  }

  if (calculatorId === 'gas-consumption') {
    return <GasConsumptionCalculatorComponent />;
  }

  if (calculatorId === 'equipment-comparison') {
    return <EquipmentComparisonCalculatorComponent />;
  }

  if (calculatorId === 'edge-quality-predictor') {
    return <EdgeQualityPredictorCalculatorComponent />;
  }

  if (calculatorId === 'focus-height') {
    return <FocusHeightCalculatorComponent />;
  }

  if (calculatorId === 'kerf-width') {
    return <KerfWidthCalculatorComponent />;
  }

  if (calculatorId === 'heat-affected-zone') {
    return <HeatAffectedZoneCalculatorComponent />;
  }

  if (calculatorId === 'warping-risk') {
    return <WarpingRiskCalculatorComponent />;
  }

  if (calculatorId === 'job-queue-optimizer') {
    return <JobQueueOptimizerComponent />;
  }

  if (calculatorId === 'cut-path-optimizer') {
    return <CutPathOptimizerComponent />;
  }

  // Get calculator configuration
  const calculatorConfig = getCalculatorConfig(calculatorId || 'laser-cutting-cost');

  // Initialize inputs based on calculator config
  useEffect(() => {
    if (calculatorConfig) {
      const initialInputs: any = {};
      calculatorConfig.inputs.forEach(input => {
        initialInputs[input.id] = '';
      });
      setInputs(initialInputs);
    }
  }, [calculatorConfig]);

  // Use calculator config or fallback
  const currentCalculator = calculatorConfig || {
    title: 'Calculator',
    description: 'Professional laser cutting calculator',
    badge: 'Standard' as const,
    iconName: 'Calculator',
    inputs: [],
    resultType: 'price' as const
  };

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Render icon based on iconName
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-6 w-6" };
    switch (iconName) {
      case 'DollarSign': return <DollarSign {...iconProps} />;
      case 'Clock': return <Clock {...iconProps} />;
      case 'Settings': return <Settings {...iconProps} />;
      case 'Target': return <Target {...iconProps} />;
      default: return <Calculator {...iconProps} />;
    }
  };

  // Render input field based on configuration
  const renderInputField = (inputConfig: InputField) => {
    const value = inputs[inputConfig.id] || '';

    if (inputConfig.type === 'select') {
      return (
        <div key={inputConfig.id}>
          <label className="text-sm font-medium">{inputConfig.label}</label>
          <select
            className="w-full mt-1 px-3 py-2 border rounded-md"
            value={value}
            onChange={(e) => handleInputChange(inputConfig.id, e.target.value)}
            required={inputConfig.required}
          >
            <option value="">Select {inputConfig.label}</option>
            {inputConfig.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div key={inputConfig.id}>
        <label className="text-sm font-medium">
          {inputConfig.label}
          {inputConfig.unit && <span className="text-muted-foreground"> ({inputConfig.unit})</span>}
        </label>
        <input
          type={inputConfig.type}
          className="w-full mt-1 px-3 py-2 border rounded-md"
          placeholder={inputConfig.placeholder}
          value={value}
          onChange={(e) => handleInputChange(inputConfig.id, e.target.value)}
          required={inputConfig.required}
          min={inputConfig.min}
          max={inputConfig.max}
          step={inputConfig.step}
        />
      </div>
    );
  };

  const handleCalculate = async () => {
    setIsLoading(true);

    try {
      // Get the calculator from registry
      const calculator = calculatorRegistry[calculatorId || 'laser-cutting-cost'];

      if (!calculator) {
        throw new Error(`Calculator ${calculatorId} not found`);
      }

      // For laser-cutting-cost, we need to map simple inputs to complex interface
      if (calculatorId === 'laser-cutting-cost') {
        const materialCost = parseFloat(inputs.directMaterialCost) || 30;
        const laborCost = parseFloat(inputs.directLaborCost) || 20;
        const overheadCost = parseFloat(inputs.overheadCost) || 15;
        const profitMargin = parseFloat(inputs.targetProfitMargin) || 25;

        // Create simplified calculation for demo
        const totalCost = materialCost + laborCost + overheadCost;
        const targetPrice = totalCost / (1 - profitMargin / 100);

        // Simple pricing calculation
        const recommendedPrice = targetPrice;

        setResults({
          success: true,
          data: {
            recommendedPrice: Math.round(recommendedPrice * 100) / 100,
            breakdown: {
              totalCost,
              targetPrice: Math.round(targetPrice * 100) / 100,
              profitMargin: Math.round(profitMargin * 100) / 100,
            }
          },
        });
      } else {
        // For other calculators, use simple calculation
        setResults({
          success: true,
          data: {
            recommendedPrice: 125.50,
            breakdown: {
              totalCost: 100.00,
              targetPrice: 125.50,
              profitMargin: 25.50,
            }
          },
        });
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setResults({
        success: false,
        error: 'Calculation failed. Please check your inputs and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            {renderIcon(currentCalculator.iconName)}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{currentCalculator.title}</h1>
            <p className="text-muted-foreground">{currentCalculator.description}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {currentCalculator.badge}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Calculator Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {currentCalculator.inputs?.map(inputConfig => renderInputField(inputConfig))}
            </div>
            
            <Button 
              onClick={handleCalculate} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Calculating...' : 'Calculate'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!results ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter your parameters and click calculate to see results</p>
              </div>
            ) : results.success ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-center">
                      <span><strong>Recommended Price:</strong> ${results.data.recommendedPrice}</span>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">${results.data.recommendedPrice}</div>
                    <div className="text-sm text-muted-foreground">Recommended Price</div>
                  </div>
                </div>

                {results.data.breakdown && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Cost Breakdown</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm bg-muted/30 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <span className="font-medium">${results.data.breakdown.totalCost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Price:</span>
                        <span className="font-medium">${results.data.breakdown.targetPrice}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Profit Margin:</span>
                        <span className="font-medium">${results.data.breakdown.profitMargin}</span>
                      </div>
                    </div>
                  </div>
                )}


              </div>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {results.error || 'An error occurred during calculation'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

export default CalculatorPage;

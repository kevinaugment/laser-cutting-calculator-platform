import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calculator, 
  Home, 
  ChevronRight, 
  Settings, 
  BarChart3, 
  BookOpen, 
  Users, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

// Import Template Components
import FormulaExplanationTemplate, { FormulaExplanationConfig } from './FormulaExplanation/FormulaExplanationTemplate';
import RelatedToolsTemplate, { RelatedToolsConfig } from './RelatedTools/RelatedToolsTemplate';
import EnhancedInputTemplate from './EnhancedInput/EnhancedInputTemplate';
import ResultsDisplayTemplate from './ResultsDisplay/ResultsDisplayTemplate';
import ExportToolsTemplate, { ExportConfig } from './ExportTools/ExportToolsTemplate';

// Import Types
import { 
  CalculatorConfig, 
  CalculatorMetadata, 
  BreadcrumbItem, 
  InputTabConfig, 
  ValidationResult,
  CalculationResult,
  TemplateConfig
} from './types/CalculatorTypes';
import { ResultsDisplayConfig, CostSummary, DisplayConfig } from './types/ResultTypes';

// Main Calculator Page Template Props
interface CalculatorPageTemplateProps {
  // Core Configuration
  calculatorConfig: CalculatorConfig;
  metadata: CalculatorMetadata;
  breadcrumbs: BreadcrumbItem[];
  
  // Input Configuration
  inputTabs: InputTabConfig[];
  initialValues: { [key: string]: any };
  
  // Template Configuration
  templateConfig: TemplateConfig;
  
  // Component Configurations
  formulaConfig?: FormulaExplanationConfig;
  relatedToolsConfig?: RelatedToolsConfig;
  resultsDisplayConfig?: ResultsDisplayConfig;
  exportConfig?: ExportConfig;
  displayConfig: DisplayConfig;
  
  // Event Handlers
  onCalculate: (input: any) => Promise<CalculationResult>;
  onValidate?: (input: any) => ValidationResult;
  onExport?: (format: string, data: any) => void;
  onShare?: (url: string, method: string) => void;
  onSavePreset?: (preset: any) => void;
  
  // Optional Props
  className?: string;
  customSections?: React.ReactNode[];
}

const CalculatorPageTemplate: React.FC<CalculatorPageTemplateProps> = ({
  calculatorConfig,
  metadata,
  breadcrumbs,
  inputTabs,
  initialValues,
  templateConfig,
  formulaConfig,
  relatedToolsConfig,
  resultsDisplayConfig,
  exportConfig,
  displayConfig,
  onCalculate,
  onValidate,
  onExport,
  onShare,
  onSavePreset,
  className = '',
  customSections = []
}) => {
  // State Management
  const [inputValues, setInputValues] = useState(initialValues);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [validationWarnings, setValidationWarnings] = useState<{ [key: string]: string }>({});
  const [validationResult, setValidationResult] = useState<ValidationResult | undefined>();
  const [calculationResult, setCalculationResult] = useState<CalculationResult | undefined>();
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Handle Input Changes
  const handleInputChange = (field: string, value: any) => {
    const newValues = { ...inputValues, [field]: value };
    setInputValues(newValues);
    
    // Clear previous errors for this field
    if (validationErrors[field]) {
      const newErrors = { ...validationErrors };
      delete newErrors[field];
      setValidationErrors(newErrors);
    }
    
    // Real-time validation if enabled
    if (templateConfig.enableRealTimeCalculation && onValidate) {
      const validation = onValidate(newValues);
      setValidationResult(validation);
      
      // Update field-specific errors
      const fieldErrors: { [key: string]: string } = {};
      const fieldWarnings: { [key: string]: string } = {};
      
      validation.errors.forEach(error => {
        fieldErrors[error.field] = error.message;
      });
      
      validation.warnings.forEach(warning => {
        fieldWarnings[warning.field] = warning.message;
      });
      
      setValidationErrors(fieldErrors);
      setValidationWarnings(fieldWarnings);
    }
  };

  // Handle Calculation
  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Validate inputs first
      if (onValidate) {
        const validation = onValidate(inputValues);
        setValidationResult(validation);
        
        if (!validation.isValid) {
          const fieldErrors: { [key: string]: string } = {};
          validation.errors.forEach(error => {
            fieldErrors[error.field] = error.message;
          });
          setValidationErrors(fieldErrors);
          setIsCalculating(false);
          return;
        }
      }
      
      // Perform calculation
      const result = await onCalculate(inputValues);
      setCalculationResult(result);
      setHasCalculated(true);
      
      if (!result.success && result.error) {
        // Handle calculation errors
        console.error('Calculation failed:', result.error);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setCalculationResult({
        success: false,
        error: 'Calculation failed. Please check your inputs and try again.'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle Reset
  const handleReset = () => {
    setInputValues(initialValues);
    setValidationErrors({});
    setValidationWarnings({});
    setValidationResult(undefined);
    setCalculationResult(undefined);
    setHasCalculated(false);
  };

  // Render Breadcrumbs
  const renderBreadcrumbs = () => {
    if (!templateConfig.showBreadcrumbs) return null;
    
    return (
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4" />}
            {item.href ? (
              <a href={item.href} className="hover:text-blue-600">
                {item.label}
              </a>
            ) : (
              <span className={item.active ? 'text-gray-900 font-medium' : ''}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  // Render Page Header
  const renderHeader = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{metadata.title}</h1>
            <p className="text-gray-600">{metadata.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{metadata.category}</Badge>
          <Badge variant="secondary">{metadata.difficulty}</Badge>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{metadata.description}</p>
      
      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Est. time: {metadata.estimatedTime}</span>
        </div>
        <div className="flex items-center">
          <Settings className="h-4 w-4 mr-1" />
          <span>Last updated: {metadata.lastUpdated}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${className}`}>
      {/* Breadcrumbs */}
      {renderBreadcrumbs()}
      
      {/* Page Header */}
      {renderHeader()}
      
      {/* Custom Sections - Before Input */}
      {customSections.filter((_, index) => 
        templateConfig.customSections?.[index]?.position === 'before-input'
      )}
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Input */}
        <div className="lg:col-span-2 space-y-8">
          {/* Enhanced Input */}
          <EnhancedInputTemplate
            title={`${calculatorConfig.name} Parameters`}
            description="Configure your calculation parameters below"
            tabs={inputTabs}
            values={inputValues}
            errors={validationErrors}
            warnings={validationWarnings}
            validationResult={validationResult}
            onInputChange={handleInputChange}
            onCalculate={handleCalculate}
            onReset={handleReset}
            onSavePreset={onSavePreset}
            isCalculating={isCalculating}
          />
          
          {/* Custom Sections - After Input */}
          {customSections.filter((_, index) => 
            templateConfig.customSections?.[index]?.position === 'after-input'
          )}
          
          {/* Results Display */}
          {hasCalculated && calculationResult?.success && resultsDisplayConfig && (
            <ResultsDisplayTemplate
              title={calculatorConfig.name}
              summary={calculationResult.data as CostSummary}
              sensitivityAnalysis={calculationResult.data?.sensitivityAnalysis}
              efficiencyMetrics={calculationResult.data?.efficiencyMetrics}
              recommendations={calculationResult.data?.recommendations}
              config={resultsDisplayConfig}
              displayConfig={displayConfig}
              onExport={onExport}
            />
          )}
          
          {/* Calculation Error Display */}
          {hasCalculated && !calculationResult?.success && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Calculation Failed</h3>
                    <p className="text-red-800">{calculationResult?.error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Custom Sections - After Results */}
          {customSections.filter((_, index) => 
            templateConfig.customSections?.[index]?.position === 'after-results'
          )}
        </div>
        
        {/* Right Column - Tools and Information */}
        <div className="space-y-8">
          {/* Export Tools */}
          {templateConfig.showExportTools && hasCalculated && calculationResult?.success && exportConfig && (
            <ExportToolsTemplate
              config={exportConfig}
              data={inputValues}
              results={calculationResult.data}
              onExport={(format, data) => onExport?.(format, data)}
              onShare={onShare}
            />
          )}
          
          {/* Formula Explanation */}
          {templateConfig.showFormulaExplanation && formulaConfig && (
            <FormulaExplanationTemplate config={formulaConfig} />
          )}
          
          {/* Related Tools */}
          {templateConfig.showRelatedTools && relatedToolsConfig && (
            <RelatedToolsTemplate config={relatedToolsConfig} />
          )}
        </div>
      </div>
      
      {/* Footer Information */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© 2024 Laser Calc Platform</span>
            <span>•</span>
            <span>Version {calculatorConfig.version}</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/privacy" className="hover:text-blue-600">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-blue-600">Terms of Service</a>
            <span>•</span>
            <a href="/support" className="hover:text-blue-600">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPageTemplate;

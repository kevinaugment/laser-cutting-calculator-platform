import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Settings, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Calculator,
  RefreshCw,
  Save,
  RotateCcw
} from 'lucide-react';
import { InputParameter, InputGroup, InputTabConfig, ValidationResult } from '../types/CalculatorTypes';

// Enhanced Input Components
interface ParameterInputProps {
  parameter: InputParameter;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  warning?: string;
  className?: string;
}

const ParameterInput: React.FC<ParameterInputProps> = ({
  parameter,
  value,
  onChange,
  error,
  warning,
  className = ''
}) => {
  const [selectedUnit, setSelectedUnit] = useState(parameter.unit?.primary || '');
  const [isFocused, setIsFocused] = useState(false);

  const handleValueChange = (newValue: any) => {
    // Convert value if unit changed
    if (parameter.unit && selectedUnit !== parameter.unit.primary) {
      const convertedValue = parameter.unit.converter(newValue, selectedUnit, parameter.unit.primary);
      onChange(convertedValue);
    } else {
      onChange(newValue);
    }
  };

  const getDisplayValue = () => {
    if (parameter.unit && selectedUnit !== parameter.unit.primary) {
      return parameter.unit.converter(value, parameter.unit.primary, selectedUnit);
    }
    return value;
  };

  const renderInput = () => {
    switch (parameter.type) {
      case 'number':
        return (
          <div className="relative">
            <input
              type="number"
              value={getDisplayValue() || ''}
              onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={parameter.placeholder}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                error ? 'border-red-500' : warning ? 'border-yellow-500' : 'border-gray-300'
              }`}
            />
            {parameter.unit && (
              <div className="absolute right-2 top-2">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="text-sm border-none bg-transparent focus:outline-none"
                >
                  <option value={parameter.unit.primary}>{parameter.unit.primary}</option>
                  {parameter.unit.alternatives.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : warning ? 'border-yellow-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select {parameter.label}</option>
            {parameter.options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{parameter.label}</span>
          </label>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value || parameter.min || 0}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{parameter.min}</span>
              <span className="font-medium">{value}</span>
              <span>{parameter.max}</span>
            </div>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={parameter.placeholder}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : warning ? 'border-yellow-500' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {parameter.label}
          {parameter.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {parameter.tooltip && (
          <div className="group relative">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
              {parameter.tooltip}
            </div>
          </div>
        )}
      </div>
      
      {renderInput()}
      
      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
      
      {warning && !error && (
        <div className="flex items-center text-sm text-yellow-600">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {warning}
        </div>
      )}
      
      {!error && !warning && isFocused && parameter.tooltip && (
        <div className="text-xs text-gray-500">
          <Info className="h-3 w-3 inline mr-1" />
          {parameter.tooltip}
        </div>
      )}
    </div>
  );
};

// Input Group Component
interface InputGroupComponentProps {
  group: InputGroup;
  values: { [key: string]: any };
  errors: { [key: string]: string };
  warnings: { [key: string]: string };
  onChange: (field: string, value: any) => void;
}

const InputGroupComponent: React.FC<InputGroupComponentProps> = ({
  group,
  values,
  errors,
  warnings,
  onChange
}) => {
  const [isExpanded, setIsExpanded] = useState(group.defaultExpanded !== false);

  return (
    <Card>
      <CardHeader 
        className={group.collapsible ? "cursor-pointer" : ""}
        onClick={() => group.collapsible && setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            {group.icon && <span className="mr-2">{group.icon}</span>}
            {group.title}
          </div>
          {group.collapsible && (
            <Button variant="ghost" size="sm">
              {isExpanded ? '−' : '+'}
            </Button>
          )}
        </CardTitle>
        {group.description && (
          <p className="text-sm text-gray-600">{group.description}</p>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.parameters.map((parameter) => (
              <ParameterInput
                key={parameter.id}
                parameter={parameter}
                value={values[parameter.id]}
                onChange={(value) => onChange(parameter.id, value)}
                error={errors[parameter.id]}
                warning={warnings[parameter.id]}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Main Enhanced Input Template
interface EnhancedInputTemplateProps {
  title: string;
  description?: string;
  tabs: InputTabConfig[];
  values: { [key: string]: any };
  errors: { [key: string]: string };
  warnings: { [key: string]: string };
  validationResult?: ValidationResult;
  onInputChange: (field: string, value: any) => void;
  onCalculate: () => void;
  onReset: () => void;
  onSavePreset?: () => void;
  isCalculating?: boolean;
  className?: string;
}

const EnhancedInputTemplate: React.FC<EnhancedInputTemplateProps> = ({
  title,
  description,
  tabs,
  values,
  errors,
  warnings,
  validationResult,
  onInputChange,
  onCalculate,
  onReset,
  onSavePreset,
  isCalculating = false,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const hasErrors = Object.keys(errors).length > 0;
  const hasWarnings = Object.keys(warnings).length > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              {tab.groups.map((group) => (
                <InputGroupComponent
                  key={group.id}
                  group={group}
                  values={values}
                  errors={errors}
                  warnings={warnings}
                  onChange={onInputChange}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Validation Summary */}
        {validationResult && !validationResult.isValid && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Validation Errors</h4>
            <ul className="space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-800 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-2" />
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button 
            onClick={onCalculate}
            disabled={hasErrors || isCalculating}
            className="flex-1 min-w-[200px]"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate {title}
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          {onSavePreset && (
            <Button variant="outline" onClick={onSavePreset}>
              <Save className="h-4 w-4 mr-2" />
              Save Preset
            </Button>
          )}
        </div>

        {/* Status Indicators */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {hasErrors && (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {Object.keys(errors).length} error(s)
              </div>
            )}
            {hasWarnings && (
              <div className="flex items-center text-yellow-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {Object.keys(warnings).length} warning(s)
              </div>
            )}
            {!hasErrors && !hasWarnings && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                All inputs valid
              </div>
            )}
          </div>
          
          <div className="text-gray-500">
            {Object.keys(values).length} parameters configured
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedInputTemplate;
export { ParameterInput, InputGroupComponent };

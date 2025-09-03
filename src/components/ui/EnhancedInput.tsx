import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, CheckCircle } from 'lucide-react';

// Simple className utility function
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface UnitOption {
  value: string;
  label: string;
  factor: number; // Conversion factor to base unit
}

interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  pattern?: RegExp;
  message?: string;
}

interface EnhancedInputProps {
  label: string;
  value: number | string;
  onChange: (value: number | string, unit?: string) => void;
  type?: 'number' | 'text';
  step?: string | number;
  units?: UnitOption[];
  defaultUnit?: string;
  validation?: ValidationRule;
  helpText?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showValidation?: boolean;
}

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  step,
  units = [],
  defaultUnit,
  validation,
  helpText,
  placeholder,
  className,
  disabled = false,
  showValidation = true
}) => {
  const [currentUnit, setCurrentUnit] = useState(defaultUnit || (units.length > 0 ? units[0].value : ''));
  const [validationState, setValidationState] = useState<'valid' | 'invalid' | 'warning' | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);

  // Validate input value
  useEffect(() => {
    if (!showValidation || !validation) return;

    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (validation.required && (value === '' || value === null || value === undefined)) {
      setValidationState('invalid');
      setValidationMessage('This field is required');
      return;
    }

    if (type === 'number' && !isNaN(numValue)) {
      if (validation.min !== undefined && numValue < validation.min) {
        setValidationState('invalid');
        setValidationMessage(`Value must be at least ${validation.min}`);
        return;
      }

      if (validation.max !== undefined && numValue > validation.max) {
        setValidationState('invalid');
        setValidationMessage(`Value must be at most ${validation.max}`);
        return;
      }

      // Warning for values near limits
      if (validation.min !== undefined && numValue < validation.min * 1.2) {
        setValidationState('warning');
        setValidationMessage(`Consider using values above ${validation.min * 1.2} for better results`);
        return;
      }

      if (validation.max !== undefined && numValue > validation.max * 0.8) {
        setValidationState('warning');
        setValidationMessage(`Values above ${validation.max * 0.8} may affect quality`);
        return;
      }
    }

    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      setValidationState('invalid');
      setValidationMessage(validation.message || 'Invalid format');
      return;
    }

    setValidationState('valid');
    setValidationMessage('');
  }, [value, validation, showValidation, type]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue, currentUnit);
  };

  const handleUnitChange = (newUnit: string) => {
    if (!units.length) return;
    
    const oldUnitOption = units.find(u => u.value === currentUnit);
    const newUnitOption = units.find(u => u.value === newUnit);
    
    if (oldUnitOption && newUnitOption && type === 'number') {
      // Convert value to new unit
      const baseValue = (typeof value === 'number' ? value : parseFloat(value.toString())) * oldUnitOption.factor;
      const convertedValue = baseValue / newUnitOption.factor;
      onChange(convertedValue, newUnit);
    }
    
    setCurrentUnit(newUnit);
  };

  const getValidationIcon = () => {
    switch (validationState) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getInputBorderClass = () => {
    if (!showValidation) return 'border-gray-300 focus:border-blue-500';
    
    switch (validationState) {
      case 'valid':
        return 'border-green-300 focus:border-green-500';
      case 'invalid':
        return 'border-red-300 focus:border-red-500';
      case 'warning':
        return 'border-yellow-300 focus:border-yellow-500';
      default:
        return 'border-gray-300 focus:border-blue-500';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        <div className={cn(
          'flex rounded-md shadow-sm',
          isFocused && 'ring-2 ring-blue-500 ring-opacity-20'
        )}>
          {/* Input Field */}
          <input
            type={type}
            step={step}
            value={value}
            onChange={handleValueChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 min-w-0 px-3 py-2 text-sm border rounded-l-md focus:outline-none focus:ring-0',
              getInputBorderClass(),
              units.length > 0 ? 'rounded-r-none border-r-0' : 'rounded-r-md',
              disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed'
            )}
          />

          {/* Unit Selector */}
          {units.length > 0 && (
            <select
              value={currentUnit}
              onChange={(e) => handleUnitChange(e.target.value)}
              disabled={disabled}
              className={cn(
                'px-3 py-2 text-sm border rounded-r-md focus:outline-none focus:ring-0 bg-gray-50',
                getInputBorderClass(),
                'border-l-0',
                disabled && 'cursor-not-allowed'
              )}
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          )}

          {/* Validation Icon */}
          {showValidation && validationState && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              {getValidationIcon()}
            </div>
          )}
        </div>
      </div>

      {/* Help Text and Validation Message */}
      <div className="space-y-1">
        {helpText && (
          <div className="flex items-start space-x-1 text-xs text-gray-500">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>{helpText}</span>
          </div>
        )}
        
        {showValidation && validationMessage && (
          <div className={cn(
            'flex items-start space-x-1 text-xs',
            validationState === 'invalid' && 'text-red-600',
            validationState === 'warning' && 'text-yellow-600',
            validationState === 'valid' && 'text-green-600'
          )}>
            {getValidationIcon()}
            <span>{validationMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedInput;

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  fullWidth = true,
  className = '',
  id,
  onChange,
  value,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseSelectClasses = 'block w-full rounded-lg border-secondary-300 shadow-sm transition-colors duration-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 appearance-none bg-white';
  
  const errorSelectClasses = error 
    ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
    : '';

  const sizeClasses = 'px-3 py-2 pr-10 text-sm';

  const selectClasses = [
    baseSelectClasses,
    errorSelectClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  const containerClasses = fullWidth ? 'w-full' : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          className={selectClasses}
          value={value}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className={`w-4 h-4 ${error ? 'text-red-400' : 'text-secondary-400'}`} />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-secondary-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;

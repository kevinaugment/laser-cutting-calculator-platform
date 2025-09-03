/**
 * Formatting Utilities
 * Common formatting functions for dates, numbers, durations, etc.
 */

/**
 * Format a date string or Date object for display
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return dateObj.toLocaleDateString(undefined, { ...defaultOptions, ...options });
}

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return formatDate(dateObj, { month: 'short', day: 'numeric' });
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  }
  
  const seconds = milliseconds / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(1)}m`;
  }
  
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}

/**
 * Format a number with appropriate precision and units
 */
export function formatNumber(
  value: number, 
  options?: {
    precision?: number;
    unit?: string;
    compact?: boolean;
    currency?: string;
  }
): string {
  const { precision = 2, unit, compact = false, currency } = options || {};
  
  if (currency) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(value);
  }
  
  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(undefined, {
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value) + (unit ? ` ${unit}` : '');
  }
  
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: precision,
  }).format(value);
  
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format percentage with appropriate precision
 */
export function formatPercentage(value: number, precision: number = 1): string {
  return `${(value * 100).toFixed(precision)}%`;
}

/**
 * Format calculator parameter value based on its type and context
 */
export function formatParameterValue(
  value: any, 
  parameterType?: string,
  unit?: string
): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number') {
    // Determine precision based on parameter type
    let precision = 2;
    if (parameterType === 'integer' || parameterType === 'count') {
      precision = 0;
    } else if (parameterType === 'percentage') {
      return formatPercentage(value);
    } else if (parameterType === 'currency') {
      return formatNumber(value, { currency: 'USD' });
    }
    
    return formatNumber(value, { precision, unit });
  }
  
  if (Array.isArray(value)) {
    return value.map(v => formatParameterValue(v, parameterType, unit)).join(', ');
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Format calculation result with appropriate units and precision
 */
export function formatCalculationResult(
  value: number,
  resultType: string,
  unit?: string
): string {
  switch (resultType) {
    case 'cost':
      return formatNumber(value, { currency: 'USD' });
    case 'time':
      return formatDuration(value * 1000); // Assume value is in seconds
    case 'percentage':
      return formatPercentage(value / 100);
    case 'weight':
      return formatNumber(value, { unit: unit || 'kg', precision: 3 });
    case 'length':
      return formatNumber(value, { unit: unit || 'mm', precision: 2 });
    case 'area':
      return formatNumber(value, { unit: unit || 'mm²', precision: 2 });
    case 'volume':
      return formatNumber(value, { unit: unit || 'mm³', precision: 2 });
    case 'power':
      return formatNumber(value, { unit: unit || 'W', precision: 1 });
    case 'speed':
      return formatNumber(value, { unit: unit || 'mm/min', precision: 0 });
    case 'pressure':
      return formatNumber(value, { unit: unit || 'bar', precision: 2 });
    case 'temperature':
      return formatNumber(value, { unit: unit || '°C', precision: 1 });
    default:
      return formatNumber(value, { unit, precision: 2 });
  }
}

/**
 * Format range values (min-max)
 */
export function formatRange(
  min: number, 
  max: number, 
  unit?: string,
  precision: number = 2
): string {
  const minFormatted = formatNumber(min, { precision });
  const maxFormatted = formatNumber(max, { precision });
  const unitStr = unit ? ` ${unit}` : '';
  
  return `${minFormatted} - ${maxFormatted}${unitStr}`;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format calculator type name for display
 */
export function formatCalculatorName(calculatorType: string): string {
  return calculatorType
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

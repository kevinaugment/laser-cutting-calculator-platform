/**
 * Initialize Calculators
 *
 * This module handles the initialization of all calculator services
 * and ensures they are properly configured for the application.
 */

import { calculatorRegistry } from '../services/calculators';

export interface CalculatorInitializationResult {
  success: boolean;
  initializedCount: number;
  errors: string[];
}

/**
 * Initialize all calculators in the registry
 */
export const initializeCalculators = async (): Promise<CalculatorInitializationResult> => {
  const errors: string[] = [];
  let initializedCount = 0;

  try {
    // Get all calculator IDs from the registry
    const calculatorIds = Object.keys(calculatorRegistry);

    console.log(`Initializing ${calculatorIds.length} calculators...`);

    // Initialize each calculator
    for (const calculatorId of calculatorIds) {
      try {
        const calculator = calculatorRegistry[calculatorId];

        if (!calculator) {
          errors.push(`Calculator ${calculatorId} not found in registry`);
          continue;
        }

        // Perform any necessary initialization
        // For now, we just verify the calculator exists and is callable
        if (typeof calculator.calculate === 'function') {
          initializedCount++;
          console.log(`✓ Initialized calculator: ${calculatorId}`);
        } else {
          errors.push(`Calculator ${calculatorId} does not have a calculate method`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to initialize calculator ${calculatorId}: ${errorMessage}`);
      }
    }

    const success = errors.length === 0;

    if (success) {
      console.log(`✅ Successfully initialized ${initializedCount} calculators`);
    } else {
      console.warn(`⚠️ Initialized ${initializedCount} calculators with ${errors.length} errors`);
      errors.forEach(error => console.error(`❌ ${error}`));
    }

    return {
      success,
      initializedCount,
      errors
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Failed to initialize calculators: ${errorMessage}`);

    return {
      success: false,
      initializedCount: 0,
      errors: [errorMessage]
    };
  }
};

/**
 * Validate calculator registry integrity
 */
export const validateCalculatorRegistry = (): boolean => {
  try {
    const calculatorIds = Object.keys(calculatorRegistry);

    if (calculatorIds.length === 0) {
      console.warn('⚠️ Calculator registry is empty');
      return false;
    }

    let validCount = 0;
    for (const calculatorId of calculatorIds) {
      const calculator = calculatorRegistry[calculatorId];

      if (calculator && typeof calculator.calculate === 'function') {
        validCount++;
      } else {
        console.error(`❌ Invalid calculator: ${calculatorId}`);
      }
    }

    const isValid = validCount === calculatorIds.length;

    if (isValid) {
      console.log(`✅ Calculator registry validation passed: ${validCount}/${calculatorIds.length} calculators valid`);
    } else {
      console.error(`❌ Calculator registry validation failed: ${validCount}/${calculatorIds.length} calculators valid`);
    }

    return isValid;
  } catch (error) {
    console.error('❌ Failed to validate calculator registry:', error);
    return false;
  }
};

/**
 * Get calculator initialization status
 */
export const getCalculatorStatus = () => {
  const calculatorIds = Object.keys(calculatorRegistry);

  return {
    totalCalculators: calculatorIds.length,
    availableCalculators: calculatorIds,
    registryValid: validateCalculatorRegistry()
  };
};

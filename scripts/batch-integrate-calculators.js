#!/usr/bin/env node

/**
 * Batch Calculator Integration Tool
 * Automatically integrates preset functionality into existing calculators
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculator integration templates
const INTEGRATION_TEMPLATES = {
  // Template for wrapping existing calculator with preset functionality
  wrapperTemplate: (calculatorName, calculatorType, originalImport) => `/**
 * ${calculatorName} with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { ${calculatorType}PresetParameters } from '../../../types/preset';
import ${originalImport} from './index';

const ${calculatorName}WithPresets: React.FC = () => {
  // Default parameters - extracted from original calculator
  const defaultParameters: ${calculatorType}PresetParameters = {
    // TODO: Define default parameters based on calculator type
  };

  // Use calculator presets hook
  const {
    currentParameters,
    updateParameter,
    updateParameters,
    selectedPresetId,
    hasUnsavedChanges,
  } = useCalculatorPresets({
    calculatorType: '${calculatorType}',
    initialParameters: defaultParameters,
  });

  // Handle preset loading
  const handlePresetLoad = (parameters: ${calculatorType}PresetParameters) => {
    updateParameters(parameters);
  };

  return (
    <CalculatorLayout
      calculatorType="${calculatorType}"
      currentParameters={currentParameters}
      onPresetLoad={handlePresetLoad}
      onParametersChange={updateParameters}
      presetPosition="top"
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <${originalImport} 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default ${calculatorName}WithPresets;`,

  // Template for updating existing calculator to accept external inputs
  enhancedCalculatorTemplate: (calculatorName) => `// Enhanced ${calculatorName} to support external input management
// Add these props to your existing calculator component:

interface Enhanced${calculatorName}Props {
  inputs?: any; // External input state
  onInputChange?: (field: string, value: any) => void; // External input handler
  // ... existing props
}

// In your component, use external inputs when provided:
const ${calculatorName}: React.FC<Enhanced${calculatorName}Props> = ({
  inputs: externalInputs,
  onInputChange: externalOnInputChange,
  // ... other props
}) => {
  // Use external inputs if provided, otherwise use internal state
  const [internalInputs, setInternalInputs] = useState(defaultInputs);
  const inputs = externalInputs || internalInputs;
  
  const handleInputChange = (field: string, value: any) => {
    if (externalOnInputChange) {
      externalOnInputChange(field, value);
    } else {
      setInternalInputs(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Rest of your component logic...
};`
};

// List of calculators to integrate
const CALCULATORS_TO_INTEGRATE = [
  {
    name: 'CuttingTimeEstimator',
    type: 'cutting-time-estimator',
    path: 'src/components/calculators/CuttingTimeEstimator',
    priority: 'high'
  },
  {
    name: 'GasConsumptionCalculator',
    type: 'gas-consumption',
    path: 'src/components/calculators/GasConsumptionCalculator',
    priority: 'high'
  },
  {
    name: 'LaserParameterOptimizer',
    type: 'laser-parameter-optimizer',
    path: 'src/components/calculators/LaserParameterOptimizer',
    priority: 'high'
  },
  {
    name: 'ProductionCapacityCalculator',
    type: 'production-capacity',
    path: 'src/components/calculators/ProductionCapacityCalculator',
    priority: 'medium'
  },
  {
    name: 'QualityGradeCalculator',
    type: 'quality-grade',
    path: 'src/components/calculators/QualityGradeCalculator',
    priority: 'medium'
  },
  {
    name: 'EnergyCostCalculator',
    type: 'energy-cost',
    path: 'src/components/calculators/EnergyCostCalculator',
    priority: 'medium'
  },
  {
    name: 'MaintenanceCostCalculator',
    type: 'maintenance-cost',
    path: 'src/components/calculators/MaintenanceCostCalculator',
    priority: 'medium'
  },
  {
    name: 'EquipmentComparisonCalculator',
    type: 'equipment-comparison',
    path: 'src/components/calculators/EquipmentComparisonCalculator',
    priority: 'low'
  },
  {
    name: 'KerfWidthCalculator',
    type: 'kerf-width',
    path: 'src/components/calculators/KerfWidthCalculator',
    priority: 'low'
  }
];

function generateIntegrationFiles(calculator) {
  const { name, type, path: calculatorPath } = calculator;
  
  console.log(`🔧 Generating integration files for ${name}...`);
  
  // Generate wrapper component
  const wrapperContent = INTEGRATION_TEMPLATES.wrapperTemplate(
    name,
    type,
    name
  );
  
  // Generate enhancement guide
  const enhancementContent = INTEGRATION_TEMPLATES.enhancedCalculatorTemplate(name);
  
  return {
    wrapperFile: {
      path: `${calculatorPath}/${name}WithPresets.tsx`,
      content: wrapperContent
    },
    enhancementGuide: {
      path: `${calculatorPath}/INTEGRATION_GUIDE.md`,
      content: `# ${name} Integration Guide

## Steps to Complete Integration

1. **Update Original Component**
${enhancementContent}

2. **Test Integration**
   - Verify preset loading works
   - Test parameter synchronization
   - Check backward compatibility

3. **Update Routes**
   - Replace original component with WithPresets version
   - Update any direct imports

## Generated Files
- \`${name}WithPresets.tsx\` - Preset-enabled wrapper
- \`INTEGRATION_GUIDE.md\` - This guide

## Next Steps
- [ ] Update original component to accept external inputs
- [ ] Test preset functionality
- [ ] Update routing configuration
- [ ] Add integration tests
`
    }
  };
}

function writeIntegrationFiles(calculator) {
  const files = generateIntegrationFiles(calculator);
  const projectRoot = path.join(__dirname, '..');
  
  try {
    // Write wrapper file
    const wrapperPath = path.join(projectRoot, files.wrapperFile.path);
    const wrapperDir = path.dirname(wrapperPath);
    
    if (!fs.existsSync(wrapperDir)) {
      fs.mkdirSync(wrapperDir, { recursive: true });
    }
    
    fs.writeFileSync(wrapperPath, files.wrapperFile.content);
    console.log(`  ✅ Created: ${files.wrapperFile.path}`);
    
    // Write integration guide
    const guidePath = path.join(projectRoot, files.enhancementGuide.path);
    fs.writeFileSync(guidePath, files.enhancementGuide.content);
    console.log(`  📋 Created: ${files.enhancementGuide.path}`);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Error creating files for ${calculator.name}:`, error.message);
    return false;
  }
}

function generateBatchReport(results) {
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  const report = `# Batch Calculator Integration Report
Generated: ${new Date().toISOString()}

## 📊 Summary
- **Total Calculators**: ${total}
- **Successfully Generated**: ${successful}
- **Failed**: ${total - successful}
- **Success Rate**: ${Math.round((successful / total) * 100)}%

## 📋 Results

${results.map(result => `
### ${result.calculator.name}
- **Type**: ${result.calculator.type}
- **Priority**: ${result.calculator.priority}
- **Status**: ${result.success ? '✅ Success' : '❌ Failed'}
${result.error ? `- **Error**: ${result.error}` : ''}
`).join('')}

## 🎯 Next Steps
1. Review generated integration files
2. Update original calculator components to accept external inputs
3. Test preset functionality for each calculator
4. Update routing configuration
5. Add comprehensive integration tests

---
*Generated by Batch Calculator Integration Tool*
`;

  const reportPath = path.join(__dirname, '..', 'BATCH_INTEGRATION_REPORT.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n📊 Batch report generated: ${reportPath}`);
}

function main() {
  console.log('🚀 Starting batch calculator integration...\n');
  
  const results = [];
  
  for (const calculator of CALCULATORS_TO_INTEGRATE) {
    try {
      const success = writeIntegrationFiles(calculator);
      results.push({
        calculator,
        success,
        error: null
      });
    } catch (error) {
      results.push({
        calculator,
        success: false,
        error: error.message
      });
    }
  }
  
  // Generate summary report
  generateBatchReport(results);
  
  const successful = results.filter(r => r.success).length;
  console.log(`\n✅ Batch integration complete!`);
  console.log(`   Generated files for ${successful}/${results.length} calculators`);
  console.log(`   Next: Review and customize generated files`);
}

main();

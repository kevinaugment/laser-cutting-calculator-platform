#!/usr/bin/env node

/**
 * Complete Calculator Integration Tool
 * Integrates all remaining calculators with preset functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Complete list of all calculators found in the project
const ALL_CALCULATORS = [
  { name: 'BatchProcessingCalculator', type: 'batch-processing', priority: 'high' },
  { name: 'BeamQualityCalculator', type: 'beam-quality', priority: 'medium' },
  { name: 'CompetitivePricingCalculator', type: 'competitive-pricing', priority: 'high' },
  { name: 'CutPathOptimizer', type: 'cut-path-optimizer', priority: 'high' },
  { name: 'EdgeQualityPredictorCalculator', type: 'edge-quality-predictor', priority: 'medium' },
  { name: 'FocusHeightCalculator', type: 'focus-height', priority: 'medium' },
  { name: 'HeatAffectedZoneCalculator', type: 'heat-affected-zone', priority: 'medium' },
  { name: 'JobQueueOptimizer', type: 'job-queue-optimizer', priority: 'high' },
  { name: 'MaterialNestingOptimizer', type: 'material-nesting-optimizer', priority: 'high' },
  { name: 'PowerRequirementCalculator', type: 'power-requirement', priority: 'high' },
  { name: 'ProfitMarginCalculator', type: 'profit-margin', priority: 'high' },
  { name: 'ProjectQuotingCalculator', type: 'project-quoting', priority: 'high' },
  { name: 'WarpingRiskCalculator', type: 'warping-risk', priority: 'medium' },
];

// Default parameters for new calculator types
const NEW_DEFAULT_PARAMETERS = {
  'batch-processing': `{
    batchSize: 10,
    partCount: 100,
    setupTime: 30,
    cycleTime: 5,
  }`,
  'beam-quality': `{
    laserPower: 1500,
    beamDiameter: 0.1,
    focusLength: 127,
    wavelength: 1064,
  }`,
  'competitive-pricing': `{
    baseCost: 100,
    margin: 0.3,
    competitorPrice: 150,
    marketFactor: 1.0,
  }`,
  'cut-path-optimizer': `{
    partCount: 10,
    sheetSize: { width: 1500, height: 3000 },
    materialThickness: 3,
    optimizationGoal: 'time',
  }`,
  'edge-quality-predictor': `{
    materialType: 'steel',
    thickness: 3,
    cuttingSpeed: 2500,
    laserPower: 1500,
    gasType: 'oxygen',
  }`,
  'focus-height': `{
    materialType: 'steel',
    thickness: 3,
    lensType: 'standard',
    beamDiameter: 0.1,
  }`,
  'heat-affected-zone': `{
    materialType: 'steel',
    thickness: 3,
    laserPower: 1500,
    cuttingSpeed: 2500,
    thermalConductivity: 50,
  }`,
  'job-queue-optimizer': `{
    jobCount: 10,
    machineCount: 2,
    priorityWeights: { urgency: 0.4, profit: 0.3, efficiency: 0.3 },
    workingHours: 8,
  }`,
  'material-nesting-optimizer': `{
    parts: [],
    sheetSize: { width: 1500, height: 3000 },
    materialCost: 2.5,
    wasteFactor: 0.1,
  }`,
  'power-requirement': `{
    materialType: 'steel',
    thickness: 3,
    cuttingSpeed: 2500,
    quality: 'medium',
    gasType: 'oxygen',
  }`,
  'profit-margin': `{
    totalCost: 100,
    targetMargin: 0.3,
    marketPrice: 150,
    competitionLevel: 'medium',
  }`,
  'project-quoting': `{
    projectType: 'standard',
    complexity: 'medium',
    quantity: 1,
    deadline: 'standard',
    materialCost: 100,
    laborHours: 5,
  }`,
  'warping-risk': `{
    materialType: 'steel',
    thickness: 3,
    partSize: { width: 100, height: 100 },
    cuttingPattern: 'standard',
    coolingRate: 'medium',
  }`,
};

// Template for integration wrapper
const INTEGRATION_TEMPLATE = (calculatorName, calculatorType, defaultParams) => `/**
 * ${calculatorName} with Preset Integration
 * Enhanced version with preset functionality
 */

import React, { useState, useEffect } from 'react';
import { CalculatorLayout } from '../CalculatorLayout';
import { useCalculatorPresets } from '../../../hooks/useCalculatorPresets';
import { ${calculatorName}PresetParameters } from '../../../types/preset';
import ${calculatorName} from './index';

const ${calculatorName}WithPresets: React.FC = () => {
  // Default parameters
  const defaultParameters: ${calculatorName}PresetParameters = ${defaultParams};

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
  const handlePresetLoad = (parameters: ${calculatorName}PresetParameters) => {
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
      <${calculatorName} 
        inputs={currentParameters}
        onInputChange={(field, value) => updateParameter(field, value)}
      />
    </CalculatorLayout>
  );
};

export default ${calculatorName}WithPresets;`;

function generateTypeDefinitions() {
  let typeDefinitions = '';
  
  for (const calculator of ALL_CALCULATORS) {
    const typeName = `${calculator.name}PresetParameters`;
    const defaultParams = NEW_DEFAULT_PARAMETERS[calculator.type] || '{}';
    
    // Extract parameter names from default parameters
    const paramMatches = defaultParams.match(/(\w+):/g);
    const params = paramMatches ? paramMatches.map(match => match.replace(':', '')) : [];
    
    typeDefinitions += `
export interface ${typeName} extends PresetParameters {
  // TODO: Define specific parameter types based on calculator requirements
  ${params.map(param => `${param}: any;`).join('\n  ')}
}
`;
  }
  
  return typeDefinitions;
}

function updateParameterMappings() {
  const mappingAdditions = {};
  
  for (const calculator of ALL_CALCULATORS) {
    const defaultParams = NEW_DEFAULT_PARAMETERS[calculator.type];
    if (defaultParams) {
      // Parse default parameters to create mapping
      const paramMatches = defaultParams.match(/(\w+):/g);
      const params = paramMatches ? paramMatches.map(match => match.replace(':', '')) : [];
      
      mappingAdditions[calculator.type] = {
        requiredFields: params.slice(0, Math.ceil(params.length / 2)),
        optionalFields: params.slice(Math.ceil(params.length / 2)),
        defaultValues: `// Parsed from: ${defaultParams}`,
        validation: '{}',
        displayNames: `// Auto-generated for ${calculator.name}`,
      };
    }
  }
  
  return mappingAdditions;
}

function createIntegrationFiles(calculator) {
  const { name, type } = calculator;
  const defaultParams = NEW_DEFAULT_PARAMETERS[type] || '{}';
  
  console.log(`🔧 Creating integration for ${name}...`);
  
  const projectRoot = path.join(__dirname, '..');
  const calculatorPath = path.join(projectRoot, 'src', 'components', 'calculators', name);
  
  // Check if calculator directory exists
  if (!fs.existsSync(calculatorPath)) {
    console.log(`  ⚠️  Directory not found: ${calculatorPath}`);
    return false;
  }
  
  // Check if integration already exists
  const integrationFile = path.join(calculatorPath, `${name}WithPresets.tsx`);
  if (fs.existsSync(integrationFile)) {
    console.log(`  ✅ Integration already exists: ${name}`);
    return true;
  }
  
  try {
    // Create integration file
    const integrationContent = INTEGRATION_TEMPLATE(name, type, defaultParams);
    fs.writeFileSync(integrationFile, integrationContent);
    console.log(`  ✅ Created: ${name}WithPresets.tsx`);
    
    // Create integration guide
    const guideContent = `# ${name} Integration Guide

## Integration Status
- [x] Integration wrapper created
- [ ] Original component updated to accept external inputs
- [ ] Parameter mapping configured
- [ ] Tests added
- [ ] Routes updated

## Default Parameters
\`\`\`typescript
${defaultParams}
\`\`\`

## Next Steps
1. Update original ${name} component to accept \`inputs\` and \`onInputChange\` props
2. Configure parameter mapping in calculatorPresetMapping.ts
3. Add type definition to preset.ts
4. Test preset functionality
5. Update routing configuration
`;
    
    const guidePath = path.join(calculatorPath, 'INTEGRATION_GUIDE.md');
    fs.writeFileSync(guidePath, guideContent);
    console.log(`  📋 Created: INTEGRATION_GUIDE.md`);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Error creating integration for ${name}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting complete calculator integration...\n');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const calculator of ALL_CALCULATORS) {
    const result = createIntegrationFiles(calculator);
    if (result === true) {
      successCount++;
    } else if (result === 'skip') {
      skipCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log('\n📊 Integration Summary:');
  console.log(`  ✅ Successfully created: ${successCount}`);
  console.log(`  ⏭️  Already existed: ${skipCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  📈 Total progress: ${successCount + skipCount}/${ALL_CALCULATORS.length} calculators`);
  
  // Generate type definitions
  console.log('\n🔧 Generating type definitions...');
  const typeDefinitions = generateTypeDefinitions();
  const typeDefPath = path.join(__dirname, '..', 'NEW_PRESET_TYPES.md');
  fs.writeFileSync(typeDefPath, `# New Preset Type Definitions\n\nAdd these to src/types/preset.ts:\n\n\`\`\`typescript${typeDefinitions}\n\`\`\``);
  console.log(`  📝 Type definitions saved to: NEW_PRESET_TYPES.md`);
  
  console.log('\n✅ Complete calculator integration finished!');
  console.log('   Next: Review generated files and update original components');
}

main();

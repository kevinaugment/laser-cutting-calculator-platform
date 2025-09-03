#!/usr/bin/env node

/**
 * Fix Integration Type Names
 * Corrects type names in generated integration files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type name mappings
const TYPE_MAPPINGS = {
  'cutting-time-estimator': 'CuttingTimeEstimatorPresetParameters',
  'gas-consumption': 'GasConsumptionPresetParameters',
  'laser-parameter-optimizer': 'LaserParameterOptimizerPresetParameters',
  'production-capacity': 'ProductionCapacityPresetParameters',
  'quality-grade': 'QualityGradePresetParameters',
  'energy-cost': 'EnergyCostPresetParameters',
  'maintenance-cost': 'MaintenanceCostPresetParameters',
  'equipment-comparison': 'EquipmentComparisonPresetParameters',
  'kerf-width': 'KerfWidthPresetParameters',
};

// Default parameters for each calculator type
const DEFAULT_PARAMETERS = {
  'cutting-time-estimator': `{
    totalLength: 1000,
    pierceCount: 4,
    materialType: 'steel',
    thickness: 3,
    cuttingSpeed: 2500,
    pierceTime: 0.8,
    setupTime: 15,
    gasType: 'oxygen',
    complexity: 'medium',
  }`,
  'gas-consumption': `{
    gasType: 'oxygen',
    pressure: 1.5,
    flowRate: 0.8,
    cuttingTime: 60,
    materialType: 'steel',
    thickness: 3,
    nozzleDiameter: 1.5,
    efficiency: 0.85,
  }`,
  'laser-parameter-optimizer': `{
    materialType: 'steel',
    thickness: 3,
    quality: 'medium',
    speed: 'medium',
  }`,
  'production-capacity': `{
    machineCount: 1,
    workingHours: 8,
    efficiency: 0.85,
    downtime: 0.1,
  }`,
  'quality-grade': `{
    materialType: 'steel',
    thickness: 3,
    tolerance: 0.1,
    surfaceFinish: 'standard',
    edgeQuality: 'good',
  }`,
  'energy-cost': `{
    laserPower: 1500,
    operatingTime: 8,
    electricityRate: 0.12,
    efficiency: 0.85,
    auxiliaryPower: 200,
  }`,
  'maintenance-cost': `{
    machineValue: 500000,
    operatingHours: 2000,
    maintenanceRate: 0.05,
    consumables: 1000,
  }`,
  'equipment-comparison': `{
    machine1: 'Machine A',
    machine2: 'Machine B',
    criteria: 'cost,speed,quality',
    weights: '1,1,1',
  }`,
  'kerf-width': `{
    materialType: 'steel',
    thickness: 3,
    laserPower: 1500,
    gasType: 'oxygen',
    cuttingSpeed: 2500,
  }`,
};

function fixIntegrationFile(filePath, calculatorType) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix type import
    const invalidTypeName = `${calculatorType}PresetParameters`;
    const validTypeName = TYPE_MAPPINGS[calculatorType];
    
    if (validTypeName) {
      content = content.replace(
        new RegExp(invalidTypeName, 'g'),
        validTypeName
      );
    }
    
    // Fix default parameters
    const defaultParams = DEFAULT_PARAMETERS[calculatorType];
    if (defaultParams) {
      content = content.replace(
        /\/\/ TODO: Define default parameters based on calculator type/,
        defaultParams
      );
    }
    
    // Write fixed content back
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ Fixed: ${path.basename(filePath)}`);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing integration type names...\n');
  
  const projectRoot = path.join(__dirname, '..');
  const calculatorsDir = path.join(projectRoot, 'src', 'components', 'calculators');
  
  let fixedCount = 0;
  let totalCount = 0;
  
  for (const [calculatorType, typeName] of Object.entries(TYPE_MAPPINGS)) {
    // Find the corresponding calculator directory
    const calculatorDirs = fs.readdirSync(calculatorsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Find matching directory (case-insensitive partial match)
    const matchingDir = calculatorDirs.find(dir => 
      dir.toLowerCase().includes(calculatorType.replace('-', '')) ||
      calculatorType.replace('-', '').includes(dir.toLowerCase().replace('calculator', ''))
    );
    
    if (matchingDir) {
      const integrationFile = path.join(calculatorsDir, matchingDir, `${matchingDir}WithPresets.tsx`);
      
      if (fs.existsSync(integrationFile)) {
        console.log(`🔧 Processing ${matchingDir}...`);
        totalCount++;
        
        if (fixIntegrationFile(integrationFile, calculatorType)) {
          fixedCount++;
        }
      }
    }
  }
  
  console.log(`\n✅ Type fixing complete!`);
  console.log(`   Fixed ${fixedCount}/${totalCount} files`);
}

main();

import { CalculatorInputs, CalculatorResults } from '../../types/calculator';

export interface Part {
  id: string;
  name: string;
  length: number; // mm
  width: number; // mm
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  allowRotation: boolean;
  materialType: string;
  thickness: number; // mm
}

export interface SheetSpecification {
  length: number; // mm
  width: number; // mm
  thickness: number; // mm
  materialType: string;
  cost: number; // $ per sheet
  availability: number; // sheets in stock
}

export interface MaterialNestingOptimizerInputs extends CalculatorInputs {
  parts: Part[];
  sheetSpecs: SheetSpecification[];
  nestingConstraints: {
    minSpacing: number; // mm between parts
    edgeMargin: number; // mm from sheet edge
    grainDirection: 'any' | 'length' | 'width';
    allowMixedThickness: boolean;
    allowMixedMaterial: boolean;
  };
  optimizationGoal: 'material_usage' | 'cost_minimization' | 'sheet_count' | 'balanced';
  cuttingParameters: {
    kerfWidth: number; // mm
    leadInLength: number; // mm
    leadOutLength: number; // mm
    pierceTime: number; // seconds
    cuttingSpeed: number; // mm/min
  };
  productionConstraints: {
    maxSheetCount: number;
    deliveryDeadline: number; // hours
    setupTime: number; // minutes per sheet
  };
}

export interface MaterialNestingOptimizerResults extends CalculatorResults {
  nestingPlan: {
    sheetNumber: number;
    sheetSpec: SheetSpecification;
    partsPlaced: {
      partId: string;
      partName: string;
      x: number; // mm position
      y: number; // mm position
      rotation: number; // degrees
      quantity: number;
    }[];
    utilization: number; // percentage
    wasteArea: number; // mm²
    cuttingTime: number; // minutes
    materialCost: number; // $
  }[];
  optimizationSummary: {
    totalSheets: number;
    totalMaterialCost: number; // $
    totalCuttingTime: number; // minutes
    overallUtilization: number; // percentage
    totalWasteArea: number; // mm²
    wasteValue: number; // $
  };
  materialEfficiency: {
    utilizationByMaterial: { material: string; utilization: number; sheets: number }[];
    wasteAnalysis: { sheetNumber: number; wasteArea: number; wasteValue: number; reuseability: string }[];
    improvementOpportunities: string[];
  };
  costAnalysis: {
    materialCosts: number; // $
    cuttingCosts: number; // $ (based on time)
    setupCosts: number; // $
    totalCosts: number; // $
    costPerPart: number; // $ average
    savingsVsWorstCase: number; // $
  };
  productionSchedule: {
    sheetNumber: number;
    setupTime: number; // minutes
    cuttingTime: number; // minutes
    totalTime: number; // minutes
    startTime: number; // hours from now
    completionTime: number; // hours from now
  }[];
  qualityConsiderations: {
    grainDirectionCompliance: number; // percentage
    spacingAdequacy: number; // 1-5 scale
    thermalDistortionRisk: 'low' | 'medium' | 'high';
    recommendations: string[];
  };
  alternativeLayouts: {
    layoutName: string;
    sheets: number;
    utilization: number;
    cost: number;
    time: number;
    description: string;
  }[];
}

export class MaterialNestingOptimizer {
  private utilizationTargets = {
    'material_usage': 0.85,
    'cost_minimization': 0.75,
    'sheet_count': 0.90,
    'balanced': 0.80
  };

  private materialProperties = {
    'mild_steel': { density: 7850, thermalExpansion: 12e-6, grainSensitive: false },
    'stainless_steel': { density: 8000, thermalExpansion: 17e-6, grainSensitive: false },
    'aluminum': { density: 2700, thermalExpansion: 23e-6, grainSensitive: true },
    'carbon_steel': { density: 7850, thermalExpansion: 12e-6, grainSensitive: false },
    'copper': { density: 8960, thermalExpansion: 17e-6, grainSensitive: false },
    'brass': { density: 8500, thermalExpansion: 19e-6, grainSensitive: false }
  };

  calculate(inputs: MaterialNestingOptimizerInputs): MaterialNestingOptimizerResults {
    // Input validation
    this.validateInputs(inputs);

    // Sort parts by priority and size
    const sortedParts = this.sortParts(inputs.parts, inputs.optimizationGoal);

    // Generate nesting plan
    const nestingPlan = this.generateNestingPlan(sortedParts, inputs);

    // Calculate optimization summary
    const optimizationSummary = this.calculateOptimizationSummary(nestingPlan);

    // Analyze material efficiency
    const materialEfficiency = this.analyzeMaterialEfficiency(nestingPlan, inputs);

    // Calculate costs
    const costAnalysis = this.calculateCostAnalysis(nestingPlan, inputs);

    // Generate production schedule
    const productionSchedule = this.generateProductionSchedule(nestingPlan, inputs);

    // Assess quality considerations
    const qualityConsiderations = this.assessQualityConsiderations(nestingPlan, inputs);

    // Generate alternative layouts
    const alternativeLayouts = this.generateAlternativeLayouts(inputs);

    // Generate recommendations
    const recommendations = this.generateRecommendations(nestingPlan, materialEfficiency, costAnalysis);

    return {
      nestingPlan,
      optimizationSummary,
      materialEfficiency,
      costAnalysis,
      productionSchedule,
      qualityConsiderations,
      alternativeLayouts,
      recommendations,
      keyMetrics: {
        'Total Sheets': `${optimizationSummary.totalSheets}`,
        'Overall Utilization': `${optimizationSummary.overallUtilization.toFixed(1)}%`,
        'Total Cost': `$${optimizationSummary.totalMaterialCost.toFixed(2)}`,
        'Waste Value': `$${optimizationSummary.wasteValue.toFixed(2)}`
      },
      sensitivityAnalysis: this.performSensitivityAnalysis(inputs)
    };
  }

  private validateInputs(inputs: MaterialNestingOptimizerInputs): void {
    if (inputs.parts.length === 0) {
      throw new Error('At least one part must be specified');
    }
    if (inputs.sheetSpecs.length === 0) {
      throw new Error('At least one sheet specification must be provided');
    }
    if (inputs.nestingConstraints.minSpacing < 0) {
      throw new Error('Minimum spacing cannot be negative');
    }
    if (inputs.nestingConstraints.edgeMargin < 0) {
      throw new Error('Edge margin cannot be negative');
    }
  }

  private sortParts(parts: Part[], goal: string): Part[] {
    return [...parts].sort((a, b) => {
      // Priority sorting
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Size sorting based on optimization goal
      const aArea = a.length * a.width;
      const bArea = b.length * b.width;
      
      switch (goal) {
        case 'material_usage':
          return bArea - aArea; // Largest first
        case 'sheet_count':
          return bArea - aArea; // Largest first
        default:
          return bArea - aArea; // Default to largest first
      }
    });
  }

  private generateNestingPlan(parts: Part[], inputs: MaterialNestingOptimizerInputs): any[] {
    const nestingPlan: any[] = [];
    const remainingParts = [...parts];
    let sheetNumber = 1;

    while (remainingParts.length > 0 && sheetNumber <= inputs.productionConstraints.maxSheetCount) {
      // Select best sheet for remaining parts
      const bestSheet = this.selectBestSheet(remainingParts, inputs.sheetSpecs, inputs);
      
      if (!bestSheet) break;

      // Place parts on this sheet
      const sheetLayout = this.placePartsOnSheet(remainingParts, bestSheet, inputs);
      
      // Calculate sheet metrics
      const sheetArea = bestSheet.length * bestSheet.width;
      const usedArea = sheetLayout.partsPlaced.reduce((total, part) => {
        const partDef = parts.find(p => p.id === part.partId);
        return total + (partDef ? partDef.length * partDef.width * part.quantity : 0);
      }, 0);
      
      const utilization = (usedArea / sheetArea) * 100;
      const wasteArea = sheetArea - usedArea;
      const cuttingTime = this.calculateCuttingTime(sheetLayout.partsPlaced, inputs);

      nestingPlan.push({
        sheetNumber,
        sheetSpec: bestSheet,
        partsPlaced: sheetLayout.partsPlaced,
        utilization: Math.round(utilization * 10) / 10,
        wasteArea: Math.round(wasteArea),
        cuttingTime: Math.round(cuttingTime * 10) / 10,
        materialCost: bestSheet.cost
      });

      // Remove placed parts from remaining parts
      sheetLayout.partsPlaced.forEach(placedPart => {
        const partIndex = remainingParts.findIndex(p => p.id === placedPart.partId);
        if (partIndex >= 0) {
          remainingParts[partIndex].quantity -= placedPart.quantity;
          if (remainingParts[partIndex].quantity <= 0) {
            remainingParts.splice(partIndex, 1);
          }
        }
      });

      sheetNumber++;
    }

    return nestingPlan;
  }

  private selectBestSheet(parts: Part[], sheetSpecs: SheetSpecification[], inputs: MaterialNestingOptimizerInputs): SheetSpecification | null {
    let bestSheet: SheetSpecification | null = null;
    let bestScore = -1;

    for (const sheet of sheetSpecs) {
      if (sheet.availability <= 0) continue;

      // Check material compatibility
      const compatibleParts = parts.filter(part => 
        inputs.nestingConstraints.allowMixedMaterial || part.materialType === sheet.materialType
      );
      
      if (compatibleParts.length === 0) continue;

      // Calculate score based on optimization goal
      const score = this.calculateSheetScore(sheet, compatibleParts, inputs.optimizationGoal);
      
      if (score > bestScore) {
        bestScore = score;
        bestSheet = sheet;
      }
    }

    return bestSheet;
  }

  private calculateSheetScore(sheet: SheetSpecification, parts: Part[], goal: string): number {
    const sheetArea = sheet.length * sheet.width;
    const totalPartArea = parts.reduce((total, part) => total + (part.length * part.width * part.quantity), 0);
    const utilization = Math.min(1, totalPartArea / sheetArea);

    switch (goal) {
      case 'material_usage':
        return utilization * 100;
      case 'cost_minimization':
        return utilization / sheet.cost * 1000;
      case 'sheet_count':
        return utilization * sheetArea / 1000000; // Favor larger sheets with good utilization
      default:
        return utilization * 50 + (1 / sheet.cost) * 50;
    }
  }

  private placePartsOnSheet(parts: Part[], sheet: SheetSpecification, inputs: MaterialNestingOptimizerInputs): any {
    const partsPlaced: any[] = [];
    const usedAreas: { x: number; y: number; width: number; height: number }[] = [];

    // Add edge margins as used areas
    const margin = inputs.nestingConstraints.edgeMargin;
    usedAreas.push(
      { x: 0, y: 0, width: sheet.length, height: margin }, // Bottom edge
      { x: 0, y: sheet.width - margin, width: sheet.length, height: margin }, // Top edge
      { x: 0, y: 0, width: margin, height: sheet.width }, // Left edge
      { x: sheet.length - margin, y: 0, width: margin, height: sheet.width } // Right edge
    );

    for (const part of parts) {
      if (part.quantity <= 0) continue;
      
      // Check material compatibility
      if (!inputs.nestingConstraints.allowMixedMaterial && part.materialType !== sheet.materialType) continue;
      if (!inputs.nestingConstraints.allowMixedThickness && part.thickness !== sheet.thickness) continue;

      let placedQuantity = 0;
      
      for (let q = 0; q < part.quantity; q++) {
        const placement = this.findBestPlacement(part, sheet, usedAreas, inputs);
        
        if (placement) {
          partsPlaced.push({
            partId: part.id,
            partName: part.name,
            x: placement.x,
            y: placement.y,
            rotation: placement.rotation,
            quantity: 1
          });

          // Add to used areas
          usedAreas.push({
            x: placement.x,
            y: placement.y,
            width: placement.width,
            height: placement.height
          });

          placedQuantity++;
        } else {
          break; // No more space for this part
        }
      }

      // Update part quantity
      part.quantity -= placedQuantity;
    }

    return { partsPlaced };
  }

  private findBestPlacement(part: Part, sheet: SheetSpecification, usedAreas: any[], inputs: MaterialNestingOptimizerInputs): any | null {
    const spacing = inputs.nestingConstraints.minSpacing;
    const orientations = part.allowRotation ? [
      { width: part.length, height: part.width, rotation: 0 },
      { width: part.width, height: part.length, rotation: 90 }
    ] : [{ width: part.length, height: part.width, rotation: 0 }];

    for (const orientation of orientations) {
      // Try to place at various positions
      for (let x = inputs.nestingConstraints.edgeMargin; x <= sheet.length - orientation.width - inputs.nestingConstraints.edgeMargin; x += 5) {
        for (let y = inputs.nestingConstraints.edgeMargin; y <= sheet.width - orientation.height - inputs.nestingConstraints.edgeMargin; y += 5) {
          
          const proposedArea = {
            x: x - spacing,
            y: y - spacing,
            width: orientation.width + 2 * spacing,
            height: orientation.height + 2 * spacing
          };

          // Check for overlaps
          const hasOverlap = usedAreas.some(area => this.areasOverlap(proposedArea, area));
          
          if (!hasOverlap) {
            return {
              x,
              y,
              width: orientation.width,
              height: orientation.height,
              rotation: orientation.rotation
            };
          }
        }
      }
    }

    return null; // No suitable placement found
  }

  private areasOverlap(area1: any, area2: any): boolean {
    return !(area1.x + area1.width <= area2.x || 
             area2.x + area2.width <= area1.x || 
             area1.y + area1.height <= area2.y || 
             area2.y + area2.height <= area1.y);
  }

  private calculateCuttingTime(partsPlaced: any[], inputs: MaterialNestingOptimizerInputs): number {
    let totalTime = 0;
    
    partsPlaced.forEach(part => {
      // Simplified cutting time calculation
      const perimeter = 2 * (part.width + part.height); // Assuming rectangular parts
      const cuttingTime = perimeter / inputs.cuttingParameters.cuttingSpeed;
      const pierceTime = inputs.cuttingParameters.pierceTime / 60; // Convert to minutes
      const leadTime = (inputs.cuttingParameters.leadInLength + inputs.cuttingParameters.leadOutLength) / inputs.cuttingParameters.cuttingSpeed;
      
      totalTime += (cuttingTime + pierceTime + leadTime) * part.quantity;
    });

    return totalTime;
  }

  private calculateOptimizationSummary(nestingPlan: any[]): any {
    const totalSheets = nestingPlan.length;
    const totalMaterialCost = nestingPlan.reduce((sum, sheet) => sum + sheet.materialCost, 0);
    const totalCuttingTime = nestingPlan.reduce((sum, sheet) => sum + sheet.cuttingTime, 0);
    
    const totalArea = nestingPlan.reduce((sum, sheet) => sum + (sheet.sheetSpec.length * sheet.sheetSpec.width), 0);
    const totalWasteArea = nestingPlan.reduce((sum, sheet) => sum + sheet.wasteArea, 0);
    const overallUtilization = totalArea > 0 ? ((totalArea - totalWasteArea) / totalArea) * 100 : 0;
    
    // Estimate waste value (assuming 10% of material cost)
    const wasteValue = (totalWasteArea / totalArea) * totalMaterialCost;

    return {
      totalSheets,
      totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
      totalCuttingTime: Math.round(totalCuttingTime * 10) / 10,
      overallUtilization: Math.round(overallUtilization * 10) / 10,
      totalWasteArea: Math.round(totalWasteArea),
      wasteValue: Math.round(wasteValue * 100) / 100
    };
  }

  private analyzeMaterialEfficiency(nestingPlan: any[], inputs: MaterialNestingOptimizerInputs): any {
    // Utilization by material
    const materialStats: Record<string, { totalArea: number; usedArea: number; sheets: number }> = {};
    
    nestingPlan.forEach(sheet => {
      const material = sheet.sheetSpec.materialType;
      if (!materialStats[material]) {
        materialStats[material] = { totalArea: 0, usedArea: 0, sheets: 0 };
      }
      
      const sheetArea = sheet.sheetSpec.length * sheet.sheetSpec.width;
      materialStats[material].totalArea += sheetArea;
      materialStats[material].usedArea += (sheetArea - sheet.wasteArea);
      materialStats[material].sheets += 1;
    });

    const utilizationByMaterial = Object.entries(materialStats).map(([material, stats]) => ({
      material,
      utilization: Math.round((stats.usedArea / stats.totalArea) * 100 * 10) / 10,
      sheets: stats.sheets
    }));

    // Waste analysis
    const wasteAnalysis = nestingPlan.map(sheet => {
      const wastePercentage = (sheet.wasteArea / (sheet.sheetSpec.length * sheet.sheetSpec.width)) * 100;
      let reuseability = 'Low';
      if (wastePercentage < 10) reuseability = 'High';
      else if (wastePercentage < 25) reuseability = 'Medium';
      
      return {
        sheetNumber: sheet.sheetNumber,
        wasteArea: sheet.wasteArea,
        wasteValue: (sheet.wasteArea / (sheet.sheetSpec.length * sheet.sheetSpec.width)) * sheet.materialCost,
        reuseability
      };
    });

    // Improvement opportunities
    const improvementOpportunities: string[] = [];
    const avgUtilization = utilizationByMaterial.reduce((sum, m) => sum + m.utilization, 0) / utilizationByMaterial.length;
    
    if (avgUtilization < 75) {
      improvementOpportunities.push('Consider smaller sheet sizes or different part arrangements');
    }
    if (wasteAnalysis.some(w => w.wasteValue > 50)) {
      improvementOpportunities.push('High-value waste detected - consider remnant tracking system');
    }
    if (nestingPlan.length > 10) {
      improvementOpportunities.push('Large number of sheets - consider batch optimization');
    }

    return {
      utilizationByMaterial,
      wasteAnalysis,
      improvementOpportunities
    };
  }

  private calculateCostAnalysis(nestingPlan: any[], inputs: MaterialNestingOptimizerInputs): any {
    const materialCosts = nestingPlan.reduce((sum, sheet) => sum + sheet.materialCost, 0);
    const totalCuttingTime = nestingPlan.reduce((sum, sheet) => sum + sheet.cuttingTime, 0);
    const cuttingCosts = totalCuttingTime * 1.5; // Assume $1.5 per minute cutting cost
    const setupCosts = nestingPlan.length * (inputs.productionConstraints.setupTime / 60) * 50; // $50/hour setup rate
    const totalCosts = materialCosts + cuttingCosts + setupCosts;

    // Calculate total parts
    const totalParts = nestingPlan.reduce((sum, sheet) => 
      sum + sheet.partsPlaced.reduce((partSum: number, part: any) => partSum + part.quantity, 0), 0);
    const costPerPart = totalParts > 0 ? totalCosts / totalParts : 0;

    // Estimate worst case (no optimization)
    const worstCaseCost = materialCosts * 1.4; // 40% more material waste
    const savingsVsWorstCase = worstCaseCost - totalCosts;

    return {
      materialCosts: Math.round(materialCosts * 100) / 100,
      cuttingCosts: Math.round(cuttingCosts * 100) / 100,
      setupCosts: Math.round(setupCosts * 100) / 100,
      totalCosts: Math.round(totalCosts * 100) / 100,
      costPerPart: Math.round(costPerPart * 100) / 100,
      savingsVsWorstCase: Math.round(savingsVsWorstCase * 100) / 100
    };
  }

  private generateProductionSchedule(nestingPlan: any[], inputs: MaterialNestingOptimizerInputs): any[] {
    let currentTime = 0;
    
    return nestingPlan.map(sheet => {
      const setupTime = inputs.productionConstraints.setupTime;
      const cuttingTime = sheet.cuttingTime;
      const totalTime = setupTime + cuttingTime;
      
      const schedule = {
        sheetNumber: sheet.sheetNumber,
        setupTime: Math.round(setupTime * 10) / 10,
        cuttingTime: Math.round(cuttingTime * 10) / 10,
        totalTime: Math.round(totalTime * 10) / 10,
        startTime: Math.round(currentTime / 60 * 10) / 10,
        completionTime: Math.round((currentTime + totalTime) / 60 * 10) / 10
      };
      
      currentTime += totalTime;
      return schedule;
    });
  }

  private assessQualityConsiderations(nestingPlan: any[], inputs: MaterialNestingOptimizerInputs): any {
    // Grain direction compliance (simplified)
    const grainDirectionCompliance = inputs.nestingConstraints.grainDirection === 'any' ? 100 : 85;

    // Spacing adequacy
    const spacingAdequacy = inputs.nestingConstraints.minSpacing >= 2 ? 5 : 3;

    // Thermal distortion risk
    let thermalDistortionRisk: 'low' | 'medium' | 'high' = 'low';
    const avgUtilization = nestingPlan.reduce((sum, sheet) => sum + sheet.utilization, 0) / nestingPlan.length;
    if (avgUtilization > 85) thermalDistortionRisk = 'medium';
    if (avgUtilization > 95) thermalDistortionRisk = 'high';

    const recommendations = [
      'Verify part spacing meets thermal expansion requirements',
      'Consider grain direction for critical dimensions',
      'Monitor first article for dimensional accuracy',
      'Plan for potential thermal distortion in high-utilization sheets'
    ];

    return {
      grainDirectionCompliance: Math.round(grainDirectionCompliance * 10) / 10,
      spacingAdequacy,
      thermalDistortionRisk,
      recommendations
    };
  }

  private generateAlternativeLayouts(inputs: MaterialNestingOptimizerInputs): any[] {
    // Generate simplified alternative layouts
    return [
      {
        layoutName: 'Conservative',
        sheets: Math.ceil(inputs.parts.length / 5),
        utilization: 70,
        cost: 1200,
        time: 180,
        description: 'Lower utilization but faster setup and reduced risk'
      },
      {
        layoutName: 'Aggressive',
        sheets: Math.ceil(inputs.parts.length / 8),
        utilization: 92,
        cost: 950,
        time: 240,
        description: 'Maximum utilization but higher complexity'
      },
      {
        layoutName: 'Balanced',
        sheets: Math.ceil(inputs.parts.length / 6),
        utilization: 82,
        cost: 1050,
        time: 200,
        description: 'Good balance of efficiency and practicality'
      }
    ];
  }

  private generateRecommendations(nestingPlan: any[], efficiency: any, costs: any): string[] {
    const recommendations: string[] = [];

    const avgUtilization = nestingPlan.reduce((sum, sheet) => sum + sheet.utilization, 0) / nestingPlan.length;
    
    recommendations.push(`Nesting plan uses ${nestingPlan.length} sheets with ${avgUtilization.toFixed(1)}% average utilization`);
    recommendations.push(`Total material cost: $${costs.materialCosts.toFixed(2)}`);

    if (avgUtilization < 75) {
      recommendations.push('Low utilization detected - consider optimizing part arrangement or sheet sizes');
    }

    if (costs.savingsVsWorstCase > 100) {
      recommendations.push(`Optimization saves $${costs.savingsVsWorstCase.toFixed(2)} vs unoptimized layout`);
    }

    if (efficiency.improvementOpportunities.length > 0) {
      recommendations.push('Additional optimization opportunities identified - see efficiency analysis');
    }

    recommendations.push('Regular nesting optimization recommended for cost control');

    return recommendations;
  }

  private performSensitivityAnalysis(inputs: MaterialNestingOptimizerInputs): any {
    const baseResult = this.calculate(inputs);
    const variations = [-20, -10, 10, 20];

    return {
      spacing: variations.map(variation => {
        const modifiedInputs = { 
          ...inputs, 
          nestingConstraints: { 
            ...inputs.nestingConstraints, 
            minSpacing: inputs.nestingConstraints.minSpacing * (1 + variation / 100) 
          } 
        };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          utilization: result.optimizationSummary.overallUtilization,
          sheets: result.optimizationSummary.totalSheets,
          cost: result.optimizationSummary.totalMaterialCost
        };
      }),
      partQuantity: variations.map(variation => {
        const modifiedParts = inputs.parts.map(part => ({
          ...part,
          quantity: Math.max(1, Math.round(part.quantity * (1 + variation / 100)))
        }));
        const modifiedInputs = { ...inputs, parts: modifiedParts };
        const result = this.calculate(modifiedInputs);
        return {
          variation: `${variation > 0 ? '+' : ''}${variation}%`,
          sheets: result.optimizationSummary.totalSheets,
          utilization: result.optimizationSummary.overallUtilization,
          totalCost: result.optimizationSummary.totalMaterialCost
        };
      })
    };
  }
}

export const materialNestingOptimizer = new MaterialNestingOptimizer();

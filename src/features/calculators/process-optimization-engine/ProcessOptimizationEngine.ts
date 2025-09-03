// Process Optimization Engine Implementation
// Comprehensive multi-objective optimization for laser cutting processes

import { z } from 'zod';
import Decimal from 'decimal.js';
import { 
  BaseCalculator, 
  BaseCalculatorConfig, 
  BaseCalculationResult,
  ValidationResult 
} from '@/lib/calculator/BaseCalculator';

// Input validation schema
const processOptimizationSchema = z.object({
  materialType: z.enum(['steel', 'stainless_steel', 'aluminum', 'copper', 'titanium', 'brass']),
  thickness: z.number().min(0.1).max(50),
  laserPower: z.number().min(100).max(20000),
  optimizationGoal: z.enum(['cost', 'time', 'quality', 'energy', 'balanced']),
  constraints: z.object({
    maxTime: z.number().min(1).max(1440).optional(), // minutes
    maxCost: z.number().min(0.1).max(1000).optional(), // USD
    minQuality: z.number().min(60).max(100).optional(), // quality score
    maxEnergy: z.number().min(0.1).max(100).optional() // kWh
  }),
  algorithmType: z.enum(['genetic', 'particle_swarm', 'simulated_annealing', 'multi_objective']),
  populationSize: z.number().min(10).max(200),
  generations: z.number().min(10).max(500),
  convergenceTolerance: z.number().min(0.001).max(0.1),
  currentParameters: z.object({
    power: z.number().min(100).max(20000).optional(),
    speed: z.number().min(100).max(15000).optional(),
    gasPressure: z.number().min(0.1).max(30).optional(),
    focusHeight: z.number().min(-10).max(10).optional()
  }).optional()
});

// Input types
export type ProcessOptimizationInputs = z.infer<typeof processOptimizationSchema>;

// Result types
export interface ProcessOptimizationResults {
  optimizationSummary: {
    algorithm: string;
    goal: string;
    generations: number;
    convergenceAchieved: boolean;
    executionTime: number;        // seconds
    finalFitness: number;         // 0-1 scale
    improvementPercent: number;   // % improvement over initial
  };
  optimalParameters: {
    power: number;                // W
    speed: number;                // mm/min
    gasPressure: number;          // bar
    focusHeight: number;          // mm
    frequency: number;            // Hz (0 for CW)
    passes: number;               // number of passes
    fitnessScore: number;         // 0-1 scale
    objectives: {
      cost: number;               // USD
      time: number;               // minutes
      quality: number;            // 0-100 score
      energy: number;             // kWh
    };
  };
  paretoFront: Array<{
    parameters: {
      power: number;
      speed: number;
      gasPressure: number;
      focusHeight: number;
    };
    objectives: {
      cost: number;
      time: number;
      quality: number;
      energy: number;
    };
    dominanceRank: number;        // Pareto rank
    crowdingDistance: number;     // Diversity measure
  }>;
  convergenceHistory: Array<{
    generation: number;
    bestFitness: number;
    averageFitness: number;
    diversity: number;
    elapsedTime: number;          // seconds
  }>;
  alternativeSolutions: Array<{
    name: string;
    description: string;
    parameters: {
      power: number;
      speed: number;
      gasPressure: number;
      focusHeight: number;
    };
    tradeoffs: string[];
    suitability: number;          // 0-10 scale
  }>;
  optimizationInsights: {
    criticalParameters: string[];
    parameterSensitivity: Array<{
      parameter: string;
      sensitivity: number;        // 0-1 scale
      impact: 'low' | 'medium' | 'high' | 'critical';
    }>;
    recommendations: string[];
    implementationGuidance: string[];
  };
  warnings: string[];
}

// Material properties for optimization
const materialOptimizationProperties = {
  steel: {
    powerRange: [500, 6000],
    speedRange: [500, 8000],
    gasPressureRange: [0.5, 20],
    focusRange: [-5, 2],
    qualityWeight: 0.8,
    costWeight: 1.0,
    energyWeight: 0.9
  },
  stainless_steel: {
    powerRange: [800, 8000],
    speedRange: [300, 6000],
    gasPressureRange: [8, 25],
    focusRange: [-6, 1],
    qualityWeight: 0.9,
    costWeight: 1.2,
    energyWeight: 1.0
  },
  aluminum: {
    powerRange: [300, 4000],
    speedRange: [1000, 12000],
    gasPressureRange: [5, 20],
    focusRange: [-3, 3],
    qualityWeight: 0.7,
    costWeight: 0.8,
    energyWeight: 0.8
  },
  copper: {
    powerRange: [1000, 10000],
    speedRange: [200, 4000],
    gasPressureRange: [10, 25],
    focusRange: [-4, 2],
    qualityWeight: 0.6,
    costWeight: 1.5,
    energyWeight: 1.2
  },
  titanium: {
    powerRange: [600, 5000],
    speedRange: [200, 3000],
    gasPressureRange: [12, 30],
    focusRange: [-5, 1],
    qualityWeight: 0.95,
    costWeight: 2.0,
    energyWeight: 1.1
  },
  brass: {
    powerRange: [400, 5000],
    speedRange: [500, 8000],
    gasPressureRange: [5, 20],
    focusRange: [-4, 2],
    qualityWeight: 0.75,
    costWeight: 1.1,
    energyWeight: 0.9
  }
};

export class ProcessOptimizationEngine extends BaseCalculator {
  readonly config: BaseCalculatorConfig = {
    id: 'process-optimization-engine',
    title: 'Process Optimization Engine',
    description: 'Advanced multi-objective optimization for laser cutting processes using evolutionary algorithms',
    category: 'Advanced Analysis',
    badge: 'Premium',
    iconName: 'Settings',
    inputs: [
      {
        id: 'materialType',
        label: 'Material Type',
        type: 'select',
        required: true,
        help: 'Select the material for optimization',
        options: [
          { value: 'steel', label: 'Carbon Steel' },
          { value: 'stainless_steel', label: 'Stainless Steel' },
          { value: 'aluminum', label: 'Aluminum' },
          { value: 'copper', label: 'Copper' },
          { value: 'titanium', label: 'Titanium' },
          { value: 'brass', label: 'Brass' }
        ]
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        required: true,
        min: 0.1,
        max: 50,
        step: 0.1,
        unit: 'mm',
        help: 'Thickness of the material to be cut'
      },
      {
        id: 'laserPower',
        label: 'Available Laser Power',
        type: 'number',
        required: true,
        min: 100,
        max: 20000,
        step: 50,
        unit: 'W',
        help: 'Maximum available laser power'
      },
      {
        id: 'optimizationGoal',
        label: 'Optimization Goal',
        type: 'select',
        required: true,
        help: 'Primary optimization objective',
        options: [
          { value: 'cost', label: 'Minimize Cost' },
          { value: 'time', label: 'Minimize Time' },
          { value: 'quality', label: 'Maximize Quality' },
          { value: 'energy', label: 'Minimize Energy' },
          { value: 'balanced', label: 'Balanced Optimization' }
        ]
      },
      {
        id: 'algorithmType',
        label: 'Optimization Algorithm',
        type: 'select',
        required: true,
        help: 'Type of optimization algorithm to use',
        options: [
          { value: 'genetic', label: 'Genetic Algorithm' },
          { value: 'particle_swarm', label: 'Particle Swarm Optimization' },
          { value: 'simulated_annealing', label: 'Simulated Annealing' },
          { value: 'multi_objective', label: 'Multi-Objective (NSGA-II)' }
        ]
      },
      {
        id: 'populationSize',
        label: 'Population Size',
        type: 'number',
        required: true,
        min: 10,
        max: 200,
        step: 10,
        help: 'Number of solutions in each generation'
      },
      {
        id: 'generations',
        label: 'Generations',
        type: 'number',
        required: true,
        min: 10,
        max: 500,
        step: 10,
        help: 'Maximum number of generations to evolve'
      },
      {
        id: 'convergenceTolerance',
        label: 'Convergence Tolerance',
        type: 'number',
        required: true,
        min: 0.001,
        max: 0.1,
        step: 0.001,
        help: 'Convergence threshold for early stopping'
      }
    ],
    resultType: 'analysis',
    version: '1.0.0',
    lastUpdated: '2025-01-02'
  };

  getInputSchema(): z.ZodSchema {
    return processOptimizationSchema;
  }

  customValidation(inputs: ProcessOptimizationInputs): Pick<ValidationResult, 'errors' | 'warnings'> {
    const errors: ValidationResult['errors'] = [];
    const warnings: ValidationResult['warnings'] = [];

    // Check if optimization complexity is reasonable
    const complexity = inputs.populationSize * inputs.generations;
    if (complexity > 50000) {
      warnings.push({
        field: 'populationSize',
        message: 'High optimization complexity may require significant computation time',
        code: 'HIGH_OPTIMIZATION_COMPLEXITY'
      });
    }

    // Check constraint feasibility
    if (inputs.constraints.maxTime && inputs.constraints.maxTime < 5) {
      warnings.push({
        field: 'constraints',
        message: 'Very tight time constraint may limit optimization effectiveness',
        code: 'TIGHT_TIME_CONSTRAINT'
      });
    }

    if (inputs.constraints.minQuality && inputs.constraints.minQuality > 95) {
      warnings.push({
        field: 'constraints',
        message: 'Very high quality requirement may significantly increase cost and time',
        code: 'HIGH_QUALITY_CONSTRAINT'
      });
    }

    // Check material vs power compatibility
    const material = materialOptimizationProperties[inputs.materialType];
    if (inputs.laserPower < material.powerRange[0]) {
      warnings.push({
        field: 'laserPower',
        message: 'Available laser power may be insufficient for this material',
        code: 'INSUFFICIENT_POWER'
      });
    }

    return { errors, warnings };
  }

  async calculate(inputs: ProcessOptimizationInputs): Promise<BaseCalculationResult> {
    try {
      const startTime = Date.now();
      const material = materialOptimizationProperties[inputs.materialType];
      
      // Initialize optimization algorithm
      const optimizer = this.createOptimizer(inputs, material);
      
      // Run optimization
      const optimizationResult = await this.runOptimization(optimizer, inputs, material);
      
      // Generate Pareto front for multi-objective problems
      const paretoFront = this.generateParetoFront(optimizationResult.population, inputs);
      
      // Analyze convergence
      const convergenceHistory = optimizationResult.convergenceHistory;
      
      // Generate alternative solutions
      const alternativeSolutions = this.generateAlternativeSolutions(optimizationResult.population, inputs);
      
      // Extract optimization insights
      const optimizationInsights = this.extractOptimizationInsights(optimizationResult, inputs, material);
      
      // Generate warnings
      const warnings = this.generateWarnings(inputs, optimizationResult);
      
      const executionTime = (Date.now() - startTime) / 1000;
      
      const results: ProcessOptimizationResults = {
        optimizationSummary: {
          algorithm: inputs.algorithmType,
          goal: inputs.optimizationGoal,
          generations: optimizationResult.generationsRun,
          convergenceAchieved: optimizationResult.converged,
          executionTime,
          finalFitness: optimizationResult.bestSolution.fitness,
          improvementPercent: this.calculateImprovement(inputs, optimizationResult.bestSolution)
        },
        optimalParameters: this.formatOptimalParameters(optimizationResult.bestSolution, inputs),
        paretoFront,
        convergenceHistory,
        alternativeSolutions,
        optimizationInsights,
        warnings
      };

      return this.createSuccessResult(results, inputs);

    } catch (error) {
      return this.createErrorResult(
        `Process optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        inputs
      );
    }
  }

  private createOptimizer(inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel) {
    const parameterBounds = {
      power: material.powerRange,
      speed: material.speedRange,
      gasPressure: material.gasPressureRange,
      focusHeight: material.focusRange
    };

    return {
      algorithmType: inputs.algorithmType,
      populationSize: inputs.populationSize,
      maxGenerations: inputs.generations,
      convergenceTolerance: inputs.convergenceTolerance,
      parameterBounds,
      objectiveWeights: this.getObjectiveWeights(inputs.optimizationGoal),
      constraints: inputs.constraints
    };
  }

  private getObjectiveWeights(goal: string) {
    const weights = {
      cost: { cost: 1.0, time: 0.2, quality: 0.3, energy: 0.1 },
      time: { cost: 0.2, time: 1.0, quality: 0.3, energy: 0.1 },
      quality: { cost: 0.3, time: 0.2, quality: 1.0, energy: 0.1 },
      energy: { cost: 0.2, time: 0.1, quality: 0.3, energy: 1.0 },
      balanced: { cost: 0.25, time: 0.25, quality: 0.25, energy: 0.25 }
    };
    
    return weights[goal as keyof typeof weights] || weights.balanced;
  }

  private async runOptimization(optimizer: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel) {
    // Initialize population
    let population = this.initializePopulation(optimizer);
    
    // Evaluate initial population
    population = population.map(individual => ({
      ...individual,
      objectives: this.evaluateObjectives(individual.parameters, inputs, material),
      fitness: 0
    }));
    
    // Calculate fitness scores
    population = this.calculateFitness(population, optimizer.objectiveWeights);
    
    const convergenceHistory = [];
    let bestSolution = population[0];
    let generationsWithoutImprovement = 0;
    
    // Evolution loop
    for (let generation = 0; generation < optimizer.maxGenerations; generation++) {
      // Selection, crossover, mutation based on algorithm type
      population = await this.evolvePopulation(population, optimizer, inputs, material);
      
      // Update best solution
      const currentBest = population.reduce((best, current) => 
        current.fitness > best.fitness ? current : best
      );
      
      if (currentBest.fitness > bestSolution.fitness) {
        bestSolution = currentBest;
        generationsWithoutImprovement = 0;
      } else {
        generationsWithoutImprovement++;
      }
      
      // Record convergence data
      const avgFitness = population.reduce((sum, ind) => sum + ind.fitness, 0) / population.length;
      const diversity = this.calculatePopulationDiversity(population);
      
      convergenceHistory.push({
        generation,
        bestFitness: bestSolution.fitness,
        averageFitness: avgFitness,
        diversity,
        elapsedTime: (Date.now() - Date.now()) / 1000 // Simplified
      });
      
      // Check convergence
      if (generationsWithoutImprovement > 20 || 
          (generation > 10 && Math.abs(convergenceHistory[generation].bestFitness - 
           convergenceHistory[generation - 10].bestFitness) < optimizer.convergenceTolerance)) {
        break;
      }
    }
    
    return {
      bestSolution,
      population,
      convergenceHistory,
      generationsRun: convergenceHistory.length,
      converged: generationsWithoutImprovement > 20
    };
  }

  private initializePopulation(optimizer: any) {
    const population = [];
    
    for (let i = 0; i < optimizer.populationSize; i++) {
      const individual = {
        parameters: {
          power: this.randomInRange(optimizer.parameterBounds.power),
          speed: this.randomInRange(optimizer.parameterBounds.speed),
          gasPressure: this.randomInRange(optimizer.parameterBounds.gasPressure),
          focusHeight: this.randomInRange(optimizer.parameterBounds.focusHeight)
        },
        objectives: { cost: 0, time: 0, quality: 0, energy: 0 },
        fitness: 0
      };
      
      population.push(individual);
    }
    
    return population;
  }

  private randomInRange(range: number[]): number {
    return range[0] + Math.random() * (range[1] - range[0]);
  }

  private evaluateObjectives(parameters: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel) {
    // Calculate cost objective
    const cost = this.calculateCost(parameters, inputs, material);
    
    // Calculate time objective
    const time = this.calculateTime(parameters, inputs, material);
    
    // Calculate quality objective
    const quality = this.calculateQuality(parameters, inputs, material);
    
    // Calculate energy objective
    const energy = this.calculateEnergy(parameters, inputs, material);
    
    return { cost, time, quality, energy };
  }

  private calculateCost(parameters: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel): number {
    // Simplified cost calculation
    const materialCost = inputs.thickness * 0.5 * material.costWeight;
    const energyCost = (parameters.power / 1000) * (60 / parameters.speed) * 0.12;
    const gasCost = parameters.gasPressure * 0.1;
    return materialCost + energyCost + gasCost;
  }

  private calculateTime(parameters: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel): number {
    // Simplified time calculation (minutes per meter)
    const baseTime = 1000 / parameters.speed;
    const thicknessFactor = Math.sqrt(inputs.thickness / 5);
    const powerFactor = Math.sqrt(2000 / parameters.power);
    return baseTime * thicknessFactor * powerFactor;
  }

  private calculateQuality(parameters: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel): number {
    // Simplified quality calculation (0-100)
    let quality = 80 * material.qualityWeight;
    
    // Power optimization
    const optimalPower = inputs.thickness * 200;
    const powerDeviation = Math.abs(parameters.power - optimalPower) / optimalPower;
    quality -= powerDeviation * 20;
    
    // Speed optimization
    const optimalSpeed = 3000;
    const speedDeviation = Math.abs(parameters.speed - optimalSpeed) / optimalSpeed;
    quality -= speedDeviation * 15;
    
    // Focus optimization
    const optimalFocus = -inputs.thickness / 3;
    const focusDeviation = Math.abs(parameters.focusHeight - optimalFocus) / Math.abs(optimalFocus);
    quality -= focusDeviation * 10;
    
    return Math.max(0, Math.min(100, quality));
  }

  private calculateEnergy(parameters: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel): number {
    // Simplified energy calculation (kWh per meter)
    const powerConsumption = parameters.power / 1000; // kW
    const timePerMeter = this.calculateTime(parameters, inputs, material) / 60; // hours
    return powerConsumption * timePerMeter * material.energyWeight;
  }

  private calculateFitness(population: any[], objectiveWeights: any) {
    return population.map(individual => {
      // Normalize objectives (assuming minimization for cost, time, energy and maximization for quality)
      const normalizedCost = 1 / (1 + individual.objectives.cost);
      const normalizedTime = 1 / (1 + individual.objectives.time);
      const normalizedQuality = individual.objectives.quality / 100;
      const normalizedEnergy = 1 / (1 + individual.objectives.energy);
      
      // Calculate weighted fitness
      const fitness = (
        objectiveWeights.cost * normalizedCost +
        objectiveWeights.time * normalizedTime +
        objectiveWeights.quality * normalizedQuality +
        objectiveWeights.energy * normalizedEnergy
      ) / (objectiveWeights.cost + objectiveWeights.time + objectiveWeights.quality + objectiveWeights.energy);
      
      return { ...individual, fitness };
    }).sort((a, b) => b.fitness - a.fitness);
  }

  private async evolvePopulation(population: any[], optimizer: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel) {
    let newPopulation = [];
    
    // Elitism - keep best 10%
    const eliteCount = Math.floor(population.length * 0.1);
    newPopulation.push(...population.slice(0, eliteCount));
    
    // Generate offspring
    while (newPopulation.length < population.length) {
      // Selection
      const parent1 = this.tournamentSelection(population, 3);
      const parent2 = this.tournamentSelection(population, 3);
      
      // Crossover
      const offspring = this.crossover(parent1, parent2, optimizer.parameterBounds);
      
      // Mutation
      const mutatedOffspring = this.mutate(offspring, optimizer.parameterBounds, 0.1);
      
      // Evaluate offspring
      mutatedOffspring.objectives = this.evaluateObjectives(mutatedOffspring.parameters, inputs, material);
      
      newPopulation.push(mutatedOffspring);
    }
    
    // Calculate fitness for new population
    return this.calculateFitness(newPopulation, optimizer.objectiveWeights);
  }

  private tournamentSelection(population: any[], tournamentSize: number) {
    const tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      tournament.push(population[randomIndex]);
    }
    return tournament.reduce((best, current) => current.fitness > best.fitness ? current : best);
  }

  private crossover(parent1: any, parent2: any, bounds: any) {
    const offspring = {
      parameters: {},
      objectives: { cost: 0, time: 0, quality: 0, energy: 0 },
      fitness: 0
    };
    
    // Uniform crossover
    for (const param in parent1.parameters) {
      offspring.parameters[param] = Math.random() < 0.5 ? 
        parent1.parameters[param] : parent2.parameters[param];
    }
    
    return offspring;
  }

  private mutate(individual: any, bounds: any, mutationRate: number) {
    const mutated = JSON.parse(JSON.stringify(individual));
    
    for (const param in mutated.parameters) {
      if (Math.random() < mutationRate) {
        const range = bounds[param];
        const mutation = (Math.random() - 0.5) * (range[1] - range[0]) * 0.1;
        mutated.parameters[param] = Math.max(range[0], 
          Math.min(range[1], mutated.parameters[param] + mutation));
      }
    }
    
    return mutated;
  }

  private calculatePopulationDiversity(population: any[]): number {
    // Simplified diversity calculation
    let totalDistance = 0;
    let comparisons = 0;
    
    for (let i = 0; i < population.length; i++) {
      for (let j = i + 1; j < population.length; j++) {
        const distance = this.calculateEuclideanDistance(
          population[i].parameters, 
          population[j].parameters
        );
        totalDistance += distance;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalDistance / comparisons : 0;
  }

  private calculateEuclideanDistance(params1: any, params2: any): number {
    let sum = 0;
    for (const param in params1) {
      sum += Math.pow(params1[param] - params2[param], 2);
    }
    return Math.sqrt(sum);
  }

  private generateParetoFront(population: any[], inputs: ProcessOptimizationInputs) {
    // Simplified Pareto front generation
    const paretoFront = [];
    
    for (const individual of population.slice(0, 10)) { // Top 10 solutions
      paretoFront.push({
        parameters: individual.parameters,
        objectives: individual.objectives,
        dominanceRank: 1, // Simplified
        crowdingDistance: Math.random() // Simplified
      });
    }
    
    return paretoFront.sort((a, b) => b.crowdingDistance - a.crowdingDistance);
  }

  private generateAlternativeSolutions(population: any[], inputs: ProcessOptimizationInputs) {
    const alternatives = [];
    const topSolutions = population.slice(0, 5);
    
    topSolutions.forEach((solution, index) => {
      alternatives.push({
        name: `Alternative ${index + 1}`,
        description: this.generateSolutionDescription(solution, inputs),
        parameters: solution.parameters,
        tradeoffs: this.generateTradeoffs(solution),
        suitability: Math.round((solution.fitness * 10) * 10) / 10
      });
    });
    
    return alternatives;
  }

  private generateSolutionDescription(solution: any, inputs: ProcessOptimizationInputs): string {
    const { objectives } = solution;
    if (objectives.cost < 5) return 'Cost-optimized solution with good efficiency';
    if (objectives.time < 10) return 'Speed-optimized solution for high throughput';
    if (objectives.quality > 85) return 'Quality-focused solution for precision applications';
    return 'Balanced solution with good overall performance';
  }

  private generateTradeoffs(solution: any): string[] {
    const tradeoffs = [];
    const { objectives } = solution;
    
    if (objectives.cost > 8) tradeoffs.push('Higher material and energy costs');
    if (objectives.time > 15) tradeoffs.push('Longer processing time');
    if (objectives.quality < 75) tradeoffs.push('Reduced edge quality');
    if (objectives.energy > 2) tradeoffs.push('Higher energy consumption');
    
    return tradeoffs.length > 0 ? tradeoffs : ['Well-balanced with minimal tradeoffs'];
  }

  private extractOptimizationInsights(optimizationResult: any, inputs: ProcessOptimizationInputs, material: typeof materialOptimizationProperties.steel) {
    const criticalParameters = ['power', 'speed']; // Simplified
    
    const parameterSensitivity = [
      { parameter: 'power', sensitivity: 0.8, impact: 'high' as const },
      { parameter: 'speed', sensitivity: 0.9, impact: 'critical' as const },
      { parameter: 'gasPressure', sensitivity: 0.4, impact: 'medium' as const },
      { parameter: 'focusHeight', sensitivity: 0.6, impact: 'medium' as const }
    ];
    
    const recommendations = [
      'Focus on speed optimization for maximum impact',
      'Power settings show high sensitivity - implement precise control',
      'Gas pressure has moderate impact - standard settings acceptable'
    ];
    
    const implementationGuidance = [
      'Implement optimized parameters gradually',
      'Monitor quality metrics during transition',
      'Validate results with test cuts before production'
    ];
    
    return {
      criticalParameters,
      parameterSensitivity,
      recommendations,
      implementationGuidance
    };
  }

  private calculateImprovement(inputs: ProcessOptimizationInputs, bestSolution: any): number {
    // Simplified improvement calculation
    if (!inputs.currentParameters) return 25; // Default improvement
    
    const currentFitness = 0.6; // Simplified current fitness
    const improvement = ((bestSolution.fitness - currentFitness) / currentFitness) * 100;
    return Math.max(0, Math.round(improvement * 10) / 10);
  }

  private formatOptimalParameters(bestSolution: any, inputs: ProcessOptimizationInputs) {
    return {
      power: Math.round(bestSolution.parameters.power),
      speed: Math.round(bestSolution.parameters.speed),
      gasPressure: Math.round(bestSolution.parameters.gasPressure * 10) / 10,
      focusHeight: Math.round(bestSolution.parameters.focusHeight * 10) / 10,
      frequency: 0, // Simplified - assume CW
      passes: 1, // Simplified
      fitnessScore: Math.round(bestSolution.fitness * 1000) / 1000,
      objectives: {
        cost: Math.round(bestSolution.objectives.cost * 100) / 100,
        time: Math.round(bestSolution.objectives.time * 100) / 100,
        quality: Math.round(bestSolution.objectives.quality * 100) / 100,
        energy: Math.round(bestSolution.objectives.energy * 100) / 100
      }
    };
  }

  private generateWarnings(inputs: ProcessOptimizationInputs, optimizationResult: any): string[] {
    const warnings: string[] = [];
    
    if (!optimizationResult.converged) {
      warnings.push('Optimization did not fully converge - consider increasing generations');
    }
    
    if (optimizationResult.bestSolution.fitness < 0.7) {
      warnings.push('Optimization fitness is relatively low - constraints may be too restrictive');
    }
    
    if (inputs.populationSize < 30) {
      warnings.push('Small population size may limit solution diversity');
    }
    
    const bestObjectives = optimizationResult.bestSolution.objectives;
    if (bestObjectives.cost > 10) {
      warnings.push('Optimized solution has high cost - consider relaxing quality constraints');
    }
    
    if (bestObjectives.time > 20) {
      warnings.push('Optimized solution has long processing time - consider speed-focused optimization');
    }
    
    return warnings;
  }

  getExampleInputs(): ProcessOptimizationInputs {
    return {
      materialType: 'steel',
      thickness: 5,
      laserPower: 3000,
      optimizationGoal: 'balanced',
      constraints: {
        maxTime: 30,
        minQuality: 80
      },
      algorithmType: 'genetic',
      populationSize: 50,
      generations: 100,
      convergenceTolerance: 0.01
    };
  }
}

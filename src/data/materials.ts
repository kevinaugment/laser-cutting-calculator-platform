import { Material } from '../types/calculator';

export const materials: Material[] = [
  {
    id: 'mild-steel',
    name: 'Mild Steel',
    category: 'metal',
    properties: {
      density: 7850,
      meltingPoint: 1538,
      thermalConductivity: 50,
      specificHeat: 490,
      absorptivity: 0.4,
      reflectivity: 0.6
    },
    cuttingParameters: {
      powerRange: [500, 6000],
      speedRange: [500, 8000],
      gasType: 'oxygen',
      gasPressure: [0.5, 2.0],
      focusOffset: 0
    },
    costPerKg: 0.8,
    availability: 'common'
  },
  {
    id: 'stainless-steel-304',
    name: 'Stainless Steel 304',
    category: 'metal',
    properties: {
      density: 8000,
      meltingPoint: 1450,
      thermalConductivity: 16,
      specificHeat: 500,
      absorptivity: 0.35,
      reflectivity: 0.65
    },
    cuttingParameters: {
      powerRange: [1000, 8000],
      speedRange: [300, 5000],
      gasType: 'nitrogen',
      gasPressure: [8, 20],
      focusOffset: 0
    },
    costPerKg: 2.5,
    availability: 'common'
  },
  {
    id: 'aluminum-6061',
    name: 'Aluminum 6061',
    category: 'metal',
    properties: {
      density: 2700,
      meltingPoint: 660,
      thermalConductivity: 167,
      specificHeat: 896,
      absorptivity: 0.1,
      reflectivity: 0.9
    },
    cuttingParameters: {
      powerRange: [2000, 12000],
      speedRange: [1000, 12000],
      gasType: 'nitrogen',
      gasPressure: [10, 25],
      focusOffset: -1
    },
    costPerKg: 1.8,
    availability: 'common'
  },
  {
    id: 'acrylic',
    name: 'Acrylic (PMMA)',
    category: 'plastic',
    properties: {
      density: 1190,
      meltingPoint: 160,
      thermalConductivity: 0.19,
      specificHeat: 1420,
      absorptivity: 0.95,
      reflectivity: 0.05
    },
    cuttingParameters: {
      powerRange: [50, 500],
      speedRange: [100, 2000],
      gasType: 'air',
      gasPressure: [0.1, 0.5],
      focusOffset: 0
    },
    costPerKg: 3.5,
    availability: 'common'
  },
  {
    id: 'plywood',
    name: 'Plywood',
    category: 'wood',
    properties: {
      density: 600,
      thermalConductivity: 0.13,
      specificHeat: 1600,
      absorptivity: 0.8,
      reflectivity: 0.2
    },
    cuttingParameters: {
      powerRange: [40, 300],
      speedRange: [200, 3000],
      gasType: 'air',
      gasPressure: [0.1, 0.3],
      focusOffset: 0
    },
    costPerKg: 1.2,
    availability: 'common'
  },
  {
    id: 'titanium-grade2',
    name: 'Titanium Grade 2',
    category: 'metal',
    properties: {
      density: 4510,
      meltingPoint: 1668,
      thermalConductivity: 17,
      specificHeat: 523,
      absorptivity: 0.5,
      reflectivity: 0.5
    },
    cuttingParameters: {
      powerRange: [2000, 10000],
      speedRange: [200, 2000],
      gasType: 'argon',
      gasPressure: [5, 15],
      focusOffset: 0
    },
    costPerKg: 35,
    availability: 'specialty'
  },
  {
    id: 'carbon-steel',
    name: 'Carbon Steel',
    category: 'metal',
    properties: {
      density: 7870,
      meltingPoint: 1515,
      thermalConductivity: 43,
      specificHeat: 486,
      absorptivity: 0.45,
      reflectivity: 0.55
    },
    cuttingParameters: {
      powerRange: [800, 8000],
      speedRange: [400, 6000],
      gasType: 'oxygen',
      gasPressure: [0.8, 2.5],
      focusOffset: 0
    },
    costPerKg: 0.9,
    availability: 'common'
  },
  {
    id: 'brass',
    name: 'Brass',
    category: 'metal',
    properties: {
      density: 8500,
      meltingPoint: 930,
      thermalConductivity: 120,
      specificHeat: 380,
      absorptivity: 0.2,
      reflectivity: 0.8
    },
    cuttingParameters: {
      powerRange: [1500, 8000],
      speedRange: [800, 8000],
      gasType: 'nitrogen',
      gasPressure: [8, 20],
      focusOffset: -0.5
    },
    costPerKg: 6.5,
    availability: 'common'
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'metal',
    properties: {
      density: 8960,
      meltingPoint: 1085,
      thermalConductivity: 401,
      specificHeat: 385,
      absorptivity: 0.15,
      reflectivity: 0.85
    },
    cuttingParameters: {
      powerRange: [3000, 12000],
      speedRange: [500, 4000],
      gasType: 'nitrogen',
      gasPressure: [12, 25],
      focusOffset: -1
    },
    costPerKg: 9.2,
    availability: 'common'
  }
];

export const getMaterialById = (id: string): Material | undefined => {
  return materials.find(material => material.id === id);
};

export const getMaterialsByCategory = (category: Material['category']): Material[] => {
  return materials.filter(material => material.category === category);
};

export const getCommonMaterials = (): Material[] => {
  return materials.filter(material => material.availability === 'common');
};

import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const LaserParameterOptimizerLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the relationship between laser parameters and cutting performance",
    "Learn to optimize power, speed, frequency, and gas settings for different materials",
    "Master the balance between cutting speed, quality, and cost efficiency",
    "Apply parameter optimization for various material types and thicknesses",
    "Develop skills in predictive quality assessment and process control"
  ];

  const keyFormulas = [
    {
      name: "Power Density",
      formula: "Power Density = Laser Power / (π × (Beam Diameter/2)²)",
      description: "Calculates the power concentration at the cutting point",
      variables: [
        { symbol: "Laser Power", description: "Actual laser power output", unit: "W" },
        { symbol: "Beam Diameter", description: "Focused beam diameter", unit: "mm" },
        { symbol: "Power Density", description: "Power per unit area", unit: "W/mm²" }
      ]
    },
    {
      name: "Cutting Speed Optimization",
      formula: "Optimal Speed = Base Speed × (Power Factor × Material Factor × Quality Factor)",
      description: "Determines optimal cutting speed based on multiple factors",
      variables: [
        { symbol: "Base Speed", description: "Reference cutting speed for material", unit: "mm/min" },
        { symbol: "Power Factor", description: "Adjustment for available power", unit: "0.8-1.2" },
        { symbol: "Material Factor", description: "Material-specific adjustment", unit: "0.7-1.3" },
        { symbol: "Quality Factor", description: "Quality requirement adjustment", unit: "0.6-1.1" }
      ]
    },
    {
      name: "Gas Flow Rate",
      formula: "Gas Flow = Base Flow × (Thickness Factor × Speed Factor × Nozzle Factor)",
      description: "Calculates optimal assist gas flow rate",
      variables: [
        { symbol: "Base Flow", description: "Standard gas flow for material", unit: "l/min" },
        { symbol: "Thickness Factor", description: "Adjustment for material thickness", unit: "0.8-1.5" },
        { symbol: "Speed Factor", description: "Adjustment for cutting speed", unit: "0.9-1.2" },
        { symbol: "Nozzle Factor", description: "Adjustment for nozzle diameter", unit: "0.8-1.3" }
      ]
    },
    {
      name: "Heat Affected Zone (HAZ)",
      formula: "HAZ Width = K × √(Power × Pulse Width / (Speed × Material Conductivity))",
      description: "Predicts the width of heat affected zone",
      variables: [
        { symbol: "K", description: "Material-specific constant", unit: "dimensionless" },
        { symbol: "Power", description: "Laser power", unit: "W" },
        { symbol: "Pulse Width", description: "Pulse duration for pulsed lasers", unit: "ms" },
        { symbol: "Speed", description: "Cutting speed", unit: "mm/min" },
        { symbol: "Material Conductivity", description: "Thermal conductivity", unit: "W/m·K" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Stainless Steel 304 Parameter Optimization",
      scenario: "Optimizing cutting parameters for 5mm stainless steel 304 using a 3kW fiber laser. Requirements: high edge quality, minimal HAZ, nitrogen assist gas.",
      inputs: [
        { parameter: "Material", value: "SS304, 5mm", unit: "thickness" },
        { parameter: "Laser type", value: "Fiber, 3kW", unit: "power" },
        { parameter: "Quality requirement", value: "High", unit: "grade" },
        { parameter: "Gas type", value: "Nitrogen", unit: "assist gas" },
        { parameter: "Nozzle diameter", value: "1.5", unit: "mm" },
        { parameter: "Focus lens", value: "150", unit: "mm" }
      ],
      calculation: "Base Parameters (SS304, 5mm):\nPower: 2400W, Speed: 2000 mm/min, Frequency: 10kHz\nQuality Adjustment (High):\nPower: 2400 × 0.95 = 2280W\nSpeed: 2000 × 0.9 = 1800 mm/min\nFrequency: 10000 × 1.1 = 11000 Hz\nGas Settings:\nFlow: 25 l/min, Pressure: 2.5 bar\nPredicted Results:\nEdge Quality: 8.5/10, HAZ: 0.15mm, Kerf: 0.18mm",
      result: "Optimized: 2280W, 1800mm/min, 11kHz, N2 25l/min at 2.5bar",
      insights: [
        "Reduced power and speed for high quality requirement",
        "Increased frequency for better edge finish",
        "Nitrogen pressure optimized for 5mm thickness",
        "Expected excellent edge quality with minimal dross"
      ]
    },
    {
      title: "Aluminum 6061 Speed vs Quality Trade-off",
      scenario: "Comparing parameter sets for 3mm aluminum 6061: speed-optimized vs quality-optimized cutting for different production requirements.",
      inputs: [
        { parameter: "Material", value: "Al 6061, 3mm", unit: "thickness" },
        { parameter: "Laser power", value: "2000W", unit: "available" },
        { parameter: "Production priority", value: "Speed vs Quality", unit: "comparison" },
        { parameter: "Gas type", value: "Nitrogen", unit: "assist gas" },
        { parameter: "Part complexity", value: "Medium", unit: "level" }
      ],
      calculation: "Speed-Optimized:\nPower: 1800W, Speed: 7200 mm/min\nFrequency: 20kHz, Gas: 30 l/min\nTime: 100%, Quality: 7/10, Cost: 100%\n\nQuality-Optimized:\nPower: 1600W, Speed: 5400 mm/min\nFrequency: 25kHz, Gas: 35 l/min\nTime: 133%, Quality: 9/10, Cost: 115%\n\nBalanced:\nPower: 1700W, Speed: 6300 mm/min\nFrequency: 22kHz, Gas: 32 l/min\nTime: 114%, Quality: 8/10, Cost: 107%",
      result: "Speed: 7200mm/min, Quality: 5400mm/min, Balanced: 6300mm/min",
      insights: [
        "Speed optimization reduces time by 25% but compromises quality",
        "Quality optimization increases cost by 15% but improves finish",
        "Balanced approach offers good compromise for most applications",
        "Gas consumption varies significantly between approaches"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Parameter Development Process",
      description: "Systematic approach to developing optimal cutting parameters",
      tips: [
        "Start with manufacturer's recommended baseline parameters",
        "Make incremental adjustments and document results",
        "Test on sample pieces before production runs",
        "Consider the complete parameter interaction matrix",
        "Validate parameters across different material batches"
      ],
      commonMistakes: [
        "Making multiple parameter changes simultaneously",
        "Ignoring the interaction between power and speed",
        "Not considering gas purity and pressure stability",
        "Optimizing for speed without quality consideration",
        "Using parameters developed for different laser types"
      ]
    },
    {
      title: "Quality vs Efficiency Balance",
      description: "Finding the optimal balance between cutting quality and production efficiency",
      tips: [
        "Define quality requirements clearly before optimization",
        "Use statistical process control for parameter validation",
        "Consider total cost including rework and inspection time",
        "Implement parameter sets for different quality grades",
        "Regular review and update of parameter databases"
      ],
      commonMistakes: [
        "Over-optimizing for quality when standard grade is sufficient",
        "Not accounting for material property variations",
        "Ignoring downstream processing requirements",
        "Using single parameter set for all part geometries",
        "Not considering operator skill level in parameter selection"
      ]
    },
    {
      title: "Advanced Optimization Techniques",
      description: "Advanced methods for parameter optimization and process control",
      tips: [
        "Use design of experiments (DOE) for systematic optimization",
        "Implement real-time parameter adjustment based on feedback",
        "Consider adaptive control systems for varying conditions",
        "Use machine learning for parameter prediction",
        "Implement closed-loop quality control systems"
      ],
      commonMistakes: [
        "Over-complicating simple parameter optimization problems",
        "Not validating advanced algorithms with practical results",
        "Ignoring the importance of consistent material properties",
        "Implementing complex systems without operator training",
        "Not maintaining parameter databases and documentation"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 9013",
      organization: "International Organization for Standardization",
      description: "Thermal cutting - Classification of thermal cuts - Geometrical product specification and quality tolerances",
      applicability: ["Cut Quality", "Tolerance Standards", "Quality Classification"]
    },
    {
      standard: "AWS C7.1M",
      organization: "American Welding Society",
      description: "Recommended Practices for Electron Beam Welding and Cutting",
      applicability: ["Cutting Standards", "Quality Requirements", "Process Parameters"]
    },
    {
      standard: "DIN EN ISO 9013",
      organization: "German Institute for Standardization",
      description: "Thermal cutting - Classification of thermal cuts",
      applicability: ["European Standards", "Cut Classification", "Quality Grades"]
    },
    {
      standard: "JIS B 0417",
      organization: "Japanese Industrial Standards",
      description: "Thermal cutting - Classification of thermal cuts",
      applicability: ["Japanese Standards", "Asian Markets", "Quality Classification"]
    }
  ];

  const relatedCalculators = [
    "Cutting Time Estimator",
    "Laser Cutting Cost Calculator",
    "Material Selection Assistant",
    "Quality Grade Predictor",
    "Energy Cost Calculator"
  ];

  const downloadableResources = [
    {
      name: "Parameter Optimization Worksheet",
      url: "/resources/parameter-optimization-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Material Parameter Database",
      url: "/resources/material-parameter-database.xlsx",
      type: "XLSX"
    },
    {
      name: "Quality Assessment Guide",
      url: "/resources/quality-assessment-guide.pdf",
      type: "PDF"
    },
    {
      name: "DOE Template for Parameter Optimization",
      url: "/resources/doe-parameter-template.xlsx",
      type: "XLSX"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Laser Parameter Optimizer"
      calculatorDescription="Master the science of laser parameter optimization for superior cutting performance. Learn to balance power, speed, frequency, and gas settings to achieve optimal results for any material and application. Understand the complex interactions between parameters and their impact on quality, speed, and cost."
      category="Basic Calculations"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/laser-parameter-optimizer"
      downloadableResources={downloadableResources}
    />
  );
};

export default LaserParameterOptimizerLearn;

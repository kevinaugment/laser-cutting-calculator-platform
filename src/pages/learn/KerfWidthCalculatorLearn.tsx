import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const KerfWidthCalculatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the concept of kerf width and its impact on cutting accuracy",
    "Learn to calculate and predict kerf width for different materials and parameters",
    "Master kerf compensation techniques for precision manufacturing",
    "Apply kerf optimization strategies to improve material utilization",
    "Develop skills in tolerance analysis and dimensional accuracy control"
  ];

  const keyFormulas = [
    {
      name: "Kerf Width Calculation",
      formula: "Kerf Width = Beam Diameter + (2 × Heat Affected Zone)",
      description: "Basic kerf width calculation based on beam characteristics",
      variables: [
        { symbol: "Beam Diameter", description: "Focused laser beam diameter", unit: "mm" },
        { symbol: "Heat Affected Zone", description: "Width of heat affected material", unit: "mm" }
      ]
    },
    {
      name: "Power-Dependent Kerf Width",
      formula: "Kerf Width = K × √(Power / (Speed × Thickness))",
      description: "Kerf width calculation considering cutting parameters",
      variables: [
        { symbol: "K", description: "Material-specific constant", unit: "dimensionless" },
        { symbol: "Power", description: "Laser power", unit: "W" },
        { symbol: "Speed", description: "Cutting speed", unit: "mm/min" },
        { symbol: "Thickness", description: "Material thickness", unit: "mm" }
      ]
    },
    {
      name: "Kerf Compensation",
      formula: "Compensated Dimension = Target Dimension + (Kerf Width / 2)",
      description: "Dimension adjustment for kerf compensation in cutting paths",
      variables: [
        { symbol: "Target Dimension", description: "Desired final dimension", unit: "mm" },
        { symbol: "Kerf Width", description: "Calculated kerf width", unit: "mm" }
      ]
    },
    {
      name: "Material Utilization with Kerf",
      formula: "Utilization = (Part Area / (Part Area + Kerf Area)) × 100",
      description: "Material utilization considering kerf losses",
      variables: [
        { symbol: "Part Area", description: "Useful part area", unit: "mm²" },
        { symbol: "Kerf Area", description: "Area lost to kerf", unit: "mm²" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Steel Sheet Kerf Analysis",
      scenario: "Calculating kerf width for 5mm mild steel using a 3kW fiber laser. Beam diameter is 0.1mm, cutting speed is 2500 mm/min, and the material constant K is 0.15.",
      inputs: [
        { parameter: "Material", value: "Mild Steel 5mm", unit: "thickness" },
        { parameter: "Laser Power", value: "3000", unit: "W" },
        { parameter: "Cutting Speed", value: "2500", unit: "mm/min" },
        { parameter: "Beam Diameter", value: "0.1", unit: "mm" },
        { parameter: "Material Constant K", value: "0.15", unit: "dimensionless" }
      ],
      calculation: "Kerf Width = K × √(Power / (Speed × Thickness))\nKerf Width = 0.15 × √(3000 / (2500 × 5))\nKerf Width = 0.15 × √(3000 / 12500)\nKerf Width = 0.15 × √0.24\nKerf Width = 0.15 × 0.49 = 0.074mm\n\nWith beam diameter consideration:\nTotal Kerf = 0.1mm + 0.074mm = 0.174mm",
      result: "Predicted kerf width: 0.174mm",
      insights: [
        "Kerf width is relatively small for this parameter combination",
        "Higher cutting speed helps reduce kerf width",
        "Beam diameter contributes significantly to total kerf",
        "Material constant varies with steel grade and condition"
      ]
    },
    {
      title: "Precision Part Kerf Compensation",
      scenario: "Manufacturing a precision bracket with 50.00mm ± 0.05mm hole diameter. Calculated kerf width is 0.15mm. Determine the cutting path diameter for accurate results.",
      inputs: [
        { parameter: "Target Hole Diameter", value: "50.00", unit: "mm" },
        { parameter: "Tolerance", value: "±0.05", unit: "mm" },
        { parameter: "Calculated Kerf Width", value: "0.15", unit: "mm" },
        { parameter: "Material", value: "Stainless Steel 3mm", unit: "thickness" }
      ],
      calculation: "For Internal Cut (Hole):\nCutting Path Diameter = Target Diameter + Kerf Width\nCutting Path Diameter = 50.00 + 0.15 = 50.15mm\n\nTolerance Analysis:\nWorst Case = 50.15 - 0.15 = 50.00mm (minimum)\nBest Case = 50.15 - 0.12 = 50.03mm (if kerf varies ±20%)\nActual Tolerance = +0.03/-0.00mm",
      result: "Cutting path diameter: 50.15mm, Expected result: 50.00-50.03mm",
      insights: [
        "Kerf compensation is critical for precision holes",
        "Internal cuts require adding kerf to cutting path",
        "Kerf variation affects final tolerance capability",
        "Consider kerf stability across the cutting process"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Kerf Measurement and Validation",
      description: "Establish accurate kerf measurement procedures for consistent results",
      tips: [
        "Measure kerf on test pieces with same parameters as production",
        "Use precision measuring tools (optical comparators, CMM)",
        "Account for kerf variation along the cut length",
        "Document kerf values for different material-parameter combinations",
        "Regular validation of kerf predictions vs. actual measurements"
      ],
      commonMistakes: [
        "Using theoretical kerf values without validation",
        "Not accounting for kerf variation with cutting depth",
        "Measuring kerf on different materials than production parts",
        "Ignoring the effect of gas pressure on kerf width",
        "Not considering kerf changes due to lens wear"
      ]
    },
    {
      title: "Kerf Compensation Strategies",
      description: "Implement effective kerf compensation in CAD/CAM systems",
      tips: [
        "Apply kerf compensation in CAM software, not CAD design",
        "Use different compensation values for internal vs external cuts",
        "Consider lead-in/lead-out effects on kerf compensation",
        "Validate compensation with test cuts before production",
        "Document compensation values for different scenarios"
      ],
      commonMistakes: [
        "Applying kerf compensation in the wrong direction",
        "Using the same compensation for all cut types",
        "Not accounting for corner rounding effects",
        "Forgetting to update compensation when parameters change",
        "Over-compensating for kerf in tight tolerance applications"
      ]
    },
    {
      title: "Material Utilization Optimization",
      description: "Optimize cutting layouts to minimize kerf-related material waste",
      tips: [
        "Use nesting software that accounts for kerf width",
        "Minimize total cutting length to reduce kerf losses",
        "Consider common cut lines to share kerf between parts",
        "Optimize part orientation to minimize kerf impact",
        "Plan for remnant material that accounts for kerf losses"
      ],
      commonMistakes: [
        "Not including kerf width in nesting calculations",
        "Ignoring the cumulative effect of kerf on material usage",
        "Poor part orientation leading to excessive cutting length",
        "Not considering kerf when calculating material requirements",
        "Underestimating the impact of kerf on small parts"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 9013",
      organization: "International Organization for Standardization",
      description: "Thermal cutting - Classification of thermal cuts including kerf quality requirements",
      applicability: ["Cut Quality", "Kerf Standards", "Dimensional Accuracy"]
    },
    {
      standard: "ASME Y14.5",
      organization: "American Society of Mechanical Engineers",
      description: "Geometric dimensioning and tolerancing standards affecting kerf compensation",
      applicability: ["Tolerance Analysis", "Dimensional Control", "Manufacturing Standards"]
    },
    {
      standard: "DIN 2310",
      organization: "German Institute for Standardization",
      description: "Thermal cutting processes - Terms and definitions including kerf characteristics",
      applicability: ["Process Definition", "Quality Standards", "European Markets"]
    }
  ];

  const relatedCalculators = [
    "Laser Parameter Optimizer",
    "Dimensional Accuracy Calculator",
    "Material Nesting Calculator",
    "Tolerance Stack Calculator",
    "Cut Path Optimizer"
  ];

  const downloadableResources = [
    {
      name: "Kerf Width Measurement Guide",
      url: "/resources/kerf-measurement-guide.pdf",
      type: "PDF"
    },
    {
      name: "Kerf Compensation Worksheet",
      url: "/resources/kerf-compensation-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Material Kerf Database",
      url: "/resources/material-kerf-database.xlsx",
      type: "XLSX"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Kerf Width Calculator"
      calculatorDescription="Master kerf width calculation and compensation for precision laser cutting. Learn to predict, measure, and compensate for kerf width to achieve accurate dimensions and optimize material utilization. Essential knowledge for quality control and cost-effective manufacturing."
      category="Basic Calculations"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/kerf-width-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default KerfWidthCalculatorLearn;

import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const PowerRequirementCalculatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the relationship between laser power and cutting capability",
    "Learn to calculate minimum power requirements for different materials and thicknesses",
    "Master power optimization techniques for efficiency and quality",
    "Apply power scaling principles for production planning",
    "Develop skills in laser system specification and selection"
  ];

  const keyFormulas = [
    {
      name: "Minimum Power Requirement",
      formula: "P_min = (Material Factor × Thickness² × Speed) / Efficiency",
      description: "Calculates minimum laser power needed for cutting",
      variables: [
        { symbol: "Material Factor", description: "Material-specific cutting difficulty factor", unit: "W·min/mm³" },
        { symbol: "Thickness", description: "Material thickness", unit: "mm" },
        { symbol: "Speed", description: "Desired cutting speed", unit: "mm/min" },
        { symbol: "Efficiency", description: "Overall system efficiency", unit: "0.2-0.4" }
      ]
    },
    {
      name: "Power Density",
      formula: "Power Density = Laser Power / (π × (Beam Diameter/2)²)",
      description: "Calculates power concentration at the cutting point",
      variables: [
        { symbol: "Laser Power", description: "Available laser power", unit: "W" },
        { symbol: "Beam Diameter", description: "Focused beam diameter", unit: "mm" }
      ]
    },
    {
      name: "Cutting Speed vs Power",
      formula: "Speed = (Power × Efficiency) / (Material Factor × Thickness²)",
      description: "Calculates achievable cutting speed for given power",
      variables: [
        { symbol: "Power", description: "Available laser power", unit: "W" },
        { symbol: "Efficiency", description: "System efficiency factor", unit: "0.2-0.4" },
        { symbol: "Material Factor", description: "Material cutting difficulty", unit: "W·min/mm³" },
        { symbol: "Thickness", description: "Material thickness", unit: "mm" }
      ]
    },
    {
      name: "Power Utilization",
      formula: "Utilization = (Required Power / Available Power) × 100",
      description: "Calculates percentage of available power being used",
      variables: [
        { symbol: "Required Power", description: "Power needed for cutting operation", unit: "W" },
        { symbol: "Available Power", description: "Maximum laser power available", unit: "W" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Steel Cutting Power Analysis",
      scenario: "Determining minimum power requirement for cutting 10mm mild steel at 1500 mm/min. Material factor for steel is 0.8 W·min/mm³, system efficiency is 30%.",
      inputs: [
        { parameter: "Material", value: "Mild Steel", unit: "type" },
        { parameter: "Thickness", value: "10", unit: "mm" },
        { parameter: "Desired Speed", value: "1500", unit: "mm/min" },
        { parameter: "Material Factor", value: "0.8", unit: "W·min/mm³" },
        { parameter: "System Efficiency", value: "30", unit: "%" }
      ],
      calculation: "P_min = (Material Factor × Thickness² × Speed) / Efficiency\nP_min = (0.8 × 10² × 1500) / 0.30\nP_min = (0.8 × 100 × 1500) / 0.30\nP_min = 120,000 / 0.30\nP_min = 4,000W\n\nPower Utilization Check:\nFor 6kW laser: Utilization = (4000/6000) × 100 = 67%",
      result: "Minimum power required: 4,000W, Utilization with 6kW laser: 67%",
      insights: [
        "4kW minimum power provides good safety margin with 6kW laser",
        "67% utilization allows for parameter optimization",
        "Thickness has quadratic effect on power requirement",
        "System efficiency significantly impacts power needs"
      ]
    },
    {
      title: "Aluminum vs Steel Power Comparison",
      scenario: "Comparing power requirements for cutting 5mm aluminum vs 5mm steel at the same speed (3000 mm/min). Aluminum factor: 0.4, Steel factor: 0.8.",
      inputs: [
        { parameter: "Thickness", value: "5", unit: "mm" },
        { parameter: "Cutting Speed", value: "3000", unit: "mm/min" },
        { parameter: "Aluminum Factor", value: "0.4", unit: "W·min/mm³" },
        { parameter: "Steel Factor", value: "0.8", unit: "W·min/mm³" },
        { parameter: "System Efficiency", value: "30", unit: "%" }
      ],
      calculation: "Aluminum Power:\nP_min = (0.4 × 5² × 3000) / 0.30 = 1,000W\n\nSteel Power:\nP_min = (0.8 × 5² × 3000) / 0.30 = 2,000W\n\nPower Ratio = Steel/Aluminum = 2000/1000 = 2:1",
      result: "Aluminum: 1,000W, Steel: 2,000W, Ratio: 2:1",
      insights: [
        "Steel requires twice the power of aluminum for same thickness",
        "Material properties significantly affect power requirements",
        "Aluminum's better thermal conductivity requires less power",
        "Power savings with aluminum can improve productivity"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Power Requirement Assessment",
      description: "Systematic approach to determining optimal laser power for applications",
      tips: [
        "Calculate power requirements for worst-case scenarios",
        "Include safety margin of 20-30% above minimum requirements",
        "Consider future production needs and material expansion",
        "Account for lens degradation and power loss over time",
        "Validate calculations with test cuts on actual materials"
      ],
      commonMistakes: [
        "Using theoretical efficiency values without real-world validation",
        "Not accounting for beam quality degradation with power",
        "Ignoring the effect of assist gas on power requirements",
        "Underestimating power needs for thick material cutting",
        "Not considering power stability requirements for quality"
      ]
    },
    {
      title: "Power Optimization Strategies",
      description: "Techniques to maximize power utilization and cutting efficiency",
      tips: [
        "Use pulsed mode for thin materials to reduce average power",
        "Optimize beam focus position for maximum power density",
        "Adjust cutting parameters to maintain optimal power utilization",
        "Consider multi-pass cutting for very thick materials",
        "Monitor power output regularly for consistent performance"
      ],
      commonMistakes: [
        "Running at maximum power without considering quality impact",
        "Not optimizing focus position for different thicknesses",
        "Using continuous wave when pulsed would be more efficient",
        "Ignoring the relationship between power and gas consumption",
        "Not adjusting power for different material conditions"
      ]
    },
    {
      title: "System Selection and Specification",
      description: "Guidelines for selecting appropriate laser power for specific applications",
      tips: [
        "Analyze complete material mix and thickness range",
        "Consider production volume and speed requirements",
        "Evaluate total cost of ownership, not just initial cost",
        "Plan for future expansion and capability growth",
        "Consider backup and redundancy requirements"
      ],
      commonMistakes: [
        "Selecting minimum power without growth consideration",
        "Focusing only on maximum thickness capability",
        "Not considering operating cost differences between power levels",
        "Ignoring maintenance and service requirements",
        "Underestimating the value of power headroom for optimization"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "IEC 60825-1",
      organization: "International Electrotechnical Commission",
      description: "Safety of laser products including power classification and requirements",
      applicability: ["Laser Safety", "Power Classification", "Regulatory Compliance"]
    },
    {
      standard: "ISO 11145",
      organization: "International Organization for Standardization",
      description: "Optics and photonics - Lasers and laser-related equipment - Vocabulary and symbols",
      applicability: ["Laser Terminology", "Power Specifications", "Technical Documentation"]
    },
    {
      standard: "ANSI Z136.1",
      organization: "American National Standards Institute",
      description: "Safe use of lasers including power-related safety requirements",
      applicability: ["Workplace Safety", "Power Handling", "US Regulations"]
    }
  ];

  const relatedCalculators = [
    "Laser Parameter Optimizer",
    "Energy Cost Calculator",
    "Cutting Speed Calculator",
    "Equipment Comparison Tool",
    "System Specification Calculator"
  ];

  const downloadableResources = [
    {
      name: "Power Requirement Worksheet",
      url: "/resources/power-requirement-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Material Power Factor Database",
      url: "/resources/material-power-factors.xlsx",
      type: "XLSX"
    },
    {
      name: "Laser System Selection Guide",
      url: "/resources/laser-system-selection.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Power Requirement Calculator"
      calculatorDescription="Master laser power requirement calculation for optimal system selection and operation. Learn to determine minimum power needs, optimize power utilization, and select appropriate laser systems for your cutting applications. Essential for equipment specification and process optimization."
      category="Basic Calculations"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/power-requirement-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default PowerRequirementCalculatorLearn;

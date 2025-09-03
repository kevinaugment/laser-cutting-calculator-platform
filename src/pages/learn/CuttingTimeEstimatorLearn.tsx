import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const CuttingTimeEstimatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the components of laser cutting time estimation",
    "Learn to calculate cutting, piercing, setup, and changeover times accurately",
    "Master time optimization techniques for improved productivity",
    "Apply complexity factors and efficiency analysis to real-world scenarios",
    "Develop skills in production planning and capacity estimation"
  ];

  const keyFormulas = [
    {
      name: "Total Production Time",
      formula: "Total Time = Cutting Time + Piercing Time + Setup Time + Changeover Time",
      description: "Comprehensive time calculation including all production components",
      variables: [
        { symbol: "Cutting Time", description: "Time spent actually cutting material", unit: "minutes" },
        { symbol: "Piercing Time", description: "Time for piercing holes and starting cuts", unit: "minutes" },
        { symbol: "Setup Time", description: "Job setup and preparation time", unit: "minutes" },
        { symbol: "Changeover Time", description: "Time to change between different jobs", unit: "minutes" }
      ]
    },
    {
      name: "Cutting Time",
      formula: "Cutting Time = (Total Cutting Length / Cutting Speed) × Complexity Factor",
      description: "Calculates pure cutting time with complexity adjustment",
      variables: [
        { symbol: "Total Cutting Length", description: "Total length of all cuts", unit: "mm" },
        { symbol: "Cutting Speed", description: "Actual cutting speed", unit: "mm/min" },
        { symbol: "Complexity Factor", description: "Adjustment for part complexity", unit: "1.0-1.5" }
      ]
    },
    {
      name: "Piercing Time",
      formula: "Piercing Time = Number of Piercing Points × Piercing Time per Point",
      description: "Calculates total time for all piercing operations",
      variables: [
        { symbol: "Number of Piercing Points", description: "Total piercing points required", unit: "points" },
        { symbol: "Piercing Time per Point", description: "Time to pierce one hole", unit: "seconds" }
      ]
    },
    {
      name: "Production Rate",
      formula: "Production Rate = 60 / (Total Time / Quantity)",
      description: "Calculates pieces produced per hour",
      variables: [
        { symbol: "Total Time", description: "Total time for the job", unit: "minutes" },
        { symbol: "Quantity", description: "Number of pieces produced", unit: "pieces" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Steel Bracket Time Estimation",
      scenario: "Estimating production time for 100 steel brackets (3mm thick) with complex geometry. Each bracket has 4 piercing points and 250mm cutting length. Setup time is 15 minutes.",
      inputs: [
        { parameter: "Quantity", value: "100", unit: "pieces" },
        { parameter: "Material", value: "Steel 3mm", unit: "thickness" },
        { parameter: "Cutting length per piece", value: "250", unit: "mm" },
        { parameter: "Piercing points per piece", value: "4", unit: "points" },
        { parameter: "Cutting speed", value: "4000", unit: "mm/min" },
        { parameter: "Setup time", value: "15", unit: "minutes" }
      ],
      calculation: "Total Cutting Length = 250mm × 100 = 25,000mm\nCutting Time = 25,000 ÷ 4000 = 6.25 minutes\nPiercing Time = 4 × 100 × 1.2 seconds = 480 seconds = 8 minutes\nComplexity Factor = 1.2 (medium complexity)\nAdjusted Cutting Time = 6.25 × 1.2 = 7.5 minutes\nTotal Time = 7.5 + 8 + 15 = 30.5 minutes\nProduction Rate = 60 ÷ (30.5 ÷ 100) = 197 pieces/hour",
      result: "Total time: 30.5 minutes, Production rate: 197 pieces/hour",
      insights: [
        "Piercing time represents 26% of total production time",
        "Setup time impact decreases with larger batch sizes",
        "Complexity factor adds 20% to basic cutting time",
        "High production rate suitable for volume manufacturing"
      ]
    },
    {
      title: "Aluminum Sheet Time Optimization",
      scenario: "Comparing single-pass vs. multi-pass cutting for 6mm aluminum sheets to optimize production time while maintaining quality.",
      inputs: [
        { parameter: "Material", value: "Aluminum 6mm", unit: "thickness" },
        { parameter: "Cutting length", value: "500", unit: "mm per piece" },
        { parameter: "Quantity", value: "50", unit: "pieces" },
        { parameter: "Single-pass speed", value: "1800", unit: "mm/min" },
        { parameter: "Multi-pass speed", value: "3000", unit: "mm/min" },
        { parameter: "Number of passes", value: "2", unit: "passes" }
      ],
      calculation: "Single-Pass Option:\nCutting Time = (500 × 50) ÷ 1800 = 13.9 minutes\nQuality: High, Edge finish: Excellent\n\nMulti-Pass Option:\nCutting Time = (500 × 50 × 2) ÷ 3000 = 16.7 minutes\nAdditional positioning time = 2 minutes\nTotal Time = 18.7 minutes\nQuality: Very High, Edge finish: Superior",
      result: "Single-pass: 13.9 min, Multi-pass: 18.7 min - Single-pass is 35% faster",
      insights: [
        "Single-pass cutting is significantly faster for this thickness",
        "Multi-pass provides superior edge quality but at time cost",
        "Consider customer quality requirements vs. production efficiency",
        "Positioning time between passes adds overhead"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Accurate Time Estimation",
      description: "Develop systematic approaches for precise time estimation",
      tips: [
        "Use historical data to validate time estimates",
        "Account for all non-cutting time including positioning and inspection",
        "Consider operator skill level and experience in estimates",
        "Include time for quality checks and potential rework",
        "Factor in machine warm-up and calibration time"
      ],
      commonMistakes: [
        "Using theoretical cutting speeds without real-world adjustments",
        "Ignoring piercing time for parts with many holes",
        "Not accounting for part complexity and tight tolerances",
        "Underestimating setup time for complex fixtures",
        "Failing to include material handling and loading time"
      ]
    },
    {
      title: "Time Optimization Strategies",
      description: "Systematic approaches to reduce production time",
      tips: [
        "Optimize cutting sequences to minimize rapid traverse time",
        "Use common cut lines to reduce total cutting length",
        "Implement efficient nesting to maximize sheet utilization",
        "Reduce piercing points through design optimization",
        "Standardize setups to minimize changeover time"
      ],
      commonMistakes: [
        "Optimizing cutting speed without considering quality impact",
        "Not utilizing machine's rapid traverse capabilities effectively",
        "Poor nesting leading to excessive material handling",
        "Ignoring the impact of part orientation on cutting efficiency",
        "Not considering tool path optimization software"
      ]
    },
    {
      title: "Production Planning",
      description: "Use time estimates for effective production planning and scheduling",
      tips: [
        "Create realistic production schedules based on accurate time data",
        "Build in buffer time for unexpected delays and quality issues",
        "Group similar jobs to minimize setup and changeover time",
        "Consider machine capacity and operator availability",
        "Use time data for accurate delivery date commitments"
      ],
      commonMistakes: [
        "Creating overly optimistic schedules without buffer time",
        "Not considering machine maintenance and downtime",
        "Ignoring the learning curve for new operators or processes",
        "Failing to update time standards based on actual performance",
        "Not communicating realistic timelines to customers"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 22400-2",
      organization: "International Organization for Standardization",
      description: "Manufacturing operations management - Key performance indicators for time measurement",
      applicability: ["Time Measurement", "Performance Indicators", "Manufacturing Operations"]
    },
    {
      standard: "ANSI/ISA-95",
      organization: "International Society of Automation",
      description: "Enterprise-control system integration standards for production time tracking",
      applicability: ["Production Control", "Time Tracking", "Manufacturing Systems"]
    },
    {
      standard: "SEMI E10",
      organization: "Semiconductor Equipment and Materials International",
      description: "Equipment reliability, availability, and maintainability standards affecting time calculations",
      applicability: ["Equipment Performance", "Time Standards", "Reliability"]
    },
    {
      standard: "MTM (Methods-Time Measurement)",
      organization: "MTM Association",
      description: "Predetermined motion time systems for accurate time estimation",
      applicability: ["Time Standards", "Work Measurement", "Productivity Analysis"]
    }
  ];

  const relatedCalculators = [
    "Laser Cutting Cost Calculator",
    "Production Capacity Planner",
    "Batch Processing Optimizer",
    "Laser Parameter Optimizer",
    "Setup Time Calculator"
  ];

  const downloadableResources = [
    {
      name: "Time Estimation Worksheet",
      url: "/resources/time-estimation-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Cutting Speed Reference Chart",
      url: "/resources/cutting-speed-chart.pdf",
      type: "PDF"
    },
    {
      name: "Piercing Time Database",
      url: "/resources/piercing-time-database.xlsx",
      type: "XLSX"
    },
    {
      name: "Production Planning Template",
      url: "/resources/production-planning-template.xlsx",
      type: "XLSX"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Cutting Time Estimator"
      calculatorDescription="Master the science of laser cutting time estimation for accurate production planning and scheduling. Learn to calculate cutting, piercing, setup, and changeover times with precision. Understand complexity factors, efficiency optimization, and production rate calculations for improved manufacturing productivity."
      category="Basic Calculations"
      difficulty="Basic"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/cutting-time-estimator"
      downloadableResources={downloadableResources}
    />
  );
};

export default CuttingTimeEstimatorLearn;

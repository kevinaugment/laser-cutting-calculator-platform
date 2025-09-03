import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const EquipmentComparisonToolLearn: React.FC = () => {
  const learningObjectives = [
    "Understand equipment evaluation criteria and comparison methodologies",
    "Learn to analyze total cost of ownership for laser cutting equipment",
    "Master performance benchmarking and capability assessment",
    "Apply multi-criteria decision analysis for equipment selection",
    "Develop skills in vendor evaluation and procurement strategy"
  ];

  const keyFormulas = [
    {
      name: "Total Cost of Ownership",
      formula: "TCO = Purchase Price + Operating Costs + Maintenance Costs + Downtime Costs - Residual Value",
      description: "Complete cost analysis over equipment lifecycle",
      variables: [
        { symbol: "Purchase Price", description: "Initial equipment acquisition cost", unit: "$" },
        { symbol: "Operating Costs", description: "Annual operating expenses", unit: "$/year" },
        { symbol: "Maintenance Costs", description: "Annual maintenance expenses", unit: "$/year" },
        { symbol: "Downtime Costs", description: "Annual cost of equipment downtime", unit: "$/year" },
        { symbol: "Residual Value", description: "Equipment value at end of life", unit: "$" }
      ]
    },
    {
      name: "Productivity Index",
      formula: "PI = (Cutting Speed × Uptime %) / (Setup Time + Maintenance Time)",
      description: "Measures equipment productivity considering all factors",
      variables: [
        { symbol: "Cutting Speed", description: "Average cutting speed", unit: "mm/min" },
        { symbol: "Uptime %", description: "Equipment availability percentage", unit: "%" },
        { symbol: "Setup Time", description: "Average setup time per job", unit: "minutes" },
        { symbol: "Maintenance Time", description: "Maintenance time per period", unit: "minutes" }
      ]
    },
    {
      name: "Performance Score",
      formula: "Score = Σ(Criterion Weight × Criterion Rating)",
      description: "Weighted performance score for multi-criteria comparison",
      variables: [
        { symbol: "Criterion Weight", description: "Importance weight for each criterion", unit: "0-1" },
        { symbol: "Criterion Rating", description: "Performance rating for criterion", unit: "1-10" }
      ]
    },
    {
      name: "Payback Period",
      formula: "Payback = Additional Investment / (Annual Savings + Productivity Gain)",
      description: "Time to recover additional investment in higher-end equipment",
      variables: [
        { symbol: "Additional Investment", description: "Extra cost vs baseline option", unit: "$" },
        { symbol: "Annual Savings", description: "Operating cost savings per year", unit: "$/year" },
        { symbol: "Productivity Gain", description: "Additional revenue from productivity", unit: "$/year" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Fiber vs CO2 Laser Comparison",
      scenario: "Comparing 4kW fiber laser ($350k) vs 4kW CO2 laser ($280k) for mixed material cutting. Analyzing 5-year TCO and performance differences.",
      inputs: [
        { parameter: "Fiber Laser Price", value: "$350,000", unit: "initial cost" },
        { parameter: "CO2 Laser Price", value: "$280,000", unit: "initial cost" },
        { parameter: "Fiber Operating Cost", value: "$45,000", unit: "per year" },
        { parameter: "CO2 Operating Cost", value: "$65,000", unit: "per year" },
        { parameter: "Fiber Maintenance", value: "$12,000", unit: "per year" },
        { parameter: "CO2 Maintenance", value: "$18,000", unit: "per year" },
        { parameter: "Fiber Uptime", value: "95", unit: "%" },
        { parameter: "CO2 Uptime", value: "88", unit: "%" }
      ],
      calculation: "5-Year Total Cost of Ownership:\n\nFiber Laser TCO:\nPurchase: $350,000\nOperating (5 years): $45,000 × 5 = $225,000\nMaintenance (5 years): $12,000 × 5 = $60,000\nTotal TCO: $635,000\n\nCO2 Laser TCO:\nPurchase: $280,000\nOperating (5 years): $65,000 × 5 = $325,000\nMaintenance (5 years): $18,000 × 5 = $90,000\nTotal TCO: $695,000\n\nTCO Advantage: $695,000 - $635,000 = $60,000 (fiber)\nAnnual Savings: $60,000 / 5 = $12,000/year",
      result: "Fiber laser saves $60,000 over 5 years despite higher initial cost",
      insights: [
        "Higher initial cost offset by lower operating expenses",
        "Fiber laser provides $12,000 annual savings",
        "Better uptime (95% vs 88%) improves productivity",
        "Lower maintenance costs contribute to TCO advantage"
      ]
    },
    {
      title: "Multi-Criteria Equipment Selection",
      scenario: "Evaluating three laser systems using weighted criteria: cost (30%), performance (25%), reliability (20%), service (15%), technology (10%).",
      inputs: [
        { parameter: "System A Score", value: "Cost:8, Perf:7, Rel:9, Svc:8, Tech:6", unit: "ratings" },
        { parameter: "System B Score", value: "Cost:6, Perf:9, Rel:7, Svc:9, Tech:9", unit: "ratings" },
        { parameter: "System C Score", value: "Cost:7, Perf:8, Rel:8, Svc:7, Tech:8", unit: "ratings" },
        { parameter: "Weights", value: "30%, 25%, 20%, 15%, 10%", unit: "importance" }
      ],
      calculation: "Weighted Performance Scores:\n\nSystem A:\n(8×0.30) + (7×0.25) + (9×0.20) + (8×0.15) + (6×0.10)\n= 2.40 + 1.75 + 1.80 + 1.20 + 0.60 = 7.75\n\nSystem B:\n(6×0.30) + (9×0.25) + (7×0.20) + (9×0.15) + (9×0.10)\n= 1.80 + 2.25 + 1.40 + 1.35 + 0.90 = 7.70\n\nSystem C:\n(7×0.30) + (8×0.25) + (8×0.20) + (7×0.15) + (8×0.10)\n= 2.10 + 2.00 + 1.60 + 1.05 + 0.80 = 7.55",
      result: "System A wins with score 7.75, followed by B (7.70) and C (7.55)",
      insights: [
        "Close competition between top two systems",
        "System A's cost advantage and reliability drive selection",
        "System B strong in performance and technology but weaker on cost",
        "Weighting criteria critical to final decision"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Comprehensive Equipment Evaluation",
      description: "Systematic approaches to evaluating and comparing laser cutting equipment",
      tips: [
        "Define clear evaluation criteria before starting comparison",
        "Include all stakeholders in criteria definition and weighting",
        "Evaluate total cost of ownership, not just purchase price",
        "Consider future needs and technology evolution",
        "Validate vendor claims through references and demonstrations"
      ],
      commonMistakes: [
        "Focusing only on initial purchase price",
        "Not considering long-term operating and maintenance costs",
        "Ignoring the importance of vendor support and service",
        "Not evaluating equipment in actual production conditions",
        "Making decisions based on specifications alone without practical testing"
      ]
    },
    {
      title: "Total Cost of Ownership Analysis",
      description: "Methods for calculating and comparing lifecycle costs",
      tips: [
        "Include all cost components: purchase, installation, training, operation",
        "Consider financing costs and tax implications",
        "Account for productivity differences between options",
        "Include costs of downtime and lost production",
        "Estimate residual value at end of equipment life"
      ],
      commonMistakes: [
        "Not including hidden costs like training and installation",
        "Underestimating ongoing operating costs",
        "Not considering the cost of equipment downtime",
        "Ignoring productivity differences between options",
        "Not accounting for inflation in multi-year comparisons"
      ]
    },
    {
      title: "Vendor Evaluation and Selection",
      description: "Best practices for evaluating equipment vendors and suppliers",
      tips: [
        "Assess vendor financial stability and longevity",
        "Evaluate technical support capabilities and response times",
        "Check references from similar applications and industries",
        "Understand warranty terms and service level agreements",
        "Consider vendor's commitment to technology development"
      ],
      commonMistakes: [
        "Not thoroughly checking vendor references",
        "Ignoring the importance of local service and support",
        "Not understanding warranty limitations and exclusions",
        "Choosing vendors based solely on price",
        "Not considering vendor's long-term viability and support"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 9001:2015",
      organization: "International Organization for Standardization",
      description: "Quality management systems requirements for equipment suppliers",
      applicability: ["Vendor Quality", "Equipment Standards", "Process Control"]
    },
    {
      standard: "IEC 60204-1",
      organization: "International Electrotechnical Commission",
      description: "Safety of machinery - Electrical equipment of machines",
      applicability: ["Equipment Safety", "Electrical Standards", "Compliance"]
    },
    {
      standard: "ANSI B11.21",
      organization: "American National Standards Institute",
      description: "Safety requirements for laser machining equipment",
      applicability: ["Laser Safety", "Equipment Standards", "Workplace Safety"]
    }
  ];

  const relatedCalculators = [
    "ROI & Profit Calculator",
    "Equipment ROI Calculator",
    "Maintenance Cost Estimator",
    "Power Requirement Calculator",
    "Financing Cost Calculator"
  ];

  const downloadableResources = [
    {
      name: "Equipment Comparison Matrix",
      url: "/resources/equipment-comparison-matrix.xlsx",
      type: "XLSX"
    },
    {
      name: "TCO Analysis Template",
      url: "/resources/tco-analysis-template.xlsx",
      type: "XLSX"
    },
    {
      name: "Vendor Evaluation Checklist",
      url: "/resources/vendor-evaluation-checklist.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Equipment Comparison Tool"
      calculatorDescription="Master equipment evaluation and comparison for laser cutting systems. Learn to analyze total cost of ownership, compare performance metrics, and make data-driven equipment selection decisions using multi-criteria analysis."
      category="Equipment Selection"
      difficulty="Advanced"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/equipment-comparison-tool"
      downloadableResources={downloadableResources}
    />
  );
};

export default EquipmentComparisonToolLearn;

import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const GasConsumptionCalculatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand assist gas consumption patterns and cost factors",
    "Learn to calculate and optimize gas usage for different cutting operations",
    "Master gas selection criteria for various materials and applications",
    "Apply gas efficiency optimization techniques to reduce operating costs",
    "Develop skills in gas supply planning and cost management"
  ];

  const keyFormulas = [
    {
      name: "Total Gas Consumption",
      formula: "Total Gas = Cutting Gas + Piercing Gas + Setup Gas + Idle Gas",
      description: "Comprehensive gas consumption including all operational phases",
      variables: [
        { symbol: "Cutting Gas", description: "Gas used during active cutting", unit: "m³" },
        { symbol: "Piercing Gas", description: "Gas used for piercing operations", unit: "m³" },
        { symbol: "Setup Gas", description: "Gas used during job setup", unit: "m³" },
        { symbol: "Idle Gas", description: "Gas used during idle/standby time", unit: "m³" }
      ]
    },
    {
      name: "Cutting Gas Consumption",
      formula: "Cutting Gas = (Flow Rate × Cutting Time × Efficiency) / 1000",
      description: "Gas consumption during active cutting operations",
      variables: [
        { symbol: "Flow Rate", description: "Gas flow rate", unit: "l/min" },
        { symbol: "Cutting Time", description: "Total cutting time", unit: "minutes" },
        { symbol: "Efficiency", description: "Gas utilization efficiency", unit: "0.8-0.95" }
      ]
    },
    {
      name: "Piercing Gas Consumption",
      formula: "Piercing Gas = Piercing Points × Piercing Time × Enhanced Flow Rate / 1000",
      description: "Gas consumption for piercing operations with higher flow rates",
      variables: [
        { symbol: "Piercing Points", description: "Number of piercing points", unit: "points" },
        { symbol: "Piercing Time", description: "Time per piercing point", unit: "seconds" },
        { symbol: "Enhanced Flow Rate", description: "Increased flow for piercing", unit: "l/min" }
      ]
    },
    {
      name: "Gas Cost per Part",
      formula: "Cost per Part = (Total Gas Consumption × Gas Price) / Quantity",
      description: "Gas cost allocation per manufactured part",
      variables: [
        { symbol: "Total Gas Consumption", description: "Total gas used for job", unit: "m³" },
        { symbol: "Gas Price", description: "Cost per cubic meter of gas", unit: "$/m³" },
        { symbol: "Quantity", description: "Number of parts produced", unit: "pieces" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Nitrogen vs Oxygen Cost Comparison",
      scenario: "Comparing gas costs for cutting 100 pieces of 8mm steel brackets. Oxygen cutting: 25 l/min for 45 minutes. Nitrogen cutting: 35 l/min for 52 minutes (slower but better quality).",
      inputs: [
        { parameter: "Quantity", value: "100", unit: "pieces" },
        { parameter: "Material", value: "Steel 8mm", unit: "thickness" },
        { parameter: "Oxygen Flow", value: "25", unit: "l/min" },
        { parameter: "Oxygen Time", value: "45", unit: "minutes" },
        { parameter: "Nitrogen Flow", value: "35", unit: "l/min" },
        { parameter: "Nitrogen Time", value: "52", unit: "minutes" },
        { parameter: "Oxygen Price", value: "$0.80", unit: "per m³" },
        { parameter: "Nitrogen Price", value: "$1.20", unit: "per m³" }
      ],
      calculation: "Oxygen Option:\nGas Consumption = (25 × 45) / 1000 = 1.125 m³\nGas Cost = 1.125 × $0.80 = $0.90\nCost per Part = $0.90 / 100 = $0.009\n\nNitrogen Option:\nGas Consumption = (35 × 52) / 1000 = 1.82 m³\nGas Cost = 1.82 × $1.20 = $2.18\nCost per Part = $2.18 / 100 = $0.022\n\nCost Difference = $0.022 - $0.009 = $0.013 per part",
      result: "Oxygen: $0.009/part, Nitrogen: $0.022/part, Difference: $0.013/part",
      insights: [
        "Nitrogen costs 2.4x more per part than oxygen",
        "Higher nitrogen flow rate and longer cutting time increase costs",
        "Quality benefits of nitrogen may justify higher cost",
        "Volume production makes cost difference significant"
      ]
    },
    {
      title: "Gas Efficiency Optimization",
      scenario: "Optimizing gas consumption for aluminum cutting operation. Current efficiency is 82%, targeting 90% through flow optimization and leak reduction.",
      inputs: [
        { parameter: "Material", value: "Aluminum 4mm", unit: "thickness" },
        { parameter: "Current Flow Rate", value: "30", unit: "l/min" },
        { parameter: "Cutting Time", value: "120", unit: "minutes/day" },
        { parameter: "Current Efficiency", value: "82", unit: "%" },
        { parameter: "Target Efficiency", value: "90", unit: "%" },
        { parameter: "Gas Price", value: "$1.20", unit: "per m³" },
        { parameter: "Working Days", value: "250", unit: "days/year" }
      ],
      calculation: "Current Daily Consumption:\nDaily Gas = (30 × 120 × 0.82) / 1000 = 2.95 m³\nDaily Cost = 2.95 × $1.20 = $3.54\n\nOptimized Consumption:\nOptimized Gas = (30 × 120 × 0.90) / 1000 = 3.24 m³\nBut with 15% flow reduction: 3.24 × 0.85 = 2.75 m³\nOptimized Cost = 2.75 × $1.20 = $3.30\n\nAnnual Savings = ($3.54 - $3.30) × 250 = $60",
      result: "Daily savings: $0.24, Annual savings: $60, Efficiency improvement: 8%",
      insights: [
        "Small efficiency improvements create measurable savings",
        "Flow rate optimization can offset higher efficiency",
        "Annual savings justify investment in efficiency improvements",
        "Regular efficiency monitoring is cost-effective"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Gas Selection and Optimization",
      description: "Guidelines for selecting appropriate assist gases and optimizing consumption",
      tips: [
        "Match gas type to material and quality requirements",
        "Optimize flow rates for each material thickness combination",
        "Use gas purity appropriate for the application",
        "Consider total cost including quality and productivity impacts",
        "Implement gas flow monitoring and control systems"
      ],
      commonMistakes: [
        "Using excessive gas flow rates without quality benefit",
        "Not considering gas purity requirements for specific materials",
        "Ignoring the impact of gas pressure on consumption",
        "Using single gas settings for all material thicknesses",
        "Not accounting for gas waste during setup and idle time"
      ]
    },
    {
      title: "Cost Management and Efficiency",
      description: "Strategies for managing gas costs and improving utilization efficiency",
      tips: [
        "Monitor gas consumption patterns and identify waste sources",
        "Implement leak detection and prevention programs",
        "Negotiate volume discounts with gas suppliers",
        "Consider on-site gas generation for high-volume operations",
        "Track gas costs per part for accurate job costing"
      ],
      commonMistakes: [
        "Not tracking gas consumption at the job level",
        "Ignoring small leaks that accumulate significant waste",
        "Not considering total cost of ownership for gas supply options",
        "Failing to train operators on gas conservation practices",
        "Not updating gas costs in pricing calculations regularly"
      ]
    },
    {
      title: "Supply Chain and Planning",
      description: "Best practices for gas supply planning and inventory management",
      tips: [
        "Maintain adequate gas inventory for production continuity",
        "Plan for seasonal demand variations and supply disruptions",
        "Consider backup gas supply options for critical operations",
        "Implement just-in-time delivery for cost optimization",
        "Monitor gas quality and purity for consistent results"
      ],
      commonMistakes: [
        "Inadequate gas inventory leading to production delays",
        "Not having backup suppliers for critical gas types",
        "Ignoring gas quality variations between suppliers",
        "Not considering storage and handling costs in total cost",
        "Failing to plan for emergency gas supply situations"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 14175",
      organization: "International Organization for Standardization",
      description: "Welding consumables - Gases and gas mixtures for fusion welding and allied processes",
      applicability: ["Gas Specifications", "Quality Standards", "Safety Requirements"]
    },
    {
      standard: "CGA G-7.1",
      organization: "Compressed Gas Association",
      description: "Commodity specification for air used in cutting and welding applications",
      applicability: ["Air Quality", "Safety Standards", "Equipment Requirements"]
    },
    {
      standard: "NFPA 51",
      organization: "National Fire Protection Association",
      description: "Standard for the design and installation of oxygen-fuel gas systems",
      applicability: ["Safety Requirements", "System Design", "Fire Prevention"]
    }
  ];

  const relatedCalculators = [
    "Laser Cutting Cost Calculator",
    "Operating Cost Calculator",
    "Energy Cost Calculator",
    "Process Optimization Calculator",
    "Supplier Cost Analyzer"
  ];

  const downloadableResources = [
    {
      name: "Gas Consumption Tracking Sheet",
      url: "/resources/gas-consumption-tracking.xlsx",
      type: "XLSX"
    },
    {
      name: "Gas Selection Guide",
      url: "/resources/gas-selection-guide.pdf",
      type: "PDF"
    },
    {
      name: "Gas Cost Analysis Template",
      url: "/resources/gas-cost-analysis.xlsx",
      type: "XLSX"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Gas Consumption Calculator"
      calculatorDescription="Master assist gas consumption calculation and optimization for laser cutting operations. Learn to select appropriate gases, calculate consumption patterns, and optimize gas usage for cost-effective manufacturing while maintaining quality standards."
      category="Cost Analysis"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/gas-consumption-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default GasConsumptionCalculatorLearn;

import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const LaserCuttingCostLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the complete cost structure of laser cutting operations",
    "Learn to calculate material, energy, gas, labor, and machine costs accurately",
    "Master cost optimization techniques for improved profitability",
    "Apply sensitivity analysis to identify cost drivers and optimization opportunities",
    "Develop skills in cost breakdown analysis and competitive pricing strategies"
  ];

  const keyFormulas = [
    {
      name: "Total Cutting Cost",
      formula: "Total Cost = Material Cost + Energy Cost + Gas Cost + Labor Cost + Machine Cost + Setup Cost",
      description: "Comprehensive cost calculation including all major cost components",
      variables: [
        { symbol: "Material Cost", description: "Cost of raw materials including waste", unit: "$" },
        { symbol: "Energy Cost", description: "Electrical energy consumption cost", unit: "$" },
        { symbol: "Gas Cost", description: "Assist gas consumption cost", unit: "$" },
        { symbol: "Labor Cost", description: "Operator and setup labor cost", unit: "$" },
        { symbol: "Machine Cost", description: "Machine operating and depreciation cost", unit: "$" },
        { symbol: "Setup Cost", description: "Job setup and changeover cost", unit: "$" }
      ]
    },
    {
      name: "Material Cost with Waste",
      formula: "Material Cost = (Part Area × Quantity × Material Price) × (1 + Waste Factor)",
      description: "Calculates material cost including waste allowance",
      variables: [
        { symbol: "Part Area", description: "Area of individual part", unit: "m²" },
        { symbol: "Quantity", description: "Number of parts to produce", unit: "pieces" },
        { symbol: "Material Price", description: "Cost per unit area of material", unit: "$/m²" },
        { symbol: "Waste Factor", description: "Waste percentage as decimal", unit: "0.1 = 10%" }
      ]
    },
    {
      name: "Energy Cost",
      formula: "Energy Cost = (Laser Power × Operating Time × Electricity Rate) / 1000",
      description: "Calculates electrical energy consumption cost",
      variables: [
        { symbol: "Laser Power", description: "Laser power consumption", unit: "W" },
        { symbol: "Operating Time", description: "Total cutting time", unit: "hours" },
        { symbol: "Electricity Rate", description: "Cost per kilowatt-hour", unit: "$/kWh" }
      ]
    },
    {
      name: "Cost per Piece",
      formula: "Cost per Piece = Total Cost / Quantity",
      description: "Calculates the cost for each individual piece",
      variables: [
        { symbol: "Total Cost", description: "Total production cost", unit: "$" },
        { symbol: "Quantity", description: "Number of pieces produced", unit: "pieces" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Steel Bracket Production Cost Analysis",
      scenario: "A manufacturer needs to produce 500 steel brackets (100mm × 150mm × 3mm thick) from mild steel sheets. Material cost is $3.50/m², electricity rate is $0.12/kWh, oxygen gas costs $0.80/m³, labor rate is $25/hour, and machine rate is $45/hour.",
      inputs: [
        { parameter: "Part dimensions", value: "100×150×3", unit: "mm" },
        { parameter: "Quantity", value: "500", unit: "pieces" },
        { parameter: "Material cost", value: "$3.50", unit: "per m²" },
        { parameter: "Waste factor", value: "12", unit: "%" },
        { parameter: "Cutting time", value: "2.5", unit: "hours" },
        { parameter: "Setup time", value: "30", unit: "minutes" }
      ],
      calculation: "Part Area = 0.1 × 0.15 = 0.015 m² per piece\nTotal Material Area = 0.015 × 500 × 1.12 = 8.4 m²\nMaterial Cost = 8.4 × $3.50 = $29.40\nEnergy Cost = 3000W × 2.5h × $0.12/kWh = $0.90\nGas Cost = 20 m³/h × 2.5h × $0.80 = $40.00\nLabor Cost = 3h × $25 = $75.00\nMachine Cost = 3h × $45 = $135.00\nTotal Cost = $280.30",
      result: "Total cost: $280.30, Cost per piece: $0.56",
      insights: [
        "Machine cost represents 48% of total cost - highest component",
        "Material utilization is 88% - good efficiency",
        "Setup time adds $25 to total cost - consider batch optimization",
        "Energy cost is minimal at 0.3% of total cost"
      ]
    },
    {
      title: "Aluminum Sheet Cost Optimization",
      scenario: "Cutting decorative aluminum panels (200mm × 300mm × 2mm) from 6061-T6 aluminum. Comparing nitrogen vs air assist gas for cost optimization.",
      inputs: [
        { parameter: "Part size", value: "200×300×2", unit: "mm" },
        { parameter: "Quantity", value: "200", unit: "pieces" },
        { parameter: "Aluminum cost", value: "$8.20", unit: "per m²" },
        { parameter: "Nitrogen cost", value: "$1.20", unit: "per m³" },
        { parameter: "Air cost", value: "$0.05", unit: "per m³" },
        { parameter: "Cutting speed (N2)", value: "6000", unit: "mm/min" },
        { parameter: "Cutting speed (Air)", value: "4500", unit: "mm/min" }
      ],
      calculation: "Nitrogen Option:\nGas Cost = 25 m³/h × 1.5h × $1.20 = $45.00\nTime Savings = 0.5 hours\nLabor Savings = 0.5h × $25 = $12.50\nNet Gas Cost = $45.00 - $12.50 = $32.50\n\nAir Option:\nGas Cost = 15 m³/h × 2h × $0.05 = $1.50\nAdditional Time Cost = 0.5h × $70 = $35.00\nNet Additional Cost = $35.00 - $1.50 = $33.50",
      result: "Nitrogen: $32.50 net cost, Air: $33.50 net cost - Nitrogen is $1.00 cheaper",
      insights: [
        "Nitrogen provides better edge quality and slightly lower cost",
        "Time savings with nitrogen offset higher gas cost",
        "For high-volume production, nitrogen becomes more cost-effective",
        "Consider quality requirements when choosing assist gas"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Accurate Cost Tracking",
      description: "Implement systematic cost tracking for all laser cutting operations",
      tips: [
        "Track actual vs. estimated costs for continuous improvement",
        "Include all cost components: direct and indirect costs",
        "Use job costing software for detailed cost analysis",
        "Regular review of material prices and supplier costs",
        "Monitor energy consumption patterns and peak demand charges"
      ],
      commonMistakes: [
        "Ignoring setup and changeover costs in calculations",
        "Using outdated material prices in cost estimates",
        "Not accounting for material waste and handling losses",
        "Overlooking machine depreciation and maintenance costs",
        "Failing to include quality-related rework costs"
      ]
    },
    {
      title: "Cost Optimization Strategies",
      description: "Systematic approaches to reduce laser cutting costs",
      tips: [
        "Optimize nesting to minimize material waste",
        "Batch similar jobs to reduce setup times",
        "Negotiate volume discounts with material suppliers",
        "Implement preventive maintenance to reduce downtime costs",
        "Use energy-efficient cutting parameters during peak rate periods"
      ],
      commonMistakes: [
        "Focusing only on material costs while ignoring labor efficiency",
        "Over-optimizing speed at the expense of quality and rework",
        "Not considering total cost of ownership for equipment decisions",
        "Ignoring the impact of part complexity on cutting costs",
        "Failing to account for seasonal material price variations"
      ]
    },
    {
      title: "Pricing and Profitability",
      description: "Develop competitive pricing strategies based on accurate cost data",
      tips: [
        "Add appropriate markup for profit and business overhead",
        "Consider market conditions and competitive pricing",
        "Offer value-based pricing for complex or rush jobs",
        "Implement tiered pricing for different volume levels",
        "Regular review and adjustment of pricing strategies"
      ],
      commonMistakes: [
        "Pricing based on competitors without knowing your own costs",
        "Not adjusting prices for material cost fluctuations",
        "Underestimating the cost of small-batch or prototype work",
        "Failing to charge appropriately for design and programming time",
        "Not considering the full customer lifecycle value"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 9001:2015",
      organization: "International Organization for Standardization",
      description: "Quality management systems requirements including cost control and process improvement",
      applicability: ["Cost Management", "Quality Control", "Process Improvement"]
    },
    {
      standard: "ASME Y14.5",
      organization: "American Society of Mechanical Engineers",
      description: "Geometric dimensioning and tolerancing standards affecting cost through precision requirements",
      applicability: ["Precision Manufacturing", "Quality Standards", "Cost Estimation"]
    },
    {
      standard: "AWS D1.1",
      organization: "American Welding Society",
      description: "Structural welding code affecting material selection and associated costs",
      applicability: ["Material Selection", "Welding Standards", "Structural Applications"]
    },
    {
      standard: "NIST SP 800-171",
      organization: "National Institute of Standards and Technology",
      description: "Cybersecurity standards for manufacturing systems affecting operational costs",
      applicability: ["Cybersecurity", "Manufacturing Systems", "Compliance Costs"]
    }
  ];

  const relatedCalculators = [
    "Material Selection Assistant",
    "ROI & Profit Calculator",
    "Production Time Calculator",
    "Energy Cost Calculator",
    "Competitive Pricing Analyzer"
  ];

  const downloadableResources = [
    {
      name: "Cost Calculation Worksheet",
      url: "/resources/cost-calculation-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Material Cost Database Template",
      url: "/resources/material-cost-database.xlsx",
      type: "XLSX"
    },
    {
      name: "Cost Optimization Checklist",
      url: "/resources/cost-optimization-checklist.pdf",
      type: "PDF"
    },
    {
      name: "Pricing Strategy Guide",
      url: "/resources/pricing-strategy-guide.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Laser Cutting Cost Calculator"
      calculatorDescription="Master the art of laser cutting cost calculation and optimization. Learn to accurately estimate all cost components, identify cost drivers, and implement strategies for improved profitability. This comprehensive guide covers material costs, energy consumption, labor efficiency, and competitive pricing strategies."
      category="Basic Calculations"
      difficulty="Basic"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/laser-cutting-cost-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default LaserCuttingCostLearn;

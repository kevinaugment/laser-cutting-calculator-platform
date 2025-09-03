import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const MaterialCostLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the components of material costs in laser cutting operations",
    "Learn how to calculate material usage and waste factors accurately",
    "Master optimization techniques for reducing material costs",
    "Apply cost calculation methods to real-world scenarios",
    "Identify opportunities for bulk purchasing and inventory optimization"
  ];

  const keyFormulas = [
    {
      name: "Total Material Cost",
      formula: "Total Cost = (Material Area × Material Cost per Unit) × (1 + Waste Factor)",
      description: "Calculates the total material cost including waste allowance",
      variables: [
        { symbol: "Material Area", description: "Total area of material needed", unit: "m² or ft²" },
        { symbol: "Material Cost per Unit", description: "Cost per unit area of material", unit: "$/m² or $/ft²" },
        { symbol: "Waste Factor", description: "Percentage of material waste", unit: "decimal (0.1 = 10%)" }
      ]
    },
    {
      name: "Material Utilization Rate",
      formula: "Utilization Rate = (Useful Material Area / Total Material Area) × 100",
      description: "Measures how efficiently material is being used",
      variables: [
        { symbol: "Useful Material Area", description: "Area of material actually used in parts", unit: "m² or ft²" },
        { symbol: "Total Material Area", description: "Total area of material purchased", unit: "m² or ft²" }
      ]
    },
    {
      name: "Cost per Piece",
      formula: "Cost per Piece = Total Material Cost / Number of Pieces",
      description: "Calculates the material cost for each individual piece",
      variables: [
        { symbol: "Total Material Cost", description: "Total cost of material used", unit: "$" },
        { symbol: "Number of Pieces", description: "Total number of pieces produced", unit: "pieces" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Steel Bracket Manufacturing",
      scenario: "A manufacturer needs to produce 100 steel brackets from 3mm thick steel sheets. Each bracket requires 150cm² of material, and the steel costs $8.50 per m². The expected waste factor is 15%.",
      inputs: [
        { parameter: "Pieces needed", value: "100", unit: "pieces" },
        { parameter: "Material per piece", value: "150", unit: "cm²" },
        { parameter: "Material cost", value: "$8.50", unit: "per m²" },
        { parameter: "Waste factor", value: "15", unit: "%" }
      ],
      calculation: "Total Area = 100 × 150cm² = 15,000cm² = 1.5m²\nWith waste = 1.5m² × 1.15 = 1.725m²\nTotal Cost = 1.725m² × $8.50 = $14.66",
      result: "$14.66 total material cost, $0.147 per piece",
      insights: [
        "Waste factor significantly impacts total cost (15% increase)",
        "Bulk material purchasing could reduce unit cost",
        "Nesting optimization could reduce waste factor to 10%"
      ]
    },
    {
      title: "Aluminum Sheet Optimization",
      scenario: "Cutting decorative panels from aluminum sheets. Standard sheet size is 1200mm × 2400mm, panel size is 300mm × 400mm. Aluminum costs $12.00 per m².",
      inputs: [
        { parameter: "Sheet size", value: "1200×2400", unit: "mm" },
        { parameter: "Panel size", value: "300×400", unit: "mm" },
        { parameter: "Material cost", value: "$12.00", unit: "per m²" },
        { parameter: "Kerf width", value: "0.2", unit: "mm" }
      ],
      calculation: "Panels per sheet = (1200÷300) × (2400÷400) = 4 × 6 = 24 panels\nSheet area = 1.2 × 2.4 = 2.88m²\nCost per panel = (2.88m² × $12.00) ÷ 24 = $1.44",
      result: "24 panels per sheet, $1.44 material cost per panel",
      insights: [
        "Perfect nesting with minimal waste achieved",
        "Kerf width consideration important for tight layouts",
        "Standard sheet sizes optimize material utilization"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Material Selection and Sourcing",
      description: "Choose the right material grade and supplier for optimal cost-effectiveness",
      tips: [
        "Compare prices from multiple suppliers regularly",
        "Consider material grade alternatives that meet specifications",
        "Negotiate volume discounts for regular orders",
        "Factor in delivery costs and lead times",
        "Maintain relationships with backup suppliers"
      ],
      commonMistakes: [
        "Using premium grades when standard grades suffice",
        "Not accounting for minimum order quantities",
        "Ignoring material certification costs",
        "Overlooking storage and handling costs",
        "Not considering material shelf life"
      ]
    },
    {
      title: "Waste Reduction Strategies",
      description: "Minimize material waste through smart planning and optimization",
      tips: [
        "Use nesting software for optimal part layout",
        "Plan for remnant material reuse",
        "Consider common cut lines between parts",
        "Optimize cutting sequences to minimize scrap",
        "Track and analyze waste patterns regularly"
      ],
      commonMistakes: [
        "Not accounting for kerf width in calculations",
        "Poor nesting leading to excessive waste",
        "Not planning for material handling requirements",
        "Ignoring grain direction requirements",
        "Underestimating setup and edge waste"
      ]
    },
    {
      title: "Cost Tracking and Analysis",
      description: "Implement systematic cost tracking for continuous improvement",
      tips: [
        "Track material costs by project and customer",
        "Monitor waste factors across different materials",
        "Analyze cost trends and market fluctuations",
        "Calculate true cost including handling and storage",
        "Regular review of supplier performance and pricing"
      ],
      commonMistakes: [
        "Not including all cost components",
        "Using outdated material prices",
        "Ignoring inventory carrying costs",
        "Not tracking actual vs. estimated costs",
        "Failing to update costs for inflation"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 9001:2015",
      organization: "International Organization for Standardization",
      description: "Quality management systems requirements including cost control",
      applicability: ["Quality Management", "Cost Control", "Process Improvement"]
    },
    {
      standard: "ASME Y14.5",
      organization: "American Society of Mechanical Engineers",
      description: "Geometric dimensioning and tolerancing affecting material requirements",
      applicability: ["Precision Manufacturing", "Tolerance Analysis"]
    },
    {
      standard: "AWS D1.1",
      organization: "American Welding Society",
      description: "Structural welding code affecting material specifications",
      applicability: ["Structural Steel", "Welding Applications"]
    }
  ];

  const relatedCalculators = [
    "Cutting Speed Calculator",
    "Production Time Calculator",
    "Waste Reduction Calculator",
    "ROI Calculator",
    "Operating Cost Calculator"
  ];

  const downloadableResources = [
    {
      name: "Material Cost Calculation Worksheet",
      url: "/resources/material-cost-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Material Properties Database",
      url: "/resources/material-properties.pdf",
      type: "PDF"
    },
    {
      name: "Waste Factor Guidelines",
      url: "/resources/waste-factor-guide.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Material Cost Calculator"
      calculatorDescription="Learn how to accurately calculate material costs for laser cutting operations, including waste factors, optimization strategies, and cost reduction techniques. Master the fundamentals of material cost analysis to improve profitability and competitiveness."
      category="Basic Calculations"
      difficulty="Basic"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/material-cost-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default MaterialCostLearn;

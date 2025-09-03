import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const StrategicPlanningLearn: React.FC = () => {
  const learningObjectives = [
    "Understand strategic planning fundamentals and frameworks for manufacturing businesses",
    "Learn to conduct comprehensive SWOT analysis and competitive assessment",
    "Master scenario planning and strategic option evaluation techniques",
    "Develop skills in strategic implementation and performance monitoring",
    "Apply strategic planning principles to laser cutting business growth"
  ];

  const keyFormulas = [
    {
      name: "Strategic Value Creation",
      formula: "Strategic Value = (Revenue Growth × Margin Improvement) - (Investment Cost × Risk Factor)",
      description: "Quantifies the value created by strategic initiatives",
      variables: [
        { symbol: "Revenue Growth", description: "Expected increase in revenue", unit: "$" },
        { symbol: "Margin Improvement", description: "Improvement in profit margins", unit: "%" },
        { symbol: "Investment Cost", description: "Total cost of strategic investment", unit: "$" },
        { symbol: "Risk Factor", description: "Risk adjustment multiplier", unit: "1.0-2.0" }
      ]
    },
    {
      name: "Competitive Advantage Index",
      formula: "CAI = (Market Share × Quality Score × Innovation Index) / (Cost Position × Time to Market)",
      description: "Measures relative competitive position in the market",
      variables: [
        { symbol: "Market Share", description: "Company's market share", unit: "%" },
        { symbol: "Quality Score", description: "Quality rating vs competitors", unit: "1-10" },
        { symbol: "Innovation Index", description: "Innovation capability rating", unit: "1-10" },
        { symbol: "Cost Position", description: "Cost position vs competitors", unit: "1-10" },
        { symbol: "Time to Market", description: "Speed to market vs competitors", unit: "1-10" }
      ]
    },
    {
      name: "Strategic Alignment Score",
      formula: "Alignment Score = Σ(Objective Weight × Achievement Level) / Total Weights",
      description: "Measures how well activities align with strategic objectives",
      variables: [
        { symbol: "Objective Weight", description: "Importance weight of each objective", unit: "1-10" },
        { symbol: "Achievement Level", description: "Level of objective achievement", unit: "1-10" },
        { symbol: "Total Weights", description: "Sum of all objective weights", unit: "points" }
      ]
    },
    {
      name: "Strategic Risk Assessment",
      formula: "Risk Score = Σ(Probability × Impact × Exposure) / Number of Risks",
      description: "Calculates overall strategic risk exposure",
      variables: [
        { symbol: "Probability", description: "Likelihood of risk occurrence", unit: "%" },
        { symbol: "Impact", description: "Potential impact if risk occurs", unit: "1-10" },
        { symbol: "Exposure", description: "Level of exposure to the risk", unit: "1-10" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Manufacturing Company Strategic Planning",
      scenario: "A laser cutting company with $5M annual revenue wants to expand into automotive market. Current market share is 8% in general manufacturing. Automotive market is 3x larger but more competitive.",
      inputs: [
        { parameter: "Current Revenue", value: "$5,000,000", unit: "per year" },
        { parameter: "Current Market Share", value: "8", unit: "%" },
        { parameter: "Target Market Size", value: "$45,000,000", unit: "automotive market" },
        { parameter: "Investment Required", value: "$2,000,000", unit: "for expansion" },
        { parameter: "Expected Market Share", value: "3", unit: "% in automotive" },
        { parameter: "Timeline", value: "3", unit: "years" }
      ],
      calculation: "Automotive Revenue Potential = $45M × 3% = $1.35M\nTotal Revenue Potential = $5M + $1.35M = $6.35M\nRevenue Growth = 27% increase\nROI = ($1.35M × 3 years - $2M) / $2M = 102.5%\nPayback Period = $2M / $1.35M = 1.48 years",
      result: "Strategic Value: $2.05M over 3 years, ROI: 102.5%, Payback: 1.48 years",
      insights: [
        "Automotive expansion shows strong financial potential",
        "Investment payback period is reasonable for strategic expansion",
        "Market share assumption is conservative and achievable",
        "Consider phased approach to reduce initial investment risk"
      ]
    },
    {
      title: "Technology Upgrade Strategic Decision",
      scenario: "Company considering upgrade to fiber laser technology. Current CO2 lasers generate $3M revenue with 15% margin. Fiber lasers could increase capacity by 40% and reduce operating costs by 25%.",
      inputs: [
        { parameter: "Current Revenue", value: "$3,000,000", unit: "per year" },
        { parameter: "Current Margin", value: "15", unit: "%" },
        { parameter: "Capacity Increase", value: "40", unit: "%" },
        { parameter: "Cost Reduction", value: "25", unit: "%" },
        { parameter: "Upgrade Investment", value: "$1,500,000" },
        { parameter: "Implementation Time", value: "6", unit: "months" }
      ],
      calculation: "Current Profit = $3M × 15% = $450K\nNew Revenue Potential = $3M × 1.4 = $4.2M\nCost Savings = ($3M × 85%) × 25% = $637.5K\nNew Profit = $4.2M × 15% + $637.5K = $1,267.5K\nAnnual Benefit = $1,267.5K - $450K = $817.5K\nROI = $817.5K / $1.5M = 54.5% annually",
      result: "Annual Benefit: $817.5K, ROI: 54.5%, Payback: 1.8 years",
      insights: [
        "Technology upgrade provides excellent ROI",
        "Capacity increase enables revenue growth",
        "Cost reduction improves competitive position",
        "Quick payback reduces investment risk"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Strategic Planning Process",
      description: "Establish a systematic approach to strategic planning and execution",
      tips: [
        "Conduct thorough environmental scanning and market analysis",
        "Involve key stakeholders in planning process",
        "Set SMART objectives with clear metrics and timelines",
        "Develop multiple scenarios and contingency plans",
        "Create detailed implementation roadmaps with milestones"
      ],
      commonMistakes: [
        "Planning in isolation without stakeholder input",
        "Setting vague objectives without measurable outcomes",
        "Not considering external market forces and trends",
        "Failing to align resources with strategic priorities",
        "Creating plans without implementation details"
      ]
    },
    {
      title: "Strategic Analysis and Assessment",
      description: "Use proven frameworks for comprehensive strategic analysis",
      tips: [
        "Conduct regular SWOT analysis to assess position",
        "Use Porter's Five Forces for competitive analysis",
        "Apply scenario planning for uncertainty management",
        "Benchmark against industry leaders and best practices",
        "Analyze value chain for competitive advantage opportunities"
      ],
      commonMistakes: [
        "Relying on outdated market information",
        "Underestimating competitive threats and responses",
        "Not considering disruptive technologies and trends",
        "Focusing only on internal capabilities",
        "Ignoring regulatory and environmental factors"
      ]
    },
    {
      title: "Implementation and Monitoring",
      description: "Ensure effective strategy implementation and performance tracking",
      tips: [
        "Break strategy into actionable initiatives and projects",
        "Assign clear ownership and accountability for results",
        "Establish regular review cycles and progress reporting",
        "Monitor key performance indicators and leading metrics",
        "Adapt strategy based on changing conditions and results"
      ],
      commonMistakes: [
        "Not translating strategy into specific actions",
        "Lack of clear accountability and ownership",
        "Infrequent monitoring and course correction",
        "Focusing only on lagging indicators",
        "Rigid adherence to plans despite changing conditions"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 9001:2015",
      organization: "International Organization for Standardization",
      description: "Quality management systems with strategic planning requirements",
      applicability: ["Strategic Planning", "Quality Management", "Continuous Improvement"]
    },
    {
      standard: "Balanced Scorecard Framework",
      organization: "Harvard Business School",
      description: "Strategic planning and management system for translating strategy into action",
      applicability: ["Performance Management", "Strategic Alignment", "KPI Development"]
    },
    {
      standard: "COSO Enterprise Risk Management",
      organization: "Committee of Sponsoring Organizations",
      description: "Framework for enterprise risk management in strategic planning",
      applicability: ["Risk Management", "Strategic Planning", "Governance"]
    }
  ];

  const relatedCalculators = [
    "Market Analysis Calculator",
    "Risk Management Calculator",
    "Financial Planning Calculator",
    "Expansion Planning Calculator",
    "ROI Calculator"
  ];

  const downloadableResources = [
    {
      name: "Strategic Planning Template",
      url: "/resources/strategic-planning-template.xlsx",
      type: "XLSX"
    },
    {
      name: "SWOT Analysis Framework",
      url: "/resources/swot-analysis-framework.pdf",
      type: "PDF"
    },
    {
      name: "Strategic Implementation Roadmap",
      url: "/resources/implementation-roadmap.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Strategic Planning Calculator"
      calculatorDescription="Master strategic planning for manufacturing businesses with comprehensive frameworks and analysis tools. Learn to develop, implement, and monitor strategic plans that drive sustainable growth and competitive advantage in the laser cutting industry."
      category="Business Management"
      difficulty="Advanced"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/strategic-planning-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default StrategicPlanningLearn;

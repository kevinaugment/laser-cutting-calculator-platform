import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const ROICalculatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the fundamentals of Return on Investment (ROI) analysis",
    "Learn to calculate ROI for equipment purchases and process improvements",
    "Master different ROI calculation methods and their applications",
    "Analyze risk factors and their impact on investment decisions",
    "Apply ROI analysis to real-world laser cutting business scenarios"
  ];

  const keyFormulas = [
    {
      name: "Basic ROI Formula",
      formula: "ROI = ((Net Profit - Investment Cost) / Investment Cost) × 100",
      description: "Calculates the percentage return on an investment",
      variables: [
        { symbol: "Net Profit", description: "Total profit generated from the investment", unit: "$" },
        { symbol: "Investment Cost", description: "Initial cost of the investment", unit: "$" },
        { symbol: "ROI", description: "Return on Investment", unit: "%" }
      ]
    },
    {
      name: "Annualized ROI",
      formula: "Annualized ROI = ((Ending Value / Beginning Value)^(1/Years)) - 1",
      description: "Calculates the annual rate of return over multiple years",
      variables: [
        { symbol: "Ending Value", description: "Value at the end of investment period", unit: "$" },
        { symbol: "Beginning Value", description: "Initial investment value", unit: "$" },
        { symbol: "Years", description: "Number of years in investment period", unit: "years" }
      ]
    },
    {
      name: "Payback Period",
      formula: "Payback Period = Initial Investment / Annual Cash Flow",
      description: "Time required to recover the initial investment",
      variables: [
        { symbol: "Initial Investment", description: "Total upfront investment cost", unit: "$" },
        { symbol: "Annual Cash Flow", description: "Net annual cash flow from investment", unit: "$/year" }
      ]
    },
    {
      name: "Net Present Value (NPV)",
      formula: "NPV = Σ(Cash Flow / (1 + Discount Rate)^Period) - Initial Investment",
      description: "Present value of future cash flows minus initial investment",
      variables: [
        { symbol: "Cash Flow", description: "Cash flow for each period", unit: "$" },
        { symbol: "Discount Rate", description: "Required rate of return", unit: "%" },
        { symbol: "Period", description: "Time period", unit: "years" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Laser Cutting Machine Investment",
      scenario: "A company is considering purchasing a new fiber laser cutting machine for $250,000. The machine is expected to generate additional annual revenue of $180,000 with operating costs of $120,000 per year over 5 years.",
      inputs: [
        { parameter: "Initial Investment", value: "$250,000" },
        { parameter: "Annual Revenue", value: "$180,000" },
        { parameter: "Annual Operating Costs", value: "$120,000" },
        { parameter: "Investment Period", value: "5", unit: "years" },
        { parameter: "Discount Rate", value: "8", unit: "%" }
      ],
      calculation: "Annual Net Cash Flow = $180,000 - $120,000 = $60,000\nTotal Net Profit (5 years) = $60,000 × 5 = $300,000\nROI = (($300,000 - $250,000) / $250,000) × 100 = 20%\nPayback Period = $250,000 / $60,000 = 4.17 years",
      result: "ROI: 20%, Payback Period: 4.17 years, NPV: $14,637",
      insights: [
        "Positive ROI indicates profitable investment",
        "Payback period is reasonable for equipment investment",
        "NPV is positive, confirming investment viability",
        "Consider maintenance costs and technology obsolescence"
      ]
    },
    {
      title: "Process Automation Investment",
      scenario: "Implementing automated material handling system costing $75,000. Expected to reduce labor costs by $35,000/year and increase productivity by $15,000/year over 3 years.",
      inputs: [
        { parameter: "Initial Investment", value: "$75,000" },
        { parameter: "Annual Labor Savings", value: "$35,000" },
        { parameter: "Annual Productivity Gains", value: "$15,000" },
        { parameter: "Investment Period", value: "3", unit: "years" },
        { parameter: "Maintenance Costs", value: "$5,000", unit: "per year" }
      ],
      calculation: "Annual Net Benefit = $35,000 + $15,000 - $5,000 = $45,000\nTotal Net Profit (3 years) = $45,000 × 3 = $135,000\nROI = (($135,000 - $75,000) / $75,000) × 100 = 80%\nPayback Period = $75,000 / $45,000 = 1.67 years",
      result: "ROI: 80%, Payback Period: 1.67 years",
      insights: [
        "Excellent ROI due to significant labor cost savings",
        "Quick payback period reduces investment risk",
        "Automation provides ongoing competitive advantage",
        "Consider training costs and change management"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Investment Analysis Framework",
      description: "Establish a systematic approach to evaluating investments",
      tips: [
        "Define clear investment objectives and success criteria",
        "Consider multiple scenarios (optimistic, realistic, pessimistic)",
        "Include all relevant costs (purchase, installation, training, maintenance)",
        "Factor in opportunity costs and alternative investments",
        "Set appropriate discount rates based on company cost of capital"
      ],
      commonMistakes: [
        "Ignoring hidden costs and implementation expenses",
        "Using overly optimistic revenue projections",
        "Not considering technology obsolescence",
        "Failing to account for training and change management costs",
        "Using inappropriate time horizons for analysis"
      ]
    },
    {
      title: "Risk Assessment and Mitigation",
      description: "Identify and manage investment risks effectively",
      tips: [
        "Conduct sensitivity analysis on key variables",
        "Identify and quantify major risk factors",
        "Develop contingency plans for different scenarios",
        "Consider insurance and warranty options",
        "Monitor key performance indicators regularly"
      ],
      commonMistakes: [
        "Underestimating implementation risks",
        "Not considering market and competitive changes",
        "Ignoring regulatory and compliance risks",
        "Failing to plan for equipment downtime",
        "Not having exit strategies for failed investments"
      ]
    },
    {
      title: "Performance Monitoring and Review",
      description: "Track investment performance and learn from outcomes",
      tips: [
        "Establish baseline metrics before implementation",
        "Monitor actual vs. projected performance regularly",
        "Document lessons learned for future investments",
        "Adjust strategies based on performance data",
        "Celebrate successes and analyze failures"
      ],
      commonMistakes: [
        "Not tracking actual ROI after implementation",
        "Failing to adjust projections based on new information",
        "Not learning from past investment decisions",
        "Ignoring changing market conditions",
        "Not communicating results to stakeholders"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "GAAP (Generally Accepted Accounting Principles)",
      organization: "Financial Accounting Standards Board",
      description: "Standard accounting principles for financial reporting and investment analysis",
      applicability: ["Financial Reporting", "Investment Analysis", "Cost Accounting"]
    },
    {
      standard: "PMI Project Management Standards",
      organization: "Project Management Institute",
      description: "Best practices for project evaluation and investment decision-making",
      applicability: ["Project Management", "Investment Planning", "Risk Management"]
    },
    {
      standard: "ISO 31000",
      organization: "International Organization for Standardization",
      description: "Risk management principles and guidelines for investment decisions",
      applicability: ["Risk Management", "Investment Analysis", "Decision Making"]
    }
  ];

  const relatedCalculators = [
    "Break-even Calculator",
    "Cost-Benefit Calculator",
    "Financial Planning Calculator",
    "Risk Management Calculator",
    "Investment Analysis Calculator"
  ];

  const downloadableResources = [
    {
      name: "ROI Analysis Template",
      url: "/resources/roi-analysis-template.xlsx",
      type: "XLSX"
    },
    {
      name: "Investment Decision Framework",
      url: "/resources/investment-framework.pdf",
      type: "PDF"
    },
    {
      name: "Risk Assessment Checklist",
      url: "/resources/risk-assessment-checklist.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="ROI Calculator"
      calculatorDescription="Master the art of Return on Investment analysis for laser cutting operations. Learn to evaluate equipment purchases, process improvements, and strategic investments using proven financial analysis methods. Make data-driven decisions that maximize profitability and minimize risk."
      category="Cost Optimization"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/roi-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default ROICalculatorLearn;

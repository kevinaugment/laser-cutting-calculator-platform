import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const CompetitivePricingAnalyzerLearn: React.FC = () => {
  const learningObjectives = [
    "Understand competitive pricing strategies and market analysis",
    "Learn to analyze competitor pricing and positioning",
    "Master value-based pricing and differentiation strategies",
    "Apply pricing optimization techniques for market competitiveness",
    "Develop skills in pricing intelligence and market research"
  ];

  const keyFormulas = [
    {
      name: "Price Competitiveness Index",
      formula: "PCI = (Your Price / Average Market Price) × 100",
      description: "Measures price position relative to market average",
      variables: [
        { symbol: "Your Price", description: "Your quoted price for service", unit: "$" },
        { symbol: "Average Market Price", description: "Average competitor price", unit: "$" }
      ]
    },
    {
      name: "Value-Based Pricing",
      formula: "Value Price = Customer Value - (Competitor Price × Switching Cost Factor)",
      description: "Pricing based on customer perceived value",
      variables: [
        { symbol: "Customer Value", description: "Total value delivered to customer", unit: "$" },
        { symbol: "Competitor Price", description: "Best alternative price", unit: "$" },
        { symbol: "Switching Cost Factor", description: "Cost/difficulty of switching", unit: "1.0-1.5" }
      ]
    },
    {
      name: "Market Share Impact",
      formula: "Market Share Change = Price Elasticity × Price Change %",
      description: "Estimated market share change from pricing decisions",
      variables: [
        { symbol: "Price Elasticity", description: "Market sensitivity to price changes", unit: "-0.5 to -3.0" },
        { symbol: "Price Change %", description: "Percentage change in price", unit: "%" }
      ]
    },
    {
      name: "Competitive Margin Analysis",
      formula: "Competitive Margin = ((Market Price - Your Cost) / Market Price) × 100",
      description: "Potential margin at competitive market prices",
      variables: [
        { symbol: "Market Price", description: "Competitive market price", unit: "$" },
        { symbol: "Your Cost", description: "Your total cost to deliver", unit: "$" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Market Position Analysis",
      scenario: "Analyzing competitive position for laser cutting services. Your price: $85/hour, Market range: $70-$110/hour, Average: $88/hour. Quality rating: 9/10 vs market average 7/10.",
      inputs: [
        { parameter: "Your Price", value: "$85", unit: "per hour" },
        { parameter: "Market Low", value: "$70", unit: "per hour" },
        { parameter: "Market High", value: "$110", unit: "per hour" },
        { parameter: "Market Average", value: "$88", unit: "per hour" },
        { parameter: "Your Quality Rating", value: "9", unit: "out of 10" },
        { parameter: "Market Avg Quality", value: "7", unit: "out of 10" },
        { parameter: "Your Cost", value: "$62", unit: "per hour" }
      ],
      calculation: "Price Competitiveness Index:\nPCI = ($85 / $88) × 100 = 96.6%\n(3.4% below market average)\n\nValue Position Analysis:\nQuality Premium = (9 - 7) / 7 = 28.6% quality advantage\nValue-Justified Price = $88 × 1.286 = $113\nCurrent Price Gap = $113 - $85 = $28 underpriced\n\nCompetitive Margin Analysis:\nCurrent Margin = ($85 - $62) / $85 = 27.1%\nMarket Price Margin = ($88 - $62) / $88 = 29.5%\nPotential Margin = ($113 - $62) / $113 = 45.1%",
      result: "Position: 3.4% below market, $28 underpriced for quality delivered",
      insights: [
        "Pricing below market despite superior quality",
        "Significant opportunity to increase prices based on value",
        "Current pricing leaves money on the table",
        "Quality advantage justifies premium positioning"
      ]
    },
    {
      title: "Competitive Response Strategy",
      scenario: "Major competitor reduces prices by 15%. Analyzing response options: match price, maintain price, or partial reduction. Current market share: 25%, price elasticity: -1.8.",
      inputs: [
        { parameter: "Current Price", value: "$90", unit: "per hour" },
        { parameter: "Current Market Share", value: "25", unit: "%" },
        { parameter: "Competitor Price Cut", value: "15", unit: "%" },
        { parameter: "New Competitor Price", value: "$76.50", unit: "per hour" },
        { parameter: "Price Elasticity", value: "-1.8", unit: "elasticity" },
        { parameter: "Your Cost", value: "$65", unit: "per hour" }
      ],
      calculation: "Response Option Analysis:\n\nOption 1 - Match Price ($76.50):\nPrice Reduction = 15%\nMarket Share Gain = 1.8 × 15% = 27%\nNew Market Share = 25% × 1.27 = 31.75%\nNew Margin = ($76.50 - $65) / $76.50 = 15.0%\n\nOption 2 - Maintain Price ($90):\nRelative Price Increase = 17.6%\nMarket Share Loss = 1.8 × 17.6% = 31.7%\nNew Market Share = 25% × 0.683 = 17.1%\nMaintained Margin = ($90 - $65) / $90 = 27.8%\n\nOption 3 - Partial Cut ($83):\nPrice Reduction = 7.8%\nMarket Share Change = 1.8 × 7.8% = 14%\nNew Market Share = 25% × 1.14 = 28.5%\nNew Margin = ($83 - $65) / $83 = 21.7%",
      result: "Best option: Partial cut to $83 - balances share and margin",
      insights: [
        "Full price match gains share but severely impacts margin",
        "Maintaining price results in significant share loss",
        "Partial reduction offers best balance of share and profitability",
        "Consider non-price responses like service improvements"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Competitive Intelligence Gathering",
      description: "Systematic approaches to gathering and analyzing competitor pricing data",
      tips: [
        "Regularly monitor competitor pricing through multiple channels",
        "Use mystery shopping to understand competitor offerings",
        "Analyze competitor cost structures and business models",
        "Track competitor pricing changes and market responses",
        "Build relationships with suppliers for market intelligence"
      ],
      commonMistakes: [
        "Relying on outdated or incomplete competitor pricing data",
        "Not understanding the full scope of competitor offerings",
        "Focusing only on price without considering value proposition",
        "Not tracking competitor pricing trends over time",
        "Making pricing decisions based on limited competitive intelligence"
      ]
    },
    {
      title: "Value-Based Pricing Implementation",
      description: "Strategies for implementing value-based pricing in competitive markets",
      tips: [
        "Quantify and communicate unique value propositions",
        "Segment customers based on value sensitivity",
        "Develop pricing tiers based on value delivered",
        "Train sales teams on value selling techniques",
        "Regularly validate value perception with customers"
      ],
      commonMistakes: [
        "Not clearly articulating value to customers",
        "Using cost-plus pricing when value pricing is more appropriate",
        "Not differentiating pricing based on customer segments",
        "Failing to capture value through pricing structure",
        "Not adjusting pricing as value proposition evolves"
      ]
    },
    {
      title: "Pricing Strategy Optimization",
      description: "Methods for optimizing pricing strategies in competitive environments",
      tips: [
        "Test pricing strategies with small customer segments",
        "Use dynamic pricing for different market conditions",
        "Consider bundling strategies to differentiate from competitors",
        "Implement price discrimination where legally permissible",
        "Monitor and measure pricing strategy effectiveness"
      ],
      commonMistakes: [
        "Making large pricing changes without testing",
        "Not considering customer lifetime value in pricing decisions",
        "Ignoring the impact of pricing on brand positioning",
        "Not coordinating pricing with marketing and sales strategies",
        "Failing to communicate pricing changes effectively to customers"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 10006",
      organization: "International Organization for Standardization",
      description: "Quality management systems - Guidelines for quality management in projects",
      applicability: ["Service Quality", "Value Delivery", "Customer Satisfaction"]
    },
    {
      standard: "Professional Pricing Society Standards",
      organization: "Professional Pricing Society",
      description: "Best practices for pricing strategy and implementation",
      applicability: ["Pricing Strategy", "Competitive Analysis", "Value Pricing"]
    },
    {
      standard: "Market Research Society Code",
      organization: "Market Research Society",
      description: "Ethical guidelines for market research and competitive intelligence",
      applicability: ["Market Research", "Competitive Intelligence", "Ethical Practices"]
    }
  ];

  const relatedCalculators = [
    "Laser Cutting Cost Calculator",
    "ROI & Profit Calculator",
    "Customer Profitability Calculator",
    "Market Analysis Calculator",
    "Value Proposition Calculator"
  ];

  const downloadableResources = [
    {
      name: "Competitive Analysis Template",
      url: "/resources/competitive-analysis-template.xlsx",
      type: "XLSX"
    },
    {
      name: "Pricing Strategy Worksheet",
      url: "/resources/pricing-strategy-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Value Pricing Guide",
      url: "/resources/value-pricing-guide.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Competitive Pricing Analyzer"
      calculatorDescription="Master competitive pricing analysis and strategy development for laser cutting services. Learn to analyze market positioning, implement value-based pricing, and optimize pricing strategies for competitive advantage and profitability."
      category="Business Strategy"
      difficulty="Advanced"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/competitive-pricing-analyzer"
      downloadableResources={downloadableResources}
    />
  );
};

export default CompetitivePricingAnalyzerLearn;

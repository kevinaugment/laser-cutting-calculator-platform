import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const EnergyCostCalculatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand energy consumption patterns in laser cutting operations",
    "Learn to calculate and optimize electrical energy costs",
    "Master energy efficiency techniques for cost reduction",
    "Apply demand management strategies to minimize peak charges",
    "Develop skills in energy monitoring and cost control"
  ];

  const keyFormulas = [
    {
      name: "Total Energy Cost",
      formula: "Total Cost = (kWh × Energy Rate) + (Peak Demand × Demand Charge)",
      description: "Complete energy cost including consumption and demand charges",
      variables: [
        { symbol: "kWh", description: "Total kilowatt-hours consumed", unit: "kWh" },
        { symbol: "Energy Rate", description: "Cost per kilowatt-hour", unit: "$/kWh" },
        { symbol: "Peak Demand", description: "Maximum power demand", unit: "kW" },
        { symbol: "Demand Charge", description: "Cost per kW of peak demand", unit: "$/kW" }
      ]
    },
    {
      name: "Laser Energy Consumption",
      formula: "Energy = (Laser Power × Operating Time × Load Factor) / 1000",
      description: "Electrical energy consumed by laser during operation",
      variables: [
        { symbol: "Laser Power", description: "Laser power consumption", unit: "W" },
        { symbol: "Operating Time", description: "Total operating time", unit: "hours" },
        { symbol: "Load Factor", description: "Average power utilization", unit: "0.6-0.9" }
      ]
    },
    {
      name: "System Energy Consumption",
      formula: "System Energy = Laser Energy + Auxiliary Energy + HVAC Energy",
      description: "Total system energy including all components",
      variables: [
        { symbol: "Laser Energy", description: "Energy consumed by laser", unit: "kWh" },
        { symbol: "Auxiliary Energy", description: "Energy for pumps, compressors, etc.", unit: "kWh" },
        { symbol: "HVAC Energy", description: "Energy for heating, ventilation, cooling", unit: "kWh" }
      ]
    },
    {
      name: "Energy Cost per Part",
      formula: "Cost per Part = Total Energy Cost / Parts Produced",
      description: "Energy cost allocation per manufactured part",
      variables: [
        { symbol: "Total Energy Cost", description: "Total energy cost for period", unit: "$" },
        { symbol: "Parts Produced", description: "Number of parts manufactured", unit: "pieces" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Monthly Energy Cost Analysis",
      scenario: "Calculating monthly energy costs for a 6kW fiber laser system operating 160 hours/month. Energy rate: $0.12/kWh, demand charge: $15/kW, load factor: 75%.",
      inputs: [
        { parameter: "Laser Power", value: "6000", unit: "W" },
        { parameter: "Operating Hours", value: "160", unit: "hours/month" },
        { parameter: "Load Factor", value: "75", unit: "%" },
        { parameter: "Energy Rate", value: "$0.12", unit: "per kWh" },
        { parameter: "Demand Charge", value: "$15", unit: "per kW" },
        { parameter: "Auxiliary Power", value: "2000", unit: "W" },
        { parameter: "HVAC Power", value: "3000", unit: "W" }
      ],
      calculation: "Laser Energy = (6000 × 160 × 0.75) / 1000 = 720 kWh\nAuxiliary Energy = (2000 × 160) / 1000 = 320 kWh\nHVAC Energy = (3000 × 160) / 1000 = 480 kWh\nTotal Energy = 720 + 320 + 480 = 1,520 kWh\n\nEnergy Cost = 1,520 × $0.12 = $182.40\nPeak Demand = (6000 + 2000 + 3000) / 1000 = 11 kW\nDemand Cost = 11 × $15 = $165\nTotal Monthly Cost = $182.40 + $165 = $347.40",
      result: "Monthly energy cost: $347.40 (Energy: $182.40, Demand: $165.00)",
      insights: [
        "Demand charges represent 47% of total energy cost",
        "Auxiliary systems consume 53% of total energy",
        "Load factor significantly impacts actual consumption",
        "Peak demand management is critical for cost control"
      ]
    },
    {
      title: "Energy Efficiency Optimization",
      scenario: "Comparing energy costs before and after efficiency improvements. Installing variable frequency drives and optimizing cutting parameters to improve efficiency from 65% to 80%.",
      inputs: [
        { parameter: "Current Efficiency", value: "65", unit: "%" },
        { parameter: "Improved Efficiency", value: "80", unit: "%" },
        { parameter: "Monthly Operating Hours", value: "180", unit: "hours" },
        { parameter: "System Power", value: "12000", unit: "W" },
        { parameter: "Energy Rate", value: "$0.14", unit: "per kWh" },
        { parameter: "Improvement Cost", value: "$8,000", unit: "investment" }
      ],
      calculation: "Current Energy Consumption:\nCurrent kWh = (12000 × 180 × 0.65) / 1000 = 1,404 kWh\nCurrent Cost = 1,404 × $0.14 = $196.56/month\n\nImproved Energy Consumption:\nImproved kWh = (12000 × 180 × 0.80) / 1000 = 1,728 kWh\nBut with 15% power reduction: 1,728 × 0.85 = 1,469 kWh\nImproved Cost = 1,469 × $0.14 = $205.66/month\n\nActual Savings = $196.56 - $205.66 = -$9.10/month\nPayback Period = $8,000 / ($9.10 × 12) = 73 months",
      result: "Monthly savings: $9.10, Annual savings: $109, Payback: 73 months",
      insights: [
        "Efficiency improvements provide modest but consistent savings",
        "Long payback period requires careful cost-benefit analysis",
        "Additional benefits include reduced maintenance and downtime",
        "Energy savings compound over equipment lifetime"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Energy Monitoring and Management",
      description: "Systematic approaches to monitoring and managing energy consumption",
      tips: [
        "Install energy monitoring systems for real-time consumption tracking",
        "Establish energy consumption baselines for different operations",
        "Monitor power quality to ensure efficient equipment operation",
        "Implement automated systems to reduce standby power consumption",
        "Regular energy audits to identify improvement opportunities"
      ],
      commonMistakes: [
        "Not monitoring energy consumption at the equipment level",
        "Ignoring power factor and its impact on energy costs",
        "Not considering time-of-use rates in production scheduling",
        "Failing to account for auxiliary system energy consumption",
        "Not training operators on energy-efficient practices"
      ]
    },
    {
      title: "Demand Management Strategies",
      description: "Techniques for managing peak demand to reduce demand charges",
      tips: [
        "Schedule high-energy operations during off-peak hours",
        "Implement load shedding systems for peak demand control",
        "Use energy storage systems to reduce peak demand",
        "Coordinate equipment startup to avoid simultaneous peak loads",
        "Consider demand response programs offered by utilities"
      ],
      commonMistakes: [
        "Not understanding utility rate structures and demand charges",
        "Ignoring the cumulative effect of multiple equipment startups",
        "Not considering seasonal variations in demand charges",
        "Failing to coordinate production scheduling with energy costs",
        "Not investing in demand management technology when cost-effective"
      ]
    },
    {
      title: "Energy Efficiency Optimization",
      description: "Methods for improving energy efficiency and reducing consumption",
      tips: [
        "Optimize cutting parameters for energy efficiency",
        "Implement variable frequency drives on auxiliary equipment",
        "Use high-efficiency motors and equipment",
        "Improve facility insulation and HVAC efficiency",
        "Consider renewable energy sources for long-term cost reduction"
      ],
      commonMistakes: [
        "Focusing only on laser efficiency while ignoring auxiliary systems",
        "Not considering the total cost of ownership for efficiency improvements",
        "Implementing efficiency measures without measuring actual savings",
        "Ignoring maintenance requirements for high-efficiency equipment",
        "Not considering utility rebates and incentives for efficiency improvements"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 50001",
      organization: "International Organization for Standardization",
      description: "Energy management systems - Requirements with guidance for use",
      applicability: ["Energy Management", "Efficiency Improvement", "Cost Reduction"]
    },
    {
      standard: "IEEE 1159",
      organization: "Institute of Electrical and Electronics Engineers",
      description: "Recommended practice for monitoring electric power quality",
      applicability: ["Power Quality", "Energy Efficiency", "Equipment Protection"]
    },
    {
      standard: "ANSI/ASHRAE/IES 90.1",
      organization: "American Society of Heating, Refrigerating and Air-Conditioning Engineers",
      description: "Energy standard for buildings except low-rise residential buildings",
      applicability: ["Building Energy", "HVAC Systems", "Energy Codes"]
    }
  ];

  const relatedCalculators = [
    "Operating Cost Calculator",
    "Power Requirement Calculator",
    "Carbon Footprint Calculator",
    "Utility Rate Analyzer",
    "Equipment Efficiency Calculator"
  ];

  const downloadableResources = [
    {
      name: "Energy Cost Tracking Worksheet",
      url: "/resources/energy-cost-tracking.xlsx",
      type: "XLSX"
    },
    {
      name: "Demand Management Guide",
      url: "/resources/demand-management-guide.pdf",
      type: "PDF"
    },
    {
      name: "Energy Efficiency Checklist",
      url: "/resources/energy-efficiency-checklist.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Energy Cost Calculator"
      calculatorDescription="Master energy cost calculation and optimization for laser cutting operations. Learn to analyze energy consumption patterns, manage demand charges, and implement efficiency strategies to reduce operating costs while maintaining productivity."
      category="Cost Analysis"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/energy-cost-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default EnergyCostCalculatorLearn;

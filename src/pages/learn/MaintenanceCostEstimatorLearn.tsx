import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const MaintenanceCostEstimatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand maintenance cost components and calculation methods",
    "Learn to estimate preventive and corrective maintenance costs",
    "Master maintenance scheduling optimization for cost reduction",
    "Apply reliability-centered maintenance principles",
    "Develop skills in maintenance budgeting and cost control"
  ];

  const keyFormulas = [
    {
      name: "Total Maintenance Cost",
      formula: "Total Cost = Preventive Cost + Corrective Cost + Downtime Cost + Parts Cost",
      description: "Comprehensive maintenance cost including all components",
      variables: [
        { symbol: "Preventive Cost", description: "Scheduled maintenance labor and materials", unit: "$" },
        { symbol: "Corrective Cost", description: "Unplanned repair costs", unit: "$" },
        { symbol: "Downtime Cost", description: "Production loss due to maintenance", unit: "$" },
        { symbol: "Parts Cost", description: "Replacement parts and consumables", unit: "$" }
      ]
    },
    {
      name: "Preventive Maintenance Cost",
      formula: "PM Cost = (Labor Hours × Labor Rate) + Material Cost + Overhead",
      description: "Cost of scheduled preventive maintenance activities",
      variables: [
        { symbol: "Labor Hours", description: "Time required for maintenance", unit: "hours" },
        { symbol: "Labor Rate", description: "Maintenance technician hourly rate", unit: "$/hour" },
        { symbol: "Material Cost", description: "Cost of maintenance materials", unit: "$" },
        { symbol: "Overhead", description: "Indirect maintenance costs", unit: "$" }
      ]
    },
    {
      name: "Downtime Cost",
      formula: "Downtime Cost = Downtime Hours × (Lost Revenue - Variable Costs Saved)",
      description: "Economic impact of production downtime during maintenance",
      variables: [
        { symbol: "Downtime Hours", description: "Hours of production lost", unit: "hours" },
        { symbol: "Lost Revenue", description: "Revenue per hour of production", unit: "$/hour" },
        { symbol: "Variable Costs Saved", description: "Variable costs not incurred during downtime", unit: "$/hour" }
      ]
    },
    {
      name: "Maintenance Cost per Operating Hour",
      formula: "Cost per Hour = Annual Maintenance Cost / Annual Operating Hours",
      description: "Maintenance cost allocation per hour of operation",
      variables: [
        { symbol: "Annual Maintenance Cost", description: "Total yearly maintenance cost", unit: "$" },
        { symbol: "Annual Operating Hours", description: "Total yearly operating hours", unit: "hours" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Annual Maintenance Budget Planning",
      scenario: "Estimating annual maintenance costs for a 6kW fiber laser system. Operating 2000 hours/year, preventive maintenance every 500 hours, average repair cost $1200, downtime cost $150/hour.",
      inputs: [
        { parameter: "Annual Operating Hours", value: "2000", unit: "hours" },
        { parameter: "PM Interval", value: "500", unit: "hours" },
        { parameter: "PM Labor Hours", value: "4", unit: "hours" },
        { parameter: "Labor Rate", value: "$75", unit: "per hour" },
        { parameter: "PM Material Cost", value: "$200", unit: "per PM" },
        { parameter: "Average Repair Cost", value: "$1200", unit: "per repair" },
        { parameter: "Repair Frequency", value: "2", unit: "repairs/year" },
        { parameter: "Downtime per PM", value: "6", unit: "hours" },
        { parameter: "Downtime Cost", value: "$150", unit: "per hour" }
      ],
      calculation: "Preventive Maintenance:\nPM Events per Year = 2000 / 500 = 4 events\nPM Labor Cost = 4 × 4 × $75 = $1,200\nPM Material Cost = 4 × $200 = $800\nPM Downtime Cost = 4 × 6 × $150 = $3,600\nTotal PM Cost = $1,200 + $800 + $3,600 = $5,600\n\nCorrective Maintenance:\nRepair Cost = 2 × $1,200 = $2,400\nRepair Downtime = 2 × 8 × $150 = $2,400\nTotal CM Cost = $2,400 + $2,400 = $4,800\n\nTotal Annual Cost = $5,600 + $4,800 = $10,400\nCost per Operating Hour = $10,400 / 2000 = $5.20/hour",
      result: "Annual maintenance cost: $10,400, Cost per hour: $5.20",
      insights: [
        "Preventive maintenance represents 54% of total maintenance cost",
        "Downtime costs are significant component (58% of total)",
        "Regular PM helps prevent more expensive corrective maintenance",
        "Cost per hour provides basis for job costing and pricing"
      ]
    },
    {
      title: "Maintenance Strategy Comparison",
      scenario: "Comparing reactive vs preventive maintenance strategies. Reactive: lower upfront cost but higher failure rates. Preventive: higher scheduled cost but reduced failures.",
      inputs: [
        { parameter: "Reactive Strategy", value: "Current", unit: "baseline" },
        { parameter: "Failure Rate (Reactive)", value: "6", unit: "failures/year" },
        { parameter: "Average Repair Cost", value: "$2000", unit: "per failure" },
        { parameter: "Preventive Strategy", value: "Proposed", unit: "alternative" },
        { parameter: "PM Frequency", value: "Monthly", unit: "12/year" },
        { parameter: "PM Cost", value: "$300", unit: "per PM" },
        { parameter: "Reduced Failure Rate", value: "2", unit: "failures/year" }
      ],
      calculation: "Reactive Maintenance Strategy:\nFailure Repairs = 6 × $2000 = $12,000\nDowntime Cost = 6 × 12 × $150 = $10,800\nTotal Reactive Cost = $12,000 + $10,800 = $22,800\n\nPreventive Maintenance Strategy:\nPM Cost = 12 × $300 = $3,600\nPM Downtime = 12 × 2 × $150 = $3,600\nRemaining Failures = 2 × $2000 = $4,000\nFailure Downtime = 2 × 12 × $150 = $3,600\nTotal Preventive Cost = $3,600 + $3,600 + $4,000 + $3,600 = $14,800\n\nAnnual Savings = $22,800 - $14,800 = $8,000",
      result: "Reactive: $22,800, Preventive: $14,800, Savings: $8,000 (35%)",
      insights: [
        "Preventive strategy reduces total cost by 35%",
        "Significant reduction in unplanned downtime",
        "Investment in PM pays for itself through reduced failures",
        "Improved production reliability and scheduling predictability"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Maintenance Cost Planning and Budgeting",
      description: "Systematic approaches to planning and budgeting maintenance costs",
      tips: [
        "Develop detailed maintenance cost breakdowns by equipment and activity",
        "Use historical data to establish realistic cost baselines",
        "Include contingency funds for unexpected repairs",
        "Consider lifecycle costs when making equipment decisions",
        "Regular review and adjustment of maintenance budgets"
      ],
      commonMistakes: [
        "Underestimating the true cost of downtime",
        "Not accounting for indirect costs like overtime and expedited shipping",
        "Focusing only on parts costs while ignoring labor and downtime",
        "Not tracking actual costs against budgets for continuous improvement",
        "Failing to consider the cost of deferred maintenance"
      ]
    },
    {
      title: "Preventive Maintenance Optimization",
      description: "Strategies for optimizing preventive maintenance schedules and costs",
      tips: [
        "Use reliability data to optimize maintenance intervals",
        "Implement condition-based maintenance where cost-effective",
        "Group maintenance activities to minimize downtime",
        "Train operators on basic maintenance tasks",
        "Use predictive maintenance technologies to prevent failures"
      ],
      commonMistakes: [
        "Over-maintaining equipment beyond economic benefit",
        "Not adjusting maintenance intervals based on actual operating conditions",
        "Performing maintenance too frequently without data justification",
        "Not considering the total cost of maintenance including downtime",
        "Ignoring manufacturer recommendations without proper analysis"
      ]
    },
    {
      title: "Maintenance Cost Control and Reduction",
      description: "Methods for controlling and reducing maintenance costs",
      tips: [
        "Implement maintenance cost tracking and reporting systems",
        "Negotiate volume discounts with parts suppliers",
        "Standardize parts and procedures across similar equipment",
        "Invest in technician training to improve efficiency",
        "Consider maintenance contracts for specialized equipment"
      ],
      commonMistakes: [
        "Cutting maintenance budgets without considering long-term consequences",
        "Not investing in proper tools and equipment for maintenance",
        "Using lowest-cost parts without considering quality and reliability",
        "Not measuring maintenance effectiveness and efficiency",
        "Ignoring the relationship between maintenance and production quality"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 55000",
      organization: "International Organization for Standardization",
      description: "Asset management systems - Overview, principles and terminology",
      applicability: ["Asset Management", "Maintenance Strategy", "Cost Optimization"]
    },
    {
      standard: "ISO 14224",
      organization: "International Organization for Standardization",
      description: "Petroleum, petrochemical and natural gas industries - Collection and exchange of reliability and maintenance data",
      applicability: ["Reliability Data", "Maintenance Planning", "Cost Analysis"]
    },
    {
      standard: "SMRP Best Practices",
      organization: "Society for Maintenance & Reliability Professionals",
      description: "Best practices for maintenance and reliability management",
      applicability: ["Maintenance Excellence", "Cost Management", "Performance Improvement"]
    }
  ];

  const relatedCalculators = [
    "Equipment ROI Calculator",
    "Downtime Cost Calculator",
    "Reliability Analysis Calculator",
    "Lifecycle Cost Calculator",
    "Spare Parts Optimizer"
  ];

  const downloadableResources = [
    {
      name: "Maintenance Cost Tracking Template",
      url: "/resources/maintenance-cost-tracking.xlsx",
      type: "XLSX"
    },
    {
      name: "PM Schedule Optimizer",
      url: "/resources/pm-schedule-optimizer.xlsx",
      type: "XLSX"
    },
    {
      name: "Maintenance Budget Planning Guide",
      url: "/resources/maintenance-budget-guide.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Maintenance Cost Estimator"
      calculatorDescription="Master maintenance cost estimation and optimization for laser cutting equipment. Learn to calculate preventive and corrective maintenance costs, optimize maintenance strategies, and develop effective maintenance budgets for cost control."
      category="Cost Analysis"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/maintenance-cost-estimator"
      downloadableResources={downloadableResources}
    />
  );
};

export default MaintenanceCostEstimatorLearn;

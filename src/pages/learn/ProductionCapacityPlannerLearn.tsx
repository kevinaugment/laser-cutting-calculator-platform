import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const ProductionCapacityPlannerLearn: React.FC = () => {
  const learningObjectives = [
    "Understand production capacity concepts and calculation methods",
    "Learn to plan and optimize laser cutting production capacity",
    "Master bottleneck identification and capacity constraint analysis",
    "Apply capacity planning for demand forecasting and resource allocation",
    "Develop skills in production scheduling and efficiency optimization"
  ];

  const keyFormulas = [
    {
      name: "Theoretical Capacity",
      formula: "Theoretical Capacity = Available Hours × Maximum Production Rate",
      description: "Maximum possible production under ideal conditions",
      variables: [
        { symbol: "Available Hours", description: "Total available operating hours", unit: "hours" },
        { symbol: "Maximum Production Rate", description: "Peak production rate", unit: "pieces/hour" }
      ]
    },
    {
      name: "Effective Capacity",
      formula: "Effective Capacity = Theoretical Capacity × Efficiency Factor",
      description: "Realistic production capacity considering real-world constraints",
      variables: [
        { symbol: "Theoretical Capacity", description: "Maximum possible capacity", unit: "pieces" },
        { symbol: "Efficiency Factor", description: "Overall efficiency percentage", unit: "0.6-0.9" }
      ]
    },
    {
      name: "Capacity Utilization",
      formula: "Utilization = (Actual Output / Effective Capacity) × 100",
      description: "Percentage of available capacity being used",
      variables: [
        { symbol: "Actual Output", description: "Actual production achieved", unit: "pieces" },
        { symbol: "Effective Capacity", description: "Available production capacity", unit: "pieces" }
      ]
    },
    {
      name: "Bottleneck Capacity",
      formula: "System Capacity = MIN(Process₁, Process₂, ..., Processₙ)",
      description: "Overall system capacity limited by the slowest process",
      variables: [
        { symbol: "Process Capacity", description: "Individual process capacity", unit: "pieces/hour" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Single Machine Capacity Planning",
      scenario: "Planning capacity for a fiber laser cutting machine operating 16 hours/day, 5 days/week. Average cutting time is 3 minutes per piece, setup time is 15 minutes per job, with 85% efficiency.",
      inputs: [
        { parameter: "Operating Hours", value: "16", unit: "hours/day" },
        { parameter: "Working Days", value: "5", unit: "days/week" },
        { parameter: "Cutting Time", value: "3", unit: "minutes/piece" },
        { parameter: "Setup Time", value: "15", unit: "minutes/job" },
        { parameter: "Average Job Size", value: "50", unit: "pieces/job" },
        { parameter: "Efficiency Factor", value: "85", unit: "%" }
      ],
      calculation: "Weekly Available Hours = 16 × 5 = 80 hours\nTime per Job = (3 × 50) + 15 = 165 minutes = 2.75 hours\nJobs per Week = 80 / 2.75 = 29.1 jobs\nTheoretical Weekly Output = 29.1 × 50 = 1,455 pieces\nEffective Capacity = 1,455 × 0.85 = 1,237 pieces/week\nDaily Capacity = 1,237 / 5 = 247 pieces/day",
      result: "Weekly capacity: 1,237 pieces, Daily capacity: 247 pieces",
      insights: [
        "Setup time significantly impacts capacity for small job sizes",
        "85% efficiency factor accounts for real-world constraints",
        "Larger job sizes would improve capacity utilization",
        "Machine utilization is limited by setup overhead"
      ]
    },
    {
      title: "Multi-Machine Production Line",
      scenario: "Capacity planning for a production line with 3 laser cutting machines, 2 bending machines, and 1 welding station. Analyzing bottlenecks and overall system capacity.",
      inputs: [
        { parameter: "Laser Machines", value: "3", unit: "machines" },
        { parameter: "Laser Capacity", value: "100", unit: "pieces/hour each" },
        { parameter: "Bending Machines", value: "2", unit: "machines" },
        { parameter: "Bending Capacity", value: "120", unit: "pieces/hour each" },
        { parameter: "Welding Stations", value: "1", unit: "station" },
        { parameter: "Welding Capacity", value: "80", unit: "pieces/hour" }
      ],
      calculation: "Laser Cutting Capacity = 3 × 100 = 300 pieces/hour\nBending Capacity = 2 × 120 = 240 pieces/hour\nWelding Capacity = 1 × 80 = 80 pieces/hour\n\nBottleneck Analysis:\nWelding is the bottleneck at 80 pieces/hour\nSystem Capacity = 80 pieces/hour\n\nUtilization Rates:\nLaser: 80/300 = 27%\nBending: 80/240 = 33%\nWelding: 80/80 = 100%",
      result: "System capacity: 80 pieces/hour, Bottleneck: Welding station",
      insights: [
        "Welding station limits overall production capacity",
        "Laser cutting machines are significantly underutilized",
        "Adding welding capacity would increase system throughput",
        "Bending machines also have excess capacity"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Capacity Assessment and Planning",
      description: "Systematic approach to evaluating and planning production capacity",
      tips: [
        "Analyze historical production data for realistic capacity estimates",
        "Consider seasonal demand variations in capacity planning",
        "Account for maintenance downtime and equipment reliability",
        "Include operator availability and skill level in calculations",
        "Plan for quality issues and rework in capacity estimates"
      ],
      commonMistakes: [
        "Using theoretical maximum capacity without efficiency factors",
        "Not accounting for setup and changeover times",
        "Ignoring the impact of product mix on capacity",
        "Failing to identify and address bottlenecks",
        "Not considering operator breaks and shift changes"
      ]
    },
    {
      title: "Bottleneck Management",
      description: "Strategies for identifying and managing production bottlenecks",
      tips: [
        "Regularly monitor and identify shifting bottlenecks",
        "Focus improvement efforts on bottleneck processes",
        "Consider outsourcing bottleneck operations when cost-effective",
        "Implement buffer inventory before bottleneck processes",
        "Cross-train operators to provide flexibility at bottlenecks"
      ],
      commonMistakes: [
        "Optimizing non-bottleneck processes while ignoring bottlenecks",
        "Not recognizing when bottlenecks shift between processes",
        "Overloading bottleneck processes without considering quality",
        "Failing to maintain equipment at bottleneck operations",
        "Not having backup plans for bottleneck equipment failures"
      ]
    },
    {
      title: "Capacity Optimization Strategies",
      description: "Methods to maximize production capacity and efficiency",
      tips: [
        "Implement lean manufacturing principles to reduce waste",
        "Optimize job sequencing to minimize setup times",
        "Use predictive maintenance to maximize equipment availability",
        "Consider automation to increase capacity and consistency",
        "Implement flexible scheduling to accommodate demand variations"
      ],
      commonMistakes: [
        "Adding capacity without addressing underlying inefficiencies",
        "Not considering the total cost of capacity expansion",
        "Focusing on equipment capacity while ignoring labor constraints",
        "Implementing changes without measuring impact on capacity",
        "Not aligning capacity planning with business strategy"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 22400-2",
      organization: "International Organization for Standardization",
      description: "Manufacturing operations management - Key performance indicators including capacity metrics",
      applicability: ["Capacity Measurement", "Performance Indicators", "Manufacturing Operations"]
    },
    {
      standard: "ANSI/ISA-95",
      organization: "International Society of Automation",
      description: "Enterprise-control system integration standards for production planning",
      applicability: ["Production Planning", "Capacity Management", "Manufacturing Systems"]
    },
    {
      standard: "APICS SCOR Model",
      organization: "Association for Supply Chain Management",
      description: "Supply Chain Operations Reference model including capacity planning",
      applicability: ["Supply Chain Planning", "Capacity Strategy", "Operations Management"]
    }
  ];

  const relatedCalculators = [
    "Machine Utilization Calculator",
    "Production Scheduling Calculator",
    "Bottleneck Analysis Calculator",
    "Workforce Planning Calculator",
    "Equipment ROI Calculator"
  ];

  const downloadableResources = [
    {
      name: "Capacity Planning Worksheet",
      url: "/resources/capacity-planning-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "Bottleneck Analysis Template",
      url: "/resources/bottleneck-analysis-template.xlsx",
      type: "XLSX"
    },
    {
      name: "Production Capacity Dashboard",
      url: "/resources/capacity-dashboard-template.xlsx",
      type: "XLSX"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Production Capacity Planner"
      calculatorDescription="Master production capacity planning for laser cutting operations. Learn to calculate theoretical and effective capacity, identify bottlenecks, and optimize production systems for maximum efficiency. Essential for production managers and operations planners."
      category="Production Management"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/production-capacity-planner"
      downloadableResources={downloadableResources}
    />
  );
};

export default ProductionCapacityPlannerLearn;

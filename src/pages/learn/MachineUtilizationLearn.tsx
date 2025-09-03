import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const MachineUtilizationLearn: React.FC = () => {
  const learningObjectives = [
    "Understand machine utilization concepts and key performance indicators",
    "Learn to calculate and analyze machine utilization rates effectively",
    "Master techniques for improving equipment utilization and productivity",
    "Identify bottlenecks and optimization opportunities in production",
    "Apply utilization analysis to make informed capacity planning decisions"
  ];

  const keyFormulas = [
    {
      name: "Machine Utilization Rate",
      formula: "Utilization Rate = (Actual Operating Time / Available Time) × 100",
      description: "Measures the percentage of available time that equipment is actually operating",
      variables: [
        { symbol: "Actual Operating Time", description: "Time machine was actually running", unit: "hours" },
        { symbol: "Available Time", description: "Total time machine was available for operation", unit: "hours" }
      ]
    },
    {
      name: "Effective Utilization",
      formula: "Effective Utilization = (Productive Time / Total Scheduled Time) × 100",
      description: "Measures productive time as percentage of total scheduled time",
      variables: [
        { symbol: "Productive Time", description: "Time spent on value-adding activities", unit: "hours" },
        { symbol: "Total Scheduled Time", description: "Total time scheduled for operation", unit: "hours" }
      ]
    },
    {
      name: "Capacity Utilization",
      formula: "Capacity Utilization = (Actual Output / Maximum Capacity) × 100",
      description: "Compares actual production output to theoretical maximum capacity",
      variables: [
        { symbol: "Actual Output", description: "Actual production volume achieved", unit: "units" },
        { symbol: "Maximum Capacity", description: "Theoretical maximum production capacity", unit: "units" }
      ]
    },
    {
      name: "Utilization Efficiency",
      formula: "Utilization Efficiency = (Standard Time / Actual Time) × 100",
      description: "Measures how efficiently time is used compared to standard expectations",
      variables: [
        { symbol: "Standard Time", description: "Expected time for the operation", unit: "hours" },
        { symbol: "Actual Time", description: "Actual time taken for the operation", unit: "hours" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Fiber Laser Utilization Analysis",
      scenario: "A fiber laser cutting machine operates 16 hours per day, 5 days per week. Last week, it had 8 hours of planned maintenance, 6 hours of unplanned downtime, and 4 hours of setup time. The remaining time was spent on productive cutting.",
      inputs: [
        { parameter: "Total Available Time", value: "80", unit: "hours/week" },
        { parameter: "Planned Maintenance", value: "8", unit: "hours" },
        { parameter: "Unplanned Downtime", value: "6", unit: "hours" },
        { parameter: "Setup Time", value: "4", unit: "hours" },
        { parameter: "Productive Cutting Time", value: "62", unit: "hours" }
      ],
      calculation: "Available Operating Time = 80 - 8 = 72 hours\nActual Operating Time = 72 - 6 = 66 hours\nUtilization Rate = (66 / 72) × 100 = 91.7%\nEffective Utilization = (62 / 80) × 100 = 77.5%",
      result: "Machine Utilization: 91.7%, Effective Utilization: 77.5%",
      insights: [
        "High utilization rate indicates good availability management",
        "Gap between utilization and effective utilization shows setup inefficiency",
        "Unplanned downtime represents 8.3% loss in availability",
        "Setup time optimization could improve effective utilization"
      ]
    },
    {
      title: "Multi-Machine Comparison",
      scenario: "Comparing three laser cutting machines over a month. Machine A: 720 hours available, 648 hours operating. Machine B: 720 hours available, 684 hours operating. Machine C: 720 hours available, 612 hours operating.",
      inputs: [
        { parameter: "Machine A - Available Time", value: "720", unit: "hours" },
        { parameter: "Machine A - Operating Time", value: "648", unit: "hours" },
        { parameter: "Machine B - Available Time", value: "720", unit: "hours" },
        { parameter: "Machine B - Operating Time", value: "684", unit: "hours" },
        { parameter: "Machine C - Available Time", value: "720", unit: "hours" },
        { parameter: "Machine C - Operating Time", value: "612", unit: "hours" }
      ],
      calculation: "Machine A Utilization = (648 / 720) × 100 = 90.0%\nMachine B Utilization = (684 / 720) × 100 = 95.0%\nMachine C Utilization = (612 / 720) × 100 = 85.0%\nAverage Utilization = (90.0 + 95.0 + 85.0) / 3 = 90.0%",
      result: "Machine A: 90.0%, Machine B: 95.0%, Machine C: 85.0%, Average: 90.0%",
      insights: [
        "Machine B shows best utilization performance",
        "Machine C has lowest utilization - investigate causes",
        "10% variation between best and worst performers",
        "Opportunity to standardize best practices across machines"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "Data Collection and Monitoring",
      description: "Establish systematic data collection for accurate utilization measurement",
      tips: [
        "Implement automated data collection systems",
        "Define clear categories for downtime classification",
        "Track both planned and unplanned downtime separately",
        "Monitor utilization in real-time with dashboards",
        "Establish consistent measurement periods and reporting"
      ],
      commonMistakes: [
        "Including planned maintenance in utilization calculations",
        "Not distinguishing between different types of downtime",
        "Using inconsistent time periods for comparison",
        "Relying on manual data collection prone to errors",
        "Not accounting for setup and changeover times"
      ]
    },
    {
      title: "Utilization Improvement Strategies",
      description: "Systematic approaches to improve machine utilization rates",
      tips: [
        "Reduce setup and changeover times through SMED techniques",
        "Implement preventive maintenance to reduce unplanned downtime",
        "Optimize production scheduling to minimize idle time",
        "Cross-train operators to reduce skill-based bottlenecks",
        "Use predictive maintenance to prevent unexpected failures"
      ],
      commonMistakes: [
        "Focusing only on utilization without considering quality",
        "Not addressing root causes of downtime",
        "Overloading machines beyond optimal operating parameters",
        "Ignoring operator training and skill development",
        "Not balancing utilization across multiple machines"
      ]
    },
    {
      title: "Benchmarking and Target Setting",
      description: "Establish realistic targets and benchmark against industry standards",
      tips: [
        "Set utilization targets based on equipment type and age",
        "Benchmark against industry standards and best practices",
        "Consider seasonal variations and market demand",
        "Account for planned maintenance and improvement activities",
        "Balance utilization targets with quality and safety requirements"
      ],
      commonMistakes: [
        "Setting unrealistic utilization targets (>95% for complex equipment)",
        "Not considering equipment-specific factors",
        "Comparing utilization across different equipment types",
        "Ignoring the impact of product mix on utilization",
        "Not adjusting targets based on changing business conditions"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "ISO 22400-2",
      organization: "International Organization for Standardization",
      description: "Manufacturing operations management - Key performance indicators for manufacturing operations management",
      applicability: ["Performance Measurement", "Manufacturing KPIs", "Utilization Standards"]
    },
    {
      standard: "ANSI/ISA-95",
      organization: "International Society of Automation",
      description: "Enterprise-control system integration standards for manufacturing operations",
      applicability: ["Manufacturing Systems", "Data Integration", "Performance Monitoring"]
    },
    {
      standard: "SEMI E10",
      organization: "Semiconductor Equipment and Materials International",
      description: "Specification for definition and measurement of equipment reliability, availability, and maintainability",
      applicability: ["Equipment Performance", "Reliability Analysis", "Maintenance Planning"]
    }
  ];

  const relatedCalculators = [
    "OEE Calculator",
    "Productivity Calculator",
    "Downtime Cost Calculator",
    "Capacity Planning Calculator",
    "Production Scheduling Calculator"
  ];

  const downloadableResources = [
    {
      name: "Machine Utilization Tracking Sheet",
      url: "/resources/machine-utilization-tracker.xlsx",
      type: "XLSX"
    },
    {
      name: "Utilization Improvement Action Plan",
      url: "/resources/utilization-improvement-plan.pdf",
      type: "PDF"
    },
    {
      name: "Industry Utilization Benchmarks",
      url: "/resources/utilization-benchmarks.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="Machine Utilization Calculator"
      calculatorDescription="Master machine utilization analysis to optimize equipment performance and productivity. Learn to measure, analyze, and improve utilization rates for laser cutting operations. Transform utilization data into actionable insights for capacity planning and operational excellence."
      category="Production Management"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/machine-utilization-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default MachineUtilizationLearn;

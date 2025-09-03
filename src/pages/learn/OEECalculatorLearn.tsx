import React from 'react';
import LearnPageTemplate from '../../components/learn/LearnPageTemplate';

const OEECalculatorLearn: React.FC = () => {
  const learningObjectives = [
    "Understand the concept and importance of Overall Equipment Effectiveness (OEE)",
    "Learn to calculate the three components: Availability, Performance, and Quality",
    "Master OEE benchmarking and improvement strategies",
    "Identify bottlenecks and improvement opportunities in production",
    "Apply OEE analysis to laser cutting operations for maximum efficiency"
  ];

  const keyFormulas = [
    {
      name: "Overall Equipment Effectiveness (OEE)",
      formula: "OEE = Availability × Performance × Quality",
      description: "The primary OEE calculation combining all three factors",
      variables: [
        { symbol: "Availability", description: "Percentage of scheduled time that equipment is available", unit: "%" },
        { symbol: "Performance", description: "Speed at which equipment runs as percentage of designed speed", unit: "%" },
        { symbol: "Quality", description: "Percentage of good parts produced", unit: "%" }
      ]
    },
    {
      name: "Availability",
      formula: "Availability = (Operating Time / Planned Production Time) × 100",
      description: "Measures the percentage of scheduled time that equipment is available to operate",
      variables: [
        { symbol: "Operating Time", description: "Actual time equipment was running", unit: "hours" },
        { symbol: "Planned Production Time", description: "Total scheduled production time", unit: "hours" }
      ]
    },
    {
      name: "Performance",
      formula: "Performance = (Ideal Cycle Time × Total Count) / Operating Time × 100",
      description: "Measures how fast the equipment runs compared to its designed speed",
      variables: [
        { symbol: "Ideal Cycle Time", description: "Theoretical fastest time to produce one piece", unit: "minutes/piece" },
        { symbol: "Total Count", description: "Total pieces produced", unit: "pieces" },
        { symbol: "Operating Time", description: "Time equipment was actually running", unit: "minutes" }
      ]
    },
    {
      name: "Quality",
      formula: "Quality = (Good Count / Total Count) × 100",
      description: "Measures the percentage of produced parts that meet quality standards",
      variables: [
        { symbol: "Good Count", description: "Number of parts meeting quality standards", unit: "pieces" },
        { symbol: "Total Count", description: "Total number of parts produced", unit: "pieces" }
      ]
    }
  ];

  const practicalExamples = [
    {
      title: "Fiber Laser Cutting Line Analysis",
      scenario: "A fiber laser cutting line operates 16 hours per day. During one shift, it was scheduled to run for 8 hours but had 1 hour of downtime. The ideal cycle time is 2 minutes per part, and 180 parts were produced with 12 defective parts.",
      inputs: [
        { parameter: "Planned Production Time", value: "8", unit: "hours" },
        { parameter: "Downtime", value: "1", unit: "hour" },
        { parameter: "Operating Time", value: "7", unit: "hours" },
        { parameter: "Ideal Cycle Time", value: "2", unit: "minutes/part" },
        { parameter: "Total Parts Produced", value: "180", unit: "parts" },
        { parameter: "Defective Parts", value: "12", unit: "parts" }
      ],
      calculation: "Availability = (7 hours / 8 hours) × 100 = 87.5%\nPerformance = (2 min × 180 parts) / (7 × 60 min) × 100 = 85.7%\nQuality = ((180 - 12) / 180) × 100 = 93.3%\nOEE = 87.5% × 85.7% × 93.3% = 70.0%",
      result: "OEE: 70.0% (Availability: 87.5%, Performance: 85.7%, Quality: 93.3%)",
      insights: [
        "OEE of 70% is above average but has room for improvement",
        "Availability loss due to unplanned downtime needs investigation",
        "Performance indicates potential speed optimization opportunities",
        "Quality rate is good but defect reduction could improve OEE"
      ]
    },
    {
      title: "CO2 Laser Performance Comparison",
      scenario: "Comparing two CO2 laser machines over a week. Machine A: 40 hours planned, 36 hours operating, 450 parts (ideal: 5 min/part), 27 defects. Machine B: 40 hours planned, 38 hours operating, 400 parts (ideal: 6 min/part), 16 defects.",
      inputs: [
        { parameter: "Machine A - Operating Time", value: "36", unit: "hours" },
        { parameter: "Machine A - Parts Produced", value: "450", unit: "parts" },
        { parameter: "Machine A - Defective Parts", value: "27", unit: "parts" },
        { parameter: "Machine B - Operating Time", value: "38", unit: "hours" },
        { parameter: "Machine B - Parts Produced", value: "400", unit: "parts" },
        { parameter: "Machine B - Defective Parts", value: "16", unit: "parts" }
      ],
      calculation: "Machine A OEE:\nAvailability = 36/40 = 90.0%\nPerformance = (5×450)/(36×60) = 104.2%\nQuality = (450-27)/450 = 94.0%\nOEE = 90.0% × 104.2% × 94.0% = 88.1%\n\nMachine B OEE:\nAvailability = 38/40 = 95.0%\nPerformance = (6×400)/(38×60) = 105.3%\nQuality = (400-16)/400 = 96.0%\nOEE = 95.0% × 105.3% × 96.0% = 96.1%",
      result: "Machine A OEE: 88.1%, Machine B OEE: 96.1%",
      insights: [
        "Machine B significantly outperforms Machine A",
        "Both machines exceed 100% performance (running faster than design)",
        "Machine B has better availability and quality rates",
        "Focus improvement efforts on Machine A's availability"
      ]
    }
  ];

  const bestPractices = [
    {
      title: "OEE Data Collection and Accuracy",
      description: "Ensure accurate and consistent data collection for reliable OEE calculations",
      tips: [
        "Use automated data collection systems when possible",
        "Define clear criteria for downtime categorization",
        "Establish standard definitions for quality defects",
        "Train operators on proper data recording procedures",
        "Validate data accuracy through regular audits"
      ],
      commonMistakes: [
        "Including planned maintenance in availability calculations",
        "Not accounting for setup and changeover times properly",
        "Inconsistent quality standards across shifts",
        "Using theoretical rather than proven ideal cycle times",
        "Not capturing all sources of downtime"
      ]
    },
    {
      title: "OEE Improvement Strategies",
      description: "Systematic approach to improving OEE through targeted interventions",
      tips: [
        "Focus on the lowest performing component first",
        "Implement preventive maintenance programs",
        "Optimize setup and changeover procedures",
        "Provide operator training and skill development",
        "Use statistical process control for quality improvement"
      ],
      commonMistakes: [
        "Trying to improve all three components simultaneously",
        "Not addressing root causes of losses",
        "Focusing only on equipment without considering operators",
        "Implementing changes without measuring impact",
        "Not sustaining improvements over time"
      ]
    },
    {
      title: "OEE Benchmarking and Targets",
      description: "Set realistic targets and benchmark against industry standards",
      tips: [
        "Establish baseline OEE before setting improvement targets",
        "Use industry benchmarks for context",
        "Set progressive improvement goals",
        "Consider equipment age and technology in targets",
        "Benchmark against best-performing similar equipment"
      ],
      commonMistakes: [
        "Setting unrealistic OEE targets (>95% for complex equipment)",
        "Not considering equipment-specific factors",
        "Comparing OEE across different types of equipment",
        "Not adjusting targets based on product mix changes",
        "Focusing only on OEE without considering profitability"
      ]
    }
  ];

  const industryStandards = [
    {
      standard: "SEMI E10",
      organization: "Semiconductor Equipment and Materials International",
      description: "Standard for equipment reliability, availability, and maintainability",
      applicability: ["Equipment Performance", "Reliability Analysis", "Maintenance Planning"]
    },
    {
      standard: "ISO 22400",
      organization: "International Organization for Standardization",
      description: "Manufacturing operations management - Key performance indicators",
      applicability: ["Performance Measurement", "Manufacturing KPIs", "OEE Standards"]
    },
    {
      standard: "ANSI/ISA-95",
      organization: "International Society of Automation",
      description: "Enterprise-control system integration for manufacturing operations",
      applicability: ["Manufacturing Systems", "Data Integration", "Performance Monitoring"]
    }
  ];

  const relatedCalculators = [
    "Machine Utilization Calculator",
    "Productivity Calculator",
    "Production Scheduling Calculator",
    "Quality Control Calculator",
    "Maintenance Cost Calculator"
  ];

  const downloadableResources = [
    {
      name: "OEE Calculation Worksheet",
      url: "/resources/oee-calculation-worksheet.xlsx",
      type: "XLSX"
    },
    {
      name: "OEE Improvement Action Plan Template",
      url: "/resources/oee-improvement-plan.pdf",
      type: "PDF"
    },
    {
      name: "Industry OEE Benchmarks",
      url: "/resources/oee-benchmarks.pdf",
      type: "PDF"
    }
  ];

  return (
    <LearnPageTemplate
      calculatorName="OEE Calculator"
      calculatorDescription="Master Overall Equipment Effectiveness (OEE) analysis to optimize your laser cutting operations. Learn to measure and improve availability, performance, and quality to achieve world-class manufacturing efficiency. Transform your production data into actionable insights for continuous improvement."
      category="Production Management"
      difficulty="Intermediate"
      learningObjectives={learningObjectives}
      keyFormulas={keyFormulas}
      practicalExamples={practicalExamples}
      bestPractices={bestPractices}
      industryStandards={industryStandards}
      relatedCalculators={relatedCalculators}
      videoTutorialUrl="/tutorials/oee-calculator"
      downloadableResources={downloadableResources}
    />
  );
};

export default OEECalculatorLearn;
